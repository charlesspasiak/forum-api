const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    // Bind methods in the constructor
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);

    const { id } = request.auth.credentials;
    const { title, body } = request.payload;

    const useCasePayload = {
      title,
      body,
      user_id: id,
    };

    const result = await threadUseCase.addThread(useCasePayload);
    const addedThread = {
      id: result.id,
      title: result.title,
      owner: result.user_id,
    };

    return h
      .response({
        status: 'success',
        data: { addedThread },
      })
      .code(201);
  }

  async getThreadHandler(request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const useCasePayload = request.params.id;

    const { thread } = await threadUseCase.getThread(useCasePayload);

    return h.response({
      status: 'success',
      data: { thread },
    });
  }
}

module.exports = ThreadHandler;
