class Reply {
  constructor(payload) {
    this.id = payload.id;
    this.content = payload.is_delete === 'ya' ? '**balasan telah dihapus**' : payload.content;
    this.date = payload.date;
    this.username = payload.username;
  }
}

module.exports = Reply;
