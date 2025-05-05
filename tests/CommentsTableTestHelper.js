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
    threadId = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, owner, is_delete, threadId],
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

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
