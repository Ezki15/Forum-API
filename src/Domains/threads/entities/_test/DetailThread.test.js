const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when not thread contain needed property', () => {
    // Arrange
    const thread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-01T00:00:00.000Z',
      comments: [],
    };
    const threadComments = [{
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T00:00:00.000Z',
      content: 'Comment Content',
      is_delete: 'tidak',
    }];

    // Action and Assert
    expect(() => new DetailThread(thread, threadComments)).toThrow('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not threadComments contain needed property', () => {
    // Arrange
    const thread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-01T00:00:00.000Z',
      username: 'user-123',
      comments: [],
    };
    const threadComments = [{
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T00:00:00.000Z',
      is_delete: 'tidak',
    }];

    // Action and Assert
    expect(() => new DetailThread(thread, threadComments)).toThrow('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when threadComments not meet data type specification', () => {
    // Arrange
    const thread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-01T00:00:00.000Z',
      username: 'user-123',
      comments: [],
    };
    const threadComments = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T00:00:00.000Z',
      content: 'Comment Content',
      is_delete: 123,
    };

    // Action and Assert
    expect(() => new DetailThread(thread, threadComments)).toThrow('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly when is_delete = "tidak"', () => {
    // Arrange
    const thread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-01T00:00:00.000Z',
      username: 'user-123',
      comments: [],
    };
    const threadComments = [{
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T00:00:00.000Z',
      content: 'Comment Content',
      is_delete: 'tidak',
    }];

    // Action
    const detailThread = new DetailThread(thread, threadComments);
    const [{
      id, username, date, content,
    }] = detailThread.comments;

    // Assert
    expect(detailThread.id).toEqual(thread.id);
    expect(detailThread.title).toEqual(thread.title);
    expect(detailThread.body).toEqual(thread.body);
    expect(detailThread.date).toEqual(thread.date);
    expect(detailThread.username).toEqual(thread.username);
    expect(detailThread.comments).toHaveLength(1);
    expect(id).toEqual(threadComments[0].id);
    expect(username).toEqual(threadComments[0].username);
    expect(date).toEqual(threadComments[0].date);
    expect(content).toEqual(threadComments[0].content);
  });
  it('should create DetailThread object correctly when is_delete = "ya"', () => {
    // Arrange
    const thread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-01T00:00:00.000Z',
      username: 'user-123',
      comments: [],
    };
    const threadComments = [{
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T00:00:00.000Z',
      content: '**komentar telah dihapus**',
      is_delete: 'ya',
    }];

    // Action
    const detailThread = new DetailThread(thread, threadComments);
    const [{
      id, username, date, content,
    }] = detailThread.comments;

    // Assert
    expect(detailThread.id).toEqual(thread.id);
    expect(detailThread.title).toEqual(thread.title);
    expect(detailThread.body).toEqual(thread.body);
    expect(detailThread.date).toEqual(thread.date);
    expect(detailThread.username).toEqual(thread.username);
    expect(detailThread.comments).toHaveLength(1);
    expect(id).toEqual(threadComments[0].id);
    expect(username).toEqual(threadComments[0].username);
    expect(date).toEqual(threadComments[0].date);
    expect(content).toEqual(threadComments[0].content);
  });
});
