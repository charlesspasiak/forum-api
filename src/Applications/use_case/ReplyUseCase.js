const AddReply = require('../../Domains/replies/entities/AddReply');

class ReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addReply(useCasePayload) {
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    const newReply = new AddReply(useCasePayload);
    return this._replyRepository.addReply(newReply);
  }

  async deleteReply(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { threadId, commentId, replyId, userId } = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    await this._replyRepository.checkAvailabilityReply(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, userId);
    await this._replyRepository.deleteReply(replyId);
  }

  _validatePayload(payload) {
    const { threadId, commentId, replyId, userId } = payload;

    if (!threadId || !commentId || !replyId || !userId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    }

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof replyId !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyUseCase;
