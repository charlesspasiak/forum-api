const AddLike = require('../../Domains/likes/entities/AddLike');

class LikeUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addLike = new AddLike(useCasePayload);
    const { threadId, commentId, userId } = addLike;
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    const id = await this._likeRepository.verifyAvailableLike(threadId, commentId, userId);
    if (id) await this._likeRepository.deleteLike(id);
    else await this._likeRepository.addLike(addLike);
  }
}

module.exports = LikeUseCase;
