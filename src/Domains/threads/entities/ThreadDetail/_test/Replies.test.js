const Reply = require('../Replies');

describe('Reply Entity', () => {
  it('should keep content when not deleted', () => {
    const reply = new Reply({
      id: 'reply-123',
      content: 'reply content',
      date: '2021-01-01',
      username: 'user-123',
      is_deleted: 'tidak',
    });

    expect(reply.content).toBe('reply content');
  });

  it('should mask content when deleted', () => {
    const reply = new Reply({
      id: 'reply-2',
      content: 'should be hidden',
      date: '2021-01-01',
      username: 'user',
      is_delete: 'ya',
    });

    expect(reply.content).toBe('**balasan telah dihapus**');
  });
});
