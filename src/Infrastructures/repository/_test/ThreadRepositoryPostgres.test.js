const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-bocil01',
        username: 'mugiwara',
      });

      const newThread = new AddThread({
        title: 'sebuah thread',
        body: 'isi body thread',
        userId: 'user-bocil01',
      });

      const fakeIdGenerator = () => 'xx345';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-xx345',
          title: 'sebuah thread',
          userId: 'user-bocil01',
        })
      );

      const thread = await ThreadsTableTestHelper.findThreadsById('thread-xx345');
      expect(thread).toHaveLength(1);
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw NotFoundError if thread not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const threadId = 'thread-aspal00';

      await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId)).rejects.toThrow(
        NotFoundError
      );
      await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId)).rejects.toThrow(
        'thread tidak ditemukan!'
      );
    });

    it('should not throw NotFoundError if thread available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({
        id: 'user-bocil02',
        username: 'sanji',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-xx211',
        body: 'isi body thread',
        userId: 'user-bocil02',
      });

      await expect(
        threadRepositoryPostgres.checkAvailabilityThread('thread-xx211')
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getDetailThread function', () => {
    it('should get detail thread', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const userPayload = {
        id: 'user-123',
        username: 'lestrapa',
      };

      await UsersTableTestHelper.addUser(userPayload);

      const threadPayload = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        userId: userPayload.id,
      };

      await ThreadsTableTestHelper.addThread(threadPayload);

      const { id, title, body } = threadPayload;
      const detailThread = await threadRepositoryPostgres.getThread(id);

      const { date, ...expectedThreadWithoutDate } = detailThread;

      expect(expectedThreadWithoutDate).toEqual({
        id,
        title,
        body,
        username: userPayload.username,
      });
    });
  });
});
