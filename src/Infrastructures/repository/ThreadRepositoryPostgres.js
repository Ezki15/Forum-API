const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const SavedThread = require('../../Domains/threads/entities/SavedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, createdAt, owner],
    };

    const result = await this._pool.query(query);

    return new SavedThread({ ...result.rows[0] });
  }

  async validateAvailableThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async verifyThreadOwner(threadId, owner) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const thread = result.rows[0];

    if (thread.owner !== owner) {
      throw new AuthorizationError('Tidak dapat mengakses sumber ini!');
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreadDetailById(threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.create_at AS date, users.username
            FROM threads LEFT JOIN users ON threads.owner = users.id WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
