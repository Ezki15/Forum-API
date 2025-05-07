const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
// add user data because thread need userId to fill owner
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread title',
        body: 'Thread body',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${await ThreadsTableTestHelper.generateMockToken()}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread title',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: true,
        body: 123,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threds/{threadId}', () => {
    it('should response 200 and return thread detail', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const threadId = 'thread-123';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
        headers: {
          Authorization: `Bearer ${await ThreadsTableTestHelper.generateMockToken()}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const threadId = 'thread-345';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
        headers: {
          Authorization: `Bearer ${await ThreadsTableTestHelper.generateMockToken()}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  it('should response thread detail with comments content included', async () => {
    // Arrange
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
    const threadId = 'thread-123';
    const expectedResponse = {
      status: 'success',
      data: {
        thread: {
          id: threadId,
          title: 'Thread title',
          body: 'Thread body',
          date: expect.any(String),
          username: 'dicoding',
          comments: [
            {
              id: 'comment-123',
              username: 'dicoding',
              date: expect.any(String),
              content: 'Comment content',
            },
          ],
        },
      },
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'GET',
      url: `/threads/${threadId}`,
      headers: {
        Authorization: `Bearer ${await ThreadsTableTestHelper.generateMockToken()}`,
      },
    });
    const responseJson = JSON.parse(response.payload);
    // Assert
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
    expect(responseJson).toEqual(expectedResponse);
  });

  it('should response thread detail with comments content included and is_delete = ya', async () => {
    // Arrange
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({ is_delete: 'ya' });
    const threadId = 'thread-123';
    const expectedResponse = {
      status: 'success',
      data: {
        thread: {
          id: threadId,
          title: 'Thread title',
          body: 'Thread body',
          date: expect.any(String),
          username: 'dicoding',
          comments: [
            {
              id: 'comment-123',
              username: 'dicoding',
              date: expect.any(String),
              content: '**komentar telah dihapus**',
            },
          ],
        },
      },
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'GET',
      url: `/threads/${threadId}`,
      headers: {
        Authorization: `Bearer ${await ThreadsTableTestHelper.generateMockToken()}`,
      },
    });
    const responseJson = JSON.parse(response.payload);
    // Assert
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
    expect(responseJson).toEqual(expectedResponse);
  });
});
