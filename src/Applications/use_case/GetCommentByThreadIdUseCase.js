/* eslint-disable prefer-const */
class GetCommentByThreadIdUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    this._validate(threadId);
    const threadComments = await this._commentRepository.getCommentByThreadId(threadId);

    const comments = threadComments.map((row) => {
      if (row.is_delete === 'ya') {
        return {
          id: row.id,
          username: row.username,
          date: row.date,
          content: '**Komentar telah dihapus**',
        };
      }
      return {
        id: row.id,
        username: row.username,
        date: row.date,
        content: row.content,
      };
    });
    return comments;
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
