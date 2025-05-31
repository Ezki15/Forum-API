const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, credentialUser, threadId, commentId) {
    const newReply = new NewReply({ ...useCasePayload }, credentialUser, threadId, commentId);
    await this._threadRepository.validateAvailableThread(threadId);
    await this._commentRepository.validateAvailableComment(commentId);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
