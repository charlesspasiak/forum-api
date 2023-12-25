const AddComment = require('../../Domains/comments/entities/AddComment');

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addComment(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(threadId);
    const newComment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(newComment);
  }

  async deleteComment(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { threadId, commentId, userId } = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);
    await this._commentRepository.deleteComment(commentId);
  }

  _validatePayload(payload) {
    const { threadId, commentId, userId } = payload;

    if (!threadId || !commentId || !userId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const isValidString = (value) => typeof value === 'string';

    if (!isValidString(threadId) || !isValidString(commentId) || !isValidString(userId)) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentUseCase;
