class DeleteReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(replyId, owner, commentId, threadId) {
    this._validate(replyId, owner, commentId, threadId);
    await this._threadRepository.validateAvailableThread(threadId);
    await this._commentRepository.validateAvailableComment(commentId);
    await this._replyRepository.validateAvailableReply(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.deleteReply(replyId, owner, commentId, threadId);
  }

  _validate(replyId, owner, commentId, threadId) {
    if (!replyId || !owner || !commentId || !threadId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof replyId !== 'string' || typeof owner !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
