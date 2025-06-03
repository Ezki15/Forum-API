const Reply = require('./Replies');

class Comment {
  constructor(payload, replies) {
    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.is_delete === 'ya' ? '**komentar telah dihapus**' : payload.content;
    this.replies = replies.map((reply) => new Reply(reply));
  }
}

module.exports = Comment;
