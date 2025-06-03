const Comment = require('../Comments');

describe('Comment Entity', () => {
  const replyData = [
    {
      id: 'reply-123',
      content: 'reply content',
      date: '2021-01-01',
      username: 'user-123',
      is_delete: 'tidak',
    },
    {
      id: 'reply-234',
      content: 'komentar harus dihapus',
      date: '2021-01-02',
      username: 'user-234',
      is_delete: 'ya',
    },
  ];

  it('should handle comment and replies', () => {
    const comment = new Comment({
      id: 'comment-123',
      content: 'comment content',
      date: '2021-01-01',
      username: 'user-123',
      is_delete: 'tidak',
    }, replyData);

    expect(comment.content).toBe('comment content');
    expect(comment.replies[0].content).toBe('reply content');
    expect(comment.replies[1].content).toBe('**balasan telah dihapus**');
  });

  it('should mask deleted comment content', () => {
    const comment = new Comment({
      id: 'comment-234',
      content: 'komentar yang harus dihapus',
      date: '2021-01-01',
      username: 'user-123',
      is_delete: 'ya',
    }, []);

    expect(comment.content).toBe('**komentar telah dihapus**');
  });
});
