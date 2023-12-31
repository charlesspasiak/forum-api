const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, userId } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4) RETURNING id, title, user_id',
      values: [id, title, body, userId],
    };

    const result = await this._pool.query(query);

    const mappedResult = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      userId: result.rows[0].user_id,
    };

    return new AddedThread(mappedResult);
  }

  async checkAvailabilityThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan!');
    }
  }

  async getThread(id) {
    const query = {
      text: `
              SELECT threads.id, title, body, created_at AS date, username 
              FROM threads
              JOIN users ON users.id = threads.user_id 
              WHERE threads.id = $1
            `,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
