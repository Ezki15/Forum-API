/* eslint-disable camelcase */
const Jwt = require('@hapi/jwt');
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'Reply content',
    owner = 'user-123',
    is_deleted = 'tidak',
    create_at = new Date().toISOString(),
    commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, is_deleted, create_at, commentId],
    };
    await pool.query(query);
  },
  async generateMockToken(userId = 'user-123') {
    const payload = { id: userId };

    return Jwt.token.generate(payload, {
      key: process.env.ACCESS_TOKEN_KEY,
    });
  },
  async findReplyById(id) {
    const initialValue = 'tidak';
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND is_deleted = $2',
      values: [id, initialValue],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
