const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');
const GetCommentByThreadIdUseCase = require('../../../../Applications/use_case/GetCommentByThreadIdUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailByIdHandler = this.getThreadDetailByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const auth = request.auth.credentials;
    const { id: owner } = auth;
    const threadPayload = {
      title: request.payload.title,
      body: request.payload.body,
    };
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(threadPayload, owner);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailByIdHandler(request, h) {
    const { threadId } = request.params;

    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
    const getCommentByThreadIdUseCase = this._container.getInstance(GetCommentByThreadIdUseCase.name);

    const thread = await getThreadDetailUseCase.execute(threadId);

    const threadComments = await getCommentByThreadIdUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread: {
          ...thread,
          comments: threadComments,
        },
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
