const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const { id: user_id } = request.auth.credentials;
    const { threadId: thread_id } = request.params;
    const { content } = request.payload;

    const addedComment = await commentUseCase.addComment({ user_id, thread_id, content });

    return h
      .response({
        status: 'success',
        data: {
          addedComment,
        },
      })
      .code(201);
  }

  async deleteCommentHandler(request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const { id: user_id } = request.auth.credentials;
    const thread_id = request.params.threadId;
    const comment_id = request.params.id;

    await commentUseCase.deleteComment({ user_id, thread_id, comment_id });

    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentHandler;
