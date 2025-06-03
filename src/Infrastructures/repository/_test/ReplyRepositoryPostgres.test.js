const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const SavedReply = require('../../../Domains/replies/entities/SavedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  // add user data because reply need userId to fill owner
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist new reply and return saved reply correctly', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const commentId = 'comment-123';
      const newReply = new NewReply({
        content: 'Reply content',
      }, credentialUser, commentId);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return saved reply correctly', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const commentId = 'comment-123';
      const newReply = new NewReply({
        content: 'Reply content',
      }, credentialUser, commentId);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const savedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(savedReply).toStrictEqual(new SavedReply({
        id: 'reply-123',
        content: 'Reply content',
        owner: credentialUser,
      }));
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when user is not the owner', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const commentId = 'comment-123';
      const newReply = new NewReply({
        content: 'Reply content',
      }, credentialUser, commentId);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      await replyRepositoryPostgres.addReply(newReply);
      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456'))
        .rejects.toThrow(AuthorizationError);
    });
    it('should not throw AuthorizationError when user is the owner', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const commentId = 'comment-123';
      const newReply = new NewReply({
        content: 'Reply content',
      }, credentialUser, commentId);
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      await replyRepositoryPostgres.addReply(newReply);
      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', credentialUser))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('validateAvailableReply function', () => {
    it('should throw NotFoundError when reply is not found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({});
      const replyId = 'reply-999';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepositoryPostgres.validateAvailableReply(replyId))
        .rejects.toThrow('Reply tidak ditemukan');
    });
    it('should throw NotFoundError when reply is deleted', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ is_deleted: 'ya' });
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepositoryPostgres.validateAvailableReply(replyId))
        .rejects.toThrow('Reply tidak ditemukan');
    });
    it('should not throw NotFoundError when reply is found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({});
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepositoryPostgres.validateAvailableReply(replyId))
        .resolves.not.toThrow('Reply tidak ditemukan');
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply with soft delete', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({});

      const credentialUser = 'user-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.deleteReply(credentialUser, replyId, commentId);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById(replyId);
      expect(reply).toHaveLength(0);
    });
  });

  describe('getReplyByCommentId', () => {
    it('should return replies by commentId', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({});
      const commentId = 'comment-123';
      const expectReply = {
        id: 'reply-123',
        username: 'dicoding',
        date: expect.any(String),
        content: expect.any(String),
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getReplyByCommentId(commentId);

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0]).toMatchObject(expectReply);
    });
  });
});
