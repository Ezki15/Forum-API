const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  // add user, thread, and comment data because reply need userId, threadId, and commentId to fill owner, thread, and comment
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterAll(async () => {
    const server = await createServer(container);
    await server.stop();
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'Reply content',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${await RepliesTableTestHelper.generateMockToken()}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${await RepliesTableTestHelper.generateMockToken()}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('when DELETE /replies', () => {
    it('should response 200 and delete reply', async () => {
      // Initial setup
      await RepliesTableTestHelper.addReply({});

      // Arrange
      const replyId = 'reply-123';
      const commentId = 'comment-123';
      const threadId = 'thread-123';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${await RepliesTableTestHelper.generateMockToken()}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
