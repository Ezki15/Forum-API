const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
// add user data because thread need userId to fill owner
  beforeEach(async () => {
    await pool.query(`
      INSERT INTO users(id, username, password, fullname)
      VALUES('user-123', 'testuser', 'encrypted', 'Test User')`);
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
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: 'user-123',
          },
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

    // Ini untuk method GET

    // it('should response 401 when request payload not contain authentication', async () => {
    //   // Arrange
    //   const requestPayload = {
    //     title: 'Thread title',
    //     body: 'Thread body',
    //   };
    //   const server = await createServer(container);

    //   // Action
    //   const response = await server.inject({
    //     method: 'POST',
    //     url: '/threads',
    //     payload: requestPayload,
    //   });

    //   // Assert
    //   const responseJson = JSON.parse(response.payload);
    //   expect(response.statusCode).toEqual(401);
    //   expect(responseJson.status).toEqual('fail');
    //   expect(responseJson.message).toEqual('Missing authentication');
    // });

    // it('should response 403 when request payload not contain authorization', async () => {
    //   // Arrange
    //   const requestPayload = {
    //     title: 'Thread title',
    //     body: 'Thread body',
    //   };
    //   const server = await createServer(container);

    //   // Action
    //   const response = await server.inject({
    //     method: 'POST',
    //     url: '/threads',
    //     payload: requestPayload,
    //     auth: {
    //       strategy: 'forum_api_jwt',
    //       credentials: {
    //         id: 'user-123',
    //       },
    //     },
    //   });

    //   // Assert
    //   const responseJson = JSON.parse(response.payload);
    //   expect(response.statusCode).toEqual(403);
    //   expect(responseJson.status).toEqual('fail');
    //   expect(responseJson.message).toEqual('anda tidak berhak mengakses resource ini');
    // });
  });
});
