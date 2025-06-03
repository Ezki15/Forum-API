const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
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

  async deleteReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(replyId, owner, commentId, threadId);

    return h.response({
      status: 'success',
      message: 'Reply deleted successfully',
    }).code(200);
  }
}

module.exports = RepliesHandler;
