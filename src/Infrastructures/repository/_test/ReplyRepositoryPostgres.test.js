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
});
