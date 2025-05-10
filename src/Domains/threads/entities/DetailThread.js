class DetailThread {
  constructor(thread, threadComments) {
    this._verifyThread(thread);
    this._verifyThreadComments(threadComments);

    this.id = thread.id;
    this.title = thread.title;
    this.body = thread.body;
    this.date = thread.date;
    this.username = thread.username;
    this.comments = threadComments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete === 'ya' ? '**komentar telah dihapus**' : comment.content,
    }));
  }

  _verifyThread(thread) {
    if (!thread || !thread.id || !thread.title || !thread.body || !thread.date || !thread.username) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }

  _verifyThreadComments(threadComments) {
    if (!Array.isArray(threadComments)) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    threadComments.forEach((comment) => {
      if (!comment.id || !comment.username || !comment.date || !comment.content || !comment.is_delete) {
        throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    });
  }
}

module.exports = DetailThread;
