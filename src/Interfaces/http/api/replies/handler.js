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
    const { threadId: thread_id, commentId: comment_id } = request.params;
    const { content } = request.payload;

    const addedReply = await replyUseCase.addReply({ user_id, thread_id, comment_id, content });

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
    const { threadId: thread_id, commentId: comment_id, id: reply_id } = request.params;

    await replyUseCase.deleteReply({ user_id, thread_id, comment_id, reply_id });

    return h.response({
      status: 'success',
    });
  }
}

module.exports = ReplyHandler;
