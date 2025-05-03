const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const auth = request.auth.credentials;
    const { id: owner } = auth;
    const threadPayload = {
      title: request.payload.title,
      body: request.payload.body,
    };
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    try {
      const addedThread = await addThreadUseCase.execute(threadPayload, owner);
      const response = h.response({
        status: 'success',
        data: {
          addedThread,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ThreadsHandler;
