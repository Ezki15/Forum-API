const Comment = require('./Comments');

class ThreadDetail {
  constructor(thread, comments, replies) {
    this.id = thread.id;
    this.title = thread.title;
    this.body = thread.body;
    this.date = thread.date;
    this.username = thread.username;

    this.comments = comments.map((comment) => {
      const commentReplies = replies.filter((reply) => reply.comment_id === comment.id);
      return new Comment(comment, commentReplies);
    });
  }
}

module.exports = ThreadDetail;
