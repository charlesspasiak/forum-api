const CommentUseCase = require('../CommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('CommentUseCase class', () => {
  let commentUseCase;
  let mockThreadRepository;
  let mockCommentRepository;

  beforeEach(() => {
    commentUseCase = new CommentUseCase({});
    mockThreadRepository = new ThreadRepository();
    mockCommentRepository = new CommentRepository();
  });

  it('should be defined', async () => {
    expect(commentUseCase).toBeDefined();
  });

  describe('addComment function', () => {
    it('should be defined', () => {
      expect(commentUseCase.addComment).toBeDefined();
    });

    it('should orchestrate the add comment action correctly', async () => {
      const useCasePayload = {
        thread_id: 'thread-123',
        content: 'sebuah commment',
        user_id: 'user-123',
      };

      const mockAddedComment = new AddedComment({
        id: 'comment-xx123',
        content: useCasePayload.content,
        user_id: useCasePayload.user_id,
      });

      mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
      mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockAddedComment));

      commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      const addedComment = await commentUseCase.addComment(useCasePayload);

      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(useCasePayload.thread_id);
      expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
        new AddComment({
          thread_id: useCasePayload.thread_id,
          content: useCasePayload.content,
          user_id: useCasePayload.user_id,
        })
      );
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-xx123',
          content: useCasePayload.content,
          user_id: useCasePayload.user_id,
        })
      );
    });
  });

  describe('deleteComment function', () => {
    it('should be defined', () => {
      expect(commentUseCase.deleteComment).toBeDefined();
    });

    it('should throw an error if use case payload does not contain thread_id and comment_id', async () => {
      const useCasePayload = {};
      await expect(commentUseCase.deleteComment(useCasePayload)).rejects.toThrow(
        'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
      );
    });

    it('should throw an error if payload is not a string', async () => {
      const useCasePayload = {
        thread_id: true,
        comment_id: {},
        user_id: 1100,
      };
      await expect(commentUseCase.deleteComment(useCasePayload)).rejects.toThrow(
        'DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    });

    it('should orchestrate the delete comment action correctly', async () => {
      const useCasePayload = {
        thread_id: 'thread-123',
        comment_id: 'comment-xx123',
        user_id: 'user-123',
      };

      mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
      mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
      mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

      commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      await commentUseCase.deleteComment(useCasePayload);

      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(useCasePayload.thread_id);
      expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(useCasePayload.comment_id);
      expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
        useCasePayload.comment_id,
        useCasePayload.user_id
      );
      expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.comment_id);
    });
  });
});
