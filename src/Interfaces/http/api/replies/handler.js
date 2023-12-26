const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const { content } = request.payload;

    const addedReply = await replyUseCase.addReply({ userId, threadId, commentId, content });

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
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId, id: replyId } = request.params;

    await replyUseCase.deleteReply({ userId, threadId, commentId, replyId });

    return h.response({
      status: 'success',
    });
  }
}

module.exports = ReplyHandler;
