const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    this._validate(threadId);
    await this._threadRepository.validateAvailableThread(threadId);
    const threadComments = await this._commentRepository.getCommentByThreadId(threadId);
    const threadDetail = await this._threadRepository.getThreadDetailById(threadId);

    const detailThread = new DetailThread(threadDetail, threadComments);
    return { ...detailThread };
  }

  _validate(threadId) {
    if (!threadId) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadDetailUseCase;
