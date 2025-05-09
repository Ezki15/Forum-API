const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const SavedThread = require('../../../Domains/threads/entities/SavedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  // add user data because thread need userId to fill owner
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return saved thread correctly', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
      }, credentialUser);
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      //   Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return saved thread correctly', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
      }, credentialUser);

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const savedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(savedThread).toStrictEqual(new SavedThread({
        id: 'thread-123',
        title: newThread.title,
        owner: 'user-123',
      }));
    });
  });
  describe('verifyThreadOwner function', () => {
    it('should thow NotFoundError when thread not found', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
      }, credentialUser);

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('thread-345', 'use-123')).rejects.toThrow(NotFoundError);
    });
    it('should throw AuthorizationError when owner not similar with user credential', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
      }, credentialUser);

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('thread-123', 'user-345')).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when owner similar with user credential', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
      }, credentialUser);

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('thread-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('getThreadById function', () => {
    it('should return thread correctly', async () => {
      // Arrange
      const credentialUser = 'user-123';
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
      }, credentialUser);
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread, 'user-123');
      const thread = await threadRepositoryPostgres.getThreadById('thread-123', 'user-123');

      // Assert
      expect(thread).toStrictEqual(
        {
          id: 'thread-123',
          title: 'Thread title',
          body: 'Thread body',
          create_at: thread.create_at,
          owner: 'user-123',
        },
      );
    });
  });
  describe('getThreadDetailById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      const threadId = 'thread-345';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(threadRepositoryPostgres.getThreadDetailById(threadId)).rejects.toThrow(NotFoundError);
    });

    it('should return thread detail correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      const threadId = 'thread-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadDetailById(threadId);

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'Thread title',
        body: 'Thread body',
        date: expect.any(String),
        username: 'dicoding',
      });
    });
  });
});
