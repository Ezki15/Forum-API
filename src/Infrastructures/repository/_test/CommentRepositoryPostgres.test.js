const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const SavedComment = require('../../../Domains/comments/entities/SavedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  // add user data because comment need userId to fill owner
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return saved comment correctly', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const threadId = 'thread-123';
      const newComment = new NewComment({
        content: 'Comment content',
      }, credentialUser, threadId);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return saved comment correctly', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const threadId = 'thread-123';
      const newComment = new NewComment({
        content: 'Comment content',
      }, credentialUser, threadId);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const savedComment = await commentRepositoryPostgres.addComment(newComment);
      // Assert
      expect(savedComment).toStrictEqual(new SavedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: credentialUser,
      }));
    });
  });
  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user is not the owner', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const threadId = 'thread-123';
      const newComment = new NewComment({
        content: 'Comment content',
      }, credentialUser, threadId);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      await commentRepositoryPostgres.addComment(newComment);
      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
        .rejects.toThrow(AuthorizationError);
    });
    it('should not throw AuthorizationError when user is the owner', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const threadId = 'thread-123';
      const newComment = new NewComment({
        content: 'Comment content',
      }, credentialUser, threadId);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      await commentRepositoryPostgres.addComment(newComment);
      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', credentialUser))
        .resolves.not.toThrow(AuthorizationError);
    });
  });
  describe('getCommentById function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const threadId = 'thread-123';
      const newComment = new NewComment({
        content: 'Comment content',
      }, credentialUser, threadId);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      await commentRepositoryPostgres.addComment(newComment);
      // Assert
      const comment = await commentRepositoryPostgres.getCommentById('comment-123', credentialUser);
      expect(comment).toStrictEqual({
        content: 'Comment content',
        id: 'comment-123',
        is_delete: 'tidak',
        owner: 'user-123',
        create_at: expect.any(String),
        thread_id: 'thread-123',
      });
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment with soft delete', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentId = 'comment-123';
      const credentialUser = 'user-123';
      const threadId = 'thread-123';

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.deleteComment(commentId, credentialUser, threadId);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comment).toHaveLength(0);
    });
  });

  describe('validateAvailableComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentId = 'comment-345';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.validateAvailableComment(commentId)).rejects.toThrow(NotFoundError);
    });
    it('should throw NotFoundError when comment is deleted', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ is_delete: 'ya' });
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.validateAvailableComment(commentId)).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.validateAvailableComment(commentId)).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return comments by threadId', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const threadId = 'thread-123';
      const expectComment = {
        id: 'comment-123',
        username: 'dicoding',
        date: expect.any(String),
        content: expect.any(String),
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(threadId);

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0]).toMatchObject(expectComment);
    });
  });
});
