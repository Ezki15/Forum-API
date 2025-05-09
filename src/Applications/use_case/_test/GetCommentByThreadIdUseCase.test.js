const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetCommentByThreadIdUseCase = require('../GetCommentByThreadIdUseCase');

describe('GetCommentByThreadIdUseCase', () => {
  it('should throw error if use case not contain needed argument value', async () => {
    // Arrange
    const threadId = '';
    const getCommentByThreadIdUseCase = new GetCommentByThreadIdUseCase({});

    // Action and assert
    await expect(getCommentByThreadIdUseCase.execute(threadId)).rejects.toThrow('GET_COMMENT_BY_THREAD_ID_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if property not meet data type specification', async () => {
    // Arrange
    const threadId = 123;
    const getCommentByThreadIdUseCase = new GetCommentByThreadIdUseCase({});

    // Action and assert
    await expect(getCommentByThreadIdUseCase.execute(threadId)).rejects.toThrow('GET_COMMENT_BY_THREAD_ID_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get comment by thread id action correctly when is_delete = "tidak"', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'user-123',
        date: expect.any(String),
        content: 'Comment Content',
      },
    ];
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve([{
      id: 'comment-123',
      username: 'user-123',
      date: expect.any(String),
      is_delete: 'tidak',
      content: expect.any(String),
    }]));
    const getCommentByThreadIdUseCase = new GetCommentByThreadIdUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const comments = await getCommentByThreadIdUseCase.execute(threadId);

    // Assert
    expect(comments).toEqual(expectedComments);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(threadId);
  });

  it('should orchestrating the get comment by thread id action correctly when is_delete = "ya"', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'user-123',
        date: expect.any(String),
        content: '**Komentar telah dihapus**',
      },
    ];
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve([{
      id: 'comment-123',
      username: 'user-123',
      date: expect.any(String),
      is_delete: 'ya',
      content: expect.any(String),
    }]));
    const getCommentByThreadIdUseCase = new GetCommentByThreadIdUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const comments = await getCommentByThreadIdUseCase.execute(threadId);

    // Assert
    expect(comments).toEqual(expectedComments);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(threadId);
  });
});
