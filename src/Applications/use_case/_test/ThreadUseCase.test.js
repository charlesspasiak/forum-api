const ThreadUseCase = require('../ThreadUseCase');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('ThreadUseCase', () => {
  describe('addThread function', () => {
    it('should orchestrating the add thread action correctly', async () => {
      // Arrange
      const useCasePayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
        userId: 'user-123',
      };

      const mockAddedThread = new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        body: useCasePayload.body,
        userId: useCasePayload.userId,
      });

      const mockThreadRepository = new ThreadRepository();
      mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockAddedThread));

      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: {},
        replyRepository: {},
      });

      // Action
      const addedThread = await getThreadUseCase.addThread(useCasePayload);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: useCasePayload.title,
          body: useCasePayload.body,
          userId: useCasePayload.userId,
        })
      );
      expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
        new AddThread({
          title: useCasePayload.title,
          body: useCasePayload.body,
          userId: useCasePayload.userId,
        })
      );
    });
  });

  describe('getThread function', () => {
    it('should get return detail thread correctly', async () => {
      // Arrange
      const expectedThread = new GetThread({
        id: 'thread-123abc',
        title: 'coba judul',
        body: 'isi body thread',
        date: '2023-12-10',
        username: 'lestrapa',
      });
      const expectedComments = [
        {
          id: 'comment-123abc',
          content: 'isi comment',
          username: 'naruto',
          thread_id: 'thread-123abc',
          date: '2023-12-19',
          is_delete: false,
        },
        {
          id: 'comment-suke02',
          content: 'isi comment',
          username: 'sasuke',
          thread_id: 'thread-123abc',
          date: '2023-12-15',
          is_delete: false,
        },
      ];

      const expectedReplies = [
        {
          id: 'reply-123',
          content: 'balasan comment',
          date: '2023-12-16',
          username: 'sanji',
          thread_id: 'thread-123abc',
          comment_id: 'comment-suke02',
          is_delete: false,
        },
      ];

      const expectedLikes = [
        {
          id: 'reply-123',
          thread_id: 'thread-123abc',
          comment_id: 'comment-suke02',
        },
      ];

      // Test Double
      const threadId = 'thread-123abc';
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();
      const mockLikeRepository = new LikeRepository();

      mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
      mockThreadRepository.getThread = jest.fn(() => Promise.resolve(expectedThread));

      mockCommentRepository.getComments = jest.fn(() => Promise.resolve(expectedComments));

      mockReplyRepository.getReplies = jest.fn(() => Promise.resolve(expectedReplies));

      mockLikeRepository.getLikeByThreadId = jest.fn(() => Promise.resolve(expectedLikes));

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        likeRepository: mockLikeRepository,
      });

      // Action
      const detailThread = await threadUseCase.getThread(threadId);

      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(threadId);

      expect(mockThreadRepository.getThread).toHaveBeenCalledWith(threadId);
      expect(mockCommentRepository.getComments).toHaveBeenCalledWith(threadId);
      expect(mockReplyRepository.getReplies).toHaveBeenCalledWith(threadId);
      expect(mockLikeRepository.getLikeByThreadId).toHaveBeenCalledWith(threadId);

      expect(detailThread).toStrictEqual({
        thread: {
          id: 'thread-123abc',
          title: 'coba judul',
          body: 'isi body thread',
          date: '2023-12-10',
          username: 'lestrapa',
          comments: [
            {
              id: 'comment-123abc',
              username: 'naruto',
              date: new Date('2023-12-19').toISOString(),
              content: 'isi comment',
              replies: [],
              likeCount: 0,
            },
            {
              id: 'comment-suke02',
              username: 'sasuke',
              date: new Date('2023-12-15').toISOString(),
              content: 'isi comment',
              replies: [
                {
                  id: 'reply-123',
                  username: 'sanji',
                  date: new Date('2023-12-16').toISOString(),
                  content: 'balasan comment',
                },
              ],
              likeCount: 1,
            },
          ],
        },
      });
    });
  });
});
