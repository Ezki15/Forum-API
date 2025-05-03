/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/** instanbul ignore file */
const Jwt = require('@hapi/jwt');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  // async addThread({
  //   id = 'thread-123',
  //   title = 'Thread title',
  //   body = 'Thread body',
  //   created_at = new Date().toISOString(),
  //   owner = 'user-123',
  // }) {
  //   const query = {
  //     text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
  //     values: [id, title, body, created_at, owner],
  //   };

  //     await pool.query(query);
  //   },

  async generateMockToken() {
    const payload = { id: 'user-123' };

    return Jwt.token.generate(payload, {
      key: process.env.ACCESS_TOKEN_KEY,
    });
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
