/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    threadId = 'thread-123',
    commentId = 'comment-xx123',
    content = 'balasan sebuah komentar',
    userId = 'user-123',
  }) {
    const isDeleted = false;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, threadId, commentId, userId, isDeleted],
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
