/* eslint-disable camelcase */
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const SavedReply = require('../../Domains/replies/entities/SavedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, owner, commentId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const is_deleted = 'tidak';
    const create_at = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, is_deleted, create_at, commentId],
    };

    const result = await this._pool.query(query);

    return new SavedReply({ ...result.rows[0] });
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    const reply = result.rows[0];
    if (reply.owner !== owner) {
      throw new AuthorizationError('Tidak dapat mengakses sumber ini!');
    }
  }

  async deleteReply(owner, replyId, commentId) {
    const is_deleted = 'ya';
    const query = {
      text: 'UPDATE replies SET is_deleted = $1 WHERE id = $2 AND owner = $3 AND comment_id = $4',
      values: [is_deleted, replyId, owner, commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
