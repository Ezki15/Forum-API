class DeleteCommentUseCase {
  constructor({
    commentRepository, threadRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(commentId, owner, threadId) {
    this._validate(commentId, owner, threadId);
    await this._threadRepository.validateAvailableThread(threadId);
    await this._commentRepository.validateAvailableComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._commentRepository.deleteComment(commentId, owner, threadId);
  }

  _validate(commentId, owner, threadId) {
    if (!commentId || !owner || !threadId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
