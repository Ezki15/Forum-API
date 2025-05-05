/* eslint-disable camelcase */
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const SavedComment = require('../../Domains/comments/entities/SavedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, owner, threadId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const is_delete = 'tidak';

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, is_delete, threadId],
    };

    const result = await this._pool.query(query);

    return new SavedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    const comment = result.rows[0];

    if (!comment) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    if (comment.owner !== owner) {
      throw new AuthorizationError('Tidak dapat mengakses sumber ini!');
    }
  }

  async getCommentById(commentId, owner) {
    // verify owner comment
    await this.verifyCommentOwner(commentId, owner);

    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deleteComment(commentId, owner, threadId) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1 AND owner = $2 AND thread_id = $3',
      values: [commentId, owner, threadId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
