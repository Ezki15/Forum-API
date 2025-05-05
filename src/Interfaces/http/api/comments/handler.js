const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const auth = request.auth.credentials;
    const { id: owner } = auth;
    const { threadId } = request.params;
    const commentPayload = {
      content: request.payload.content,
    };
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(commentPayload, owner, threadId);
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    console.log('owner', owner);
    console.log('request', request.params);
    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    console.log('deleteCommentUseCase', deleteCommentUseCase);

    const result = await deleteCommentUseCase.execute(commentId, owner, threadId);
    console.log(result);

    return h.response({
      status: 'success',
      message: 'Comment deleted successfully',
    }).code(200);
  }
}

module.exports = CommentsHandler;
