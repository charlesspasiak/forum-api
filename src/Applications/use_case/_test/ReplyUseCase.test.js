const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyUseCase = require('../ReplyUseCase');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('ReplyUseCase class', () => {
  it('should be defined', async () => {
    const replyUseCase = new ReplyUseCase({});
    expect(replyUseCase).toBeDefined();
  });

  describe('addReply function', () => {
    it('should be defined', () => {
      const replyUseCase = new ReplyUseCase({});
      expect(replyUseCase.addReply).toBeDefined();
    });

    it('should orchestrating the add reply action correctly', async () => {
      const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-xx123',
        content: 'isi komentar',
        userId: 'user-123',
      };

      const mockAddedReply = new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        userId: useCasePayload.userId,
      });

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = {
        checkAvailabilityComment() {},
      };
      const mockReplyRepository = new ReplyRepository();

      mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
      mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
      mockReplyRepository.addReply = jest.fn(() => Promise.resolve(mockAddedReply));

      const replyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });
      const addedReply = await replyUseCase.addReply(useCasePayload);

      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
        useCasePayload.commentId
      );
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: useCasePayload.content,
          userId: useCasePayload.userId,
        })
      );
      expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
        new AddReply({
          threadId: useCasePayload.threadId,
          commentId: useCasePayload.commentId,
          content: useCasePayload.content,
          userId: useCasePayload.userId,
        })
      );
    });
  });

  describe('deleteReply function', () => {
    it('should be defined', () => {
      const replyUseCase = new ReplyUseCase({}, {}, {});
      expect(replyUseCase.deleteReply).toBeDefined();
    });

    it('should throw error if use case payload not contain threadId and commentId', async () => {
      const useCasePayload = {};
      const replyUseCase = new ReplyUseCase({});

      await expect(replyUseCase.deleteReply(useCasePayload)).rejects.toThrow(
        'DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD'
      );
    });

    it('should throw error if payload not string', async () => {
      const useCasePayload = {
        threadId: true,
        commentId: 123,
        replyId: [],
        userId: {},
      };
      const replyUseCase = new ReplyUseCase({});
      await expect(replyUseCase.deleteReply(useCasePayload)).rejects.toThrow(
        'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    });

    it('should orchestrating the delete reply action correctly', async () => {
      const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-xx123',
        replyId: 'reply-123',
        userId: 'user-123',
      };

      const mockReplyRepository = new ReplyRepository();
      const mockCommentRepository = {
        checkAvailabilityComment() {},
      };
      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
      mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
      mockReplyRepository.checkAvailabilityReply = jest.fn(() => Promise.resolve());
      mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
      mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

      const replyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      await replyUseCase.deleteReply(useCasePayload);

      expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
        useCasePayload.commentId
      );
      expect(mockReplyRepository.checkAvailabilityReply).toHaveBeenCalledWith(
        useCasePayload.replyId
      );
      expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
        useCasePayload.replyId,
        useCasePayload.userId
      );
      expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(useCasePayload.replyId);
    });
  });
});
