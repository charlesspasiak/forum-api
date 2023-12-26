const LikeUseCase = require('../../../../Applications/use_case/LikeUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const likeUseCase = this._container.getInstance(LikeUseCase.name);
    await likeUseCase.execute({ threadId, commentId, userId });

    return h.response({
      status: 'success',
    });
  }
}

module.exports = RepliesHandler;
