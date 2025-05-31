const NewComment = require('../../../Domains/comments/entities/NewComment');
const SavedComment = require('../../../Domains/comments/entities/SavedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error when thread is not available', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Comment content',
    };

    const credential = 'user-123';
    const threadId = 'thread-123';
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.reject(new Error('Thread tidak ditemukan')));
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(new SavedComment({
      id: 'comment-123',
      content: 'Comment content',
      owner: 'user-123',
    })));
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload, credential, threadId))
      .rejects
      .toThrow('Thread tidak ditemukan');
    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.addComment).not.toHaveBeenCalled();
    expect(mockCommentRepository.addComment).toHaveBeenCalledTimes(0);
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Comment content',
    };

    const credentialUser = 'user-123';
    const threadId = 'thread-123';

    const savedCommentExpected = new SavedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: credentialUser,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(new SavedComment({
      id: 'comment-123',
      content: 'Comment content',
      owner: 'user-123',
    })));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const savedComment = await addCommentUseCase.execute(useCasePayload, credentialUser, threadId);

    // Assert
    expect(savedComment).toStrictEqual(savedCommentExpected);
    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(new NewComment({ content: useCasePayload.content }, credentialUser, threadId));
    expect(mockCommentRepository.addComment).toHaveBeenCalledTimes(1);
  });
});
