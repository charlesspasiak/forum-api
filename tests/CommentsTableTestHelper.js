/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-xx123',
    threadId = 'thread-123',
    content = 'isi comment',
    userId = 'user-123',
  }) {
    const isDelete = false;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, userId, threadId, isDelete],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async deleteCommentsById(id) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE comments SET is_delete = $2, deleted_at = $3 WHERE id = $1',
      values: [id, true, deletedAt],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },
};

module.exports = CommentsTableTestHelper;
