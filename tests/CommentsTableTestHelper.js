/** instanbul ignore file */

const Jwt = require('@hapi/jwt');
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async generateMockToken() {
    const payload = { id: 'user-123' };

    return Jwt.token.generate(payload, {
      key: process.env.ACCESS_TOKEN_KEY,
    });
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
