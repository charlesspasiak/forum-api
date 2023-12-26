const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const addThreadPayload = {
    id: 'thread-123',
    userId: 'user-123',
  };

  const addCommentPayload = {
    id: 'comment-xx123',
    threadId: 'thread-123',
    userId: 'user-123',
  };

  const addLikePayload = {
    id: 'like-123',
    threadId: 'thread-123',
    commentId: 'comment-xx123',
    userId: 'user-123',
  };

  describe('addLike function', () => {
    it('should persist register like and return registered like correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);
      const addLike = new AddLike({
        threadId: 'thread-123',
        commentId: 'comment-xx123',
        userId: 'user-123',
      });
      const fakeIdGenerator = () => 'xx123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const addedLike = await likeRepositoryPostgres.addLike(addLike);
      expect(addedLike).toStrictEqual('like-xx123');
      const likes = await LikesTableTestHelper.findLikeById('like-xx123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('verifyAvailableLike function', () => {
    it('should throw null when thread, comment, and user not available', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(
        likeRepositoryPostgres.verifyAvailableLike('thread-123', 'comment-xx123', 'user-123')
      ).resolves.toStrictEqual(null);
    });

    it('should throw id when thread, comment, and user available', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);
      await LikesTableTestHelper.addLike(addLikePayload);
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(
        likeRepositoryPostgres.verifyAvailableLike('thread-123', 'comment-xx123', 'user-123')
      ).resolves.toStrictEqual('like-123');
    });
  });

  describe('deleteLike function', () => {
    it('should throw Error when something wrong', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(likeRepositoryPostgres.deleteLike('like-123')).rejects.toThrow(
        InvariantError
      );
    });

    it('should not throw Error when query run correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);
      await LikesTableTestHelper.addLike(addLikePayload);
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(likeRepositoryPostgres.deleteLike('like-123')).resolves.not.toThrow(
        InvariantError
      );
    });
  });

  describe('getLikeByThreadId function', () => {
    it('should throw 0 when like in comment not available', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const likes = await likeRepositoryPostgres.getLikeByThreadId('thread-123');

      expect(likes).toHaveLength(0);
    });

    it('should return like count when like in comment available', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);
      await LikesTableTestHelper.addLike(addLikePayload);
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const likes = await likeRepositoryPostgres.getLikeByThreadId('thread-123');

      expect(Array.isArray(likes)).toBe(true);
      expect(likes[0].id).toEqual('like-123');
      expect(likes[0].thread_id).toEqual('thread-123');
      expect(likes[0].comment_id).toEqual('comment-xx123');
    });
  });
});
