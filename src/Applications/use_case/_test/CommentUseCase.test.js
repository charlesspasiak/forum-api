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
        threadId: 'thread-123',
        content: 'sebuah commment',
        userId: 'user-123',
      };

      const mockAddedComment = new AddedComment({
        id: 'comment-xx123',
        content: useCasePayload.content,
        userId: useCasePayload.userId,
      });

      mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
      mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockAddedComment));

      commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      const addedComment = await commentUseCase.addComment(useCasePayload);

      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
        new AddComment({
          threadId: useCasePayload.threadId,
          content: useCasePayload.content,
          userId: useCasePayload.userId,
        })
      );
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-xx123',
          content: useCasePayload.content,
          userId: useCasePayload.userId,
        })
      );
    });
  });

  describe('deleteComment function', () => {
    it('should be defined', () => {
      expect(commentUseCase.deleteComment).toBeDefined();
    });

    it('should throw an error if use case payload does not contain threadId and commentId', async () => {
      const useCasePayload = {};
      await expect(commentUseCase.deleteComment(useCasePayload)).rejects.toThrow(
        'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
      );
    });

    it('should throw an error if payload is not a string', async () => {
      const useCasePayload = {
        threadId: true,
        commentId: {},
        userId: 1100,
      };
      await expect(commentUseCase.deleteComment(useCasePayload)).rejects.toThrow(
        'DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    });

    it('should orchestrate the delete comment action correctly', async () => {
      const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-xx123',
        userId: 'user-123',
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

      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
        useCasePayload.commentId
      );
      expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
        useCasePayload.commentId,
        useCasePayload.userId
      );
      expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.commentId);
    });
  });
});
