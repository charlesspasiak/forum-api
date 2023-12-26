const AddLike = require('../../../Domains/likes/entities/AddLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeUseCase = require('../LikeUseCase');

describe('LikeUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-xx123',
      userId: 'user-123',
    };
    const expectedRegisteredLike = new AddLike({
      threadId: 'thread-123',
      commentId: 'comment-xx123',
      userId: 'user-123',
    });
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockLikeRepository.verifyAvailableLike = jest.fn(() => Promise.resolve(null));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());

    const getLikeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    await getLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.verifyAvailableLike).toHaveBeenCalledWith(
      'thread-123',
      'comment-xx123',
      'user-123'
    );
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(expectedRegisteredLike);
  });

  it('should orchestrating the delete like action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-xx123',
      userId: 'user-123',
    };
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockLikeRepository.verifyAvailableLike = jest.fn(() => Promise.resolve('like-123'));
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());

    const getLikeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    await getLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.verifyAvailableLike).toHaveBeenCalledWith(
      'thread-123',
      'comment-xx123',
      'user-123'
    );
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith('like-123');
  });
});
