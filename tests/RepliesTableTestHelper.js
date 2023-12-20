/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    thread_id = 'thread-123',
    comment_id = 'comment-xx123',
    content = 'balasan sebuah komentar',
    user_id = 'user-123',
  }) {
    const isDeleted = false;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, thread_id, comment_id, user_id, isDeleted],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async checkDeletedAtRepliesById(id) {
    const query = {
      text: 'SELECT is_delete FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    const is_delete = result.rows[0].is_delete;
    return is_delete;
  },

  async deleteRepliesById(id) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE replies SET is_delete = $2, deleted_at = $3 WHERE id = $1',
      values: [id, true, deletedAt],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies');
  },
};

module.exports = RepliesTableTestHelper;
