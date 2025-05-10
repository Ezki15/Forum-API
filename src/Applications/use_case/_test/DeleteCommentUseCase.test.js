const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case not contain needed argument value', async () => {
    // Arrange
    const commentId = 'comment-123';
    const owner = 'user-123';
    const threadId = '';
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action and assert
    await expect(deleteCommentUseCase.execute(commentId, owner, threadId)).rejects.toThrow('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if property not meet data type specification', async () => {
    // Arrange
    const commentId = 'comment-123';
    const owner = 123;
    const threadId = 'thread-123';
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action and assert
    await expect(deleteCommentUseCase.execute(commentId, owner, threadId)).rejects.toThrow('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if thread not available', async () => {
    // Arrange
    const commentId = 'comment-123';
    const owner = 'user-123';
    const threadId = 'thread-123';
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.validateAvailableThread = jest.fn().mockImplementation(() => {
      throw new Error('Thread tidak ditemukan');
    });
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });
    // Action and assert
    await expect(deleteCommentUseCase.execute(commentId, owner, threadId)).rejects.toThrow('Thread tidak ditemukan');
  });

  it('should throw error when owner not match', async () => {
    // Arrange
    const commentId = 'comment-123';
    const owner = 'user-123';
    const threadId = 'thread-123';
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => {
      throw new Error('Tidak dapat mengakses sumber ini!');
    });
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });
    // Action and assert
    await expect(deleteCommentUseCase.execute(commentId, owner, threadId)).rejects.toThrow('Tidak dapat mengakses sumber ini!');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const commentId = 'comment-123';
    const owner = 'user-123';
    const threadId = 'thread-123';

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(commentId, owner, threadId);

    // Assert
    expect(mockCommentRepository.validateAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(commentId, owner);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(commentId, owner, threadId);
  });
});
