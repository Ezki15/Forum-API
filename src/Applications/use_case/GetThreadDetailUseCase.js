class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    this._validate(threadId);
    const threadComments = await this._commentRepository.getCommentByThreadId(threadId);
    const threadDetail = await this._threadRepository.getThreadDetailById(threadId);

    const comments = threadComments.map((row) => {
      if (row.is_delete === 'ya') {
        return {
          id: row.id,
          username: row.username,
          date: row.date,
          content: '**komentar telah dihapus**',
        };
      }
      return {
        id: row.id,
        username: row.username,
        date: row.date,
        content: row.content,
      };
    });

    return {
      ...threadDetail,
      comments,
    };
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
