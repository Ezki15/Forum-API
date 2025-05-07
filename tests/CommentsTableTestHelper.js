/* eslint-disable camelcase */
/** instanbul ignore file */

const Jwt = require('@hapi/jwt');
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'Comment content',
    owner = 'user-123',
    is_delete = 'tidak',
    create_at = new Date().toISOString(),
    threadId = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, is_delete, create_at, threadId],
    };
    await pool.query(query);
  },

  async generateMockToken(userId = 'user-123') {
    const payload = { id: userId };

    return Jwt.token.generate(payload, {
      key: process.env.ACCESS_TOKEN_KEY,
    });
  },

  async findCommentById(id) {
    const initialValue = 'tidak';
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_delete = $2',
      values: [id, initialValue],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: ['ya', id],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
