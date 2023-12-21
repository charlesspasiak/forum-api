const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  let commentRepositoryPostgres;

  beforeAll(() => {
    commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const addUserPayload = {
    id: 'user-123',
    username: 'lestrapa',
  };

  const addThreadPayload = {
    id: 'thread-123',
    body: 'isi body thread',
    user_id: 'user-123',
  };

  const addCommentPayload = {
    content: 'isi comment',
    thread_id: 'thread-123',
    user_id: 'user-123',
  };

  describe('CommentRepositoryPostgres instance', () => {
    it('should be defined and an instance of CommentRepository domain', () => {
      expect(commentRepositoryPostgres).toBeDefined();
      expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
    });
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      await UsersTableTestHelper.addUser(addUserPayload);
      await ThreadsTableTestHelper.addThread(addThreadPayload);

      const newComment = new AddComment(addCommentPayload);
      const fakeIdGenerator = () => 'xx123';
      commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-xx123',
          content: 'isi comment',
          user_id: 'user-123',
        })
      );

      const comment = await CommentsTableTestHelper.findCommentsById('comment-xx123');
      expect(comment).toHaveLength(1);
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw NotFoundError if comment not available', async () => {
      const commentId = 'xx123';
      await expect(commentRepositoryPostgres.checkAvailabilityComment(commentId)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should not throw NotFoundError if comment available', async () => {
      await UsersTableTestHelper.addUser(addUserPayload);
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);

      await expect(commentRepositoryPostgres.checkAvailabilityComment('comment-xx123')).resolves.not.toThrow(
        NotFoundError
      );
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError if comment does not belong to owner', async () => {
      await UsersTableTestHelper.addUser(addUserPayload);
      await UsersTableTestHelper.addUser({
        id: 'user-xx123',
        username: 'naruto',
      });
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);
      const userId = 'user-xx123';

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-xx123', userId)).rejects.toThrow(
        AuthorizationError
      );
    });

    it('should not throw AuthorizationError if comment belongs to owner', async () => {
      await UsersTableTestHelper.addUser(addUserPayload);
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);

      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-xx123', 'user-123')
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment from the database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser(addUserPayload);
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);
      const commentId = 'comment-xx123';

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toBeTruthy();
      expect(comments[0].deleted_at).toBeDefined();
      
    });
  });

  describe('getComments function', () => {
    it('should get comments of thread', async () => {
      await UsersTableTestHelper.addUser(addUserPayload);
      await ThreadsTableTestHelper.addThread(addThreadPayload);
      await CommentsTableTestHelper.addComment(addCommentPayload);

      const comments = await commentRepositoryPostgres.getComments(addThreadPayload.id);

      expect(Array.isArray(comments)).toBe(true);
      expect(comments[0].id).toEqual('comment-xx123');
      expect(comments[0].thread_id).toEqual('thread-123');
      expect(comments[0].username).toEqual('lestrapa');
      expect(comments[0].content).toEqual('isi comment');
      expect(comments[0].is_delete).toBeFalsy();
      expect(comments[0].date).toBeDefined();
    });
  });
});
