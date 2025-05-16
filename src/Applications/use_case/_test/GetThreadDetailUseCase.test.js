const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should throw error if use case not contain needed argument value', async () => {
    // Arrange
    const threadId = '';
    const getThreadDetailUseCase = new GetThreadDetailUseCase({});

    // Action and assert
    await expect(getThreadDetailUseCase.execute(threadId)).rejects.toThrow('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if property not meet data type specification', async () => {
    // Arrange
    const threadId = 123;
    const getThreadDetailUseCase = new GetThreadDetailUseCase({});

    // Action and assert
    await expect(getThreadDetailUseCase.execute(threadId)).rejects.toThrow('GET_THREAD_DETAIL_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when thread not available', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => {
      throw new Error('Thread tidak ada');
    });
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and assert
    await expect(getThreadDetailUseCase.execute(threadId)).rejects.toThrow('Thread tidak ada');
  });

  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedThreadDetail = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: expect.any(String),
      username: 'user-123',
      comments: [
        {
          id: 'comment-123',
          content: 'Comment Content',
          date: expect.any(String),
          username: 'user-123',
        },
      ],
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetailById = jest.fn().mockImplementation(() => Promise.resolve({
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date: expect.any(String),
      username: 'user-123',
    }));
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve([{
      id: 'comment-123',
      username: 'user-123',
      date: expect.any(String),
      is_delete: 'tidak',
      content: expect.any(String),
    }]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,

    });
    // Action
    const threadDetail = await getThreadDetailUseCase.execute(threadId);
    // Assert
    expect(threadDetail).toEqual(expectedThreadDetail);
    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadDetailById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(threadId);
  });

  it('should orchestrating the get thread detail action correctly when is_delete = "ya"', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedThreadDetail = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: expect.any(String),
      username: 'user-123',
      comments: [
        {
          id: 'comment-123',
          content: '**komentar telah dihapus**',
          date: expect.any(String),
          username: 'user-123',
        },
      ],
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetailById = jest.fn().mockImplementation(() => Promise.resolve({
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date: expect.any(String),
      username: 'user-123',
    }));
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve([{
      id: 'comment-123',
      username: 'user-123',
      date: expect.any(String),
      is_delete: 'ya',
      content: expect.any(String),
    }]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,

    });
    // Action
    const threadDetail = await getThreadDetailUseCase.execute(threadId);
    // Assert
    expect(threadDetail).toEqual(expectedThreadDetail);
    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadDetailById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(threadId);
  });
});
