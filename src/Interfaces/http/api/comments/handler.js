const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload;

    const addedComment = await commentUseCase.addComment({ userId, threadId, content });

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
    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const commentId = request.params.id;

    await commentUseCase.deleteComment({ userId, threadId, commentId });

    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentHandler;
