const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const auth = request.auth.credentials;
    const { id: owner } = auth;
    const { threadId, commentId } = request.params;
    const replyPayload = {
      content: request.payload.content,
    };
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(replyPayload, owner, threadId, commentId);
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = RepliesHandler;
