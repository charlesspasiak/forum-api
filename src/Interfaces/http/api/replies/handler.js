const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const { id: user_id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const { content } = request.payload;

    const useCasePayload = {
      content,
      thread_id: threadId,
      comment_id: commentId,
      user_id,
    };

    const result = await replyUseCase.addReply(useCasePayload);

    const addedReply = {
      id: result.id,
      content: result.content,
      owner: result.user_id,
    };

    return h
      .response({
        status: 'success',
        data: {
          addedReply,
        },
      })
      .code(201);
  }

  async deleteReplyHandler(request, h) {
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const { id: user_id } = request.auth.credentials;
    const { threadId, commentId, id: reply_id } = request.params;

    const useCasePayload = {
      thread_id: threadId,
      comment_id: commentId,
      reply_id,
      user_id,
    };

    await replyUseCase.deleteReply(useCasePayload);

    return h.response({
      status: 'success',
    });
  }
}

module.exports = ReplyHandler;
