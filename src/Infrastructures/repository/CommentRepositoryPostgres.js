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
    const create_at = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, is_delete, create_at, threadId],
    };

    const result = await this._pool.query(query);

    return new SavedComment({ ...result.rows[0] });
  }

  async validateAvailableThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
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
    const is_delete = 'ya';
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2 AND owner = $3 AND thread_id = $4',
      values: [is_delete, commentId, owner, threadId],
    };

    await this._pool.query(query);
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.create_at AS date, comments.is_delete, users.username
            FROM comments LEFT JOIN users ON comments.owner = users.id WHERE thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    console.log(result.rows);

    const comments = result.rows.map((row) => {
      if (row.is_delete === 'ya') {
        return {
          id: row.id,
          username: row.username,
          date: row.date,
          content: '**komentar telah dihapus**',
        };
      }
      return {
        id: row.id,
        username: row.username,
        date: row.date,
        content: row.content,
      };
    });
    return comments;
  }
}

module.exports = CommentRepositoryPostgres;
