const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail Entity', () => {
  const thread = {
    id: 'thread-123',
    title: 'judul',
    body: 'isi',
    date: '2021-01-01',
    username: 'user-123',
  };

  const comments = [
    {
      id: 'comment-123',
      content: 'komentar 1',
      date: '2021-01-02',
      username: 'user-123',
      is_delete: 'tidak',
    },
    {
      id: 'comment-234',
      content: 'komentar yang dihapus',
      date: '2021-01-03',
      username: 'user-234',
      is_delete: 'ya',
    },
  ];

  const replies = [
    {
      id: 'reply-123',
      comment_id: 'comment-123',
      content: 'reply aktif',
      date: '2021-01-04',
      username: 'user-123',
      is_delete: 'tidak',
    },
    {
      id: 'reply-234',
      comment_id: 'comment-123',
      content: 'reply terhapus',
      date: '2021-01-05',
      username: 'user345',
      is_delete: 'ya',
    },
  ];

  it('should structure thread with comments and replies correctly', () => {
    const result = new ThreadDetail(thread, comments, replies);

    expect(result.id).toBe(thread.id);
    expect(result.comments).toHaveLength(2);

    const [comment1, comment2] = result.comments;
    expect(comment1.replies).toHaveLength(2);
    expect(comment1.replies[0].content).toBe('reply aktif');
    expect(comment1.replies[1].content).toBe('**balasan telah dihapus**');
    expect(comment2.content).toBe('**komentar telah dihapus**');
  });
});
