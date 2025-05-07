class GetCommentByThreadIdUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    this._validate(threadId);
    return this._commentRepository.getCommentsByThreadId(threadId);
  }

  _validate(threadId) {
    if (!threadId) {
      throw new Error('GET_COMMENT_BY_THREAD_ID_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_COMMENT_BY_THREAD_ID_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetCommentByThreadIdUseCase;
