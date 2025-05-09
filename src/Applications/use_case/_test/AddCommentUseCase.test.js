const NewComment = require('../../../Domains/comments/entities/NewComment');
const SavedComment = require('../../../Domains/comments/entities/SavedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
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

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'comment-123',
      content: 'Comment content',
      owner: 'user-123',
    }));
    mockCommentRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const savedComment = await addCommentUseCase.execute(useCasePayload, credentialUser, threadId);

    // Assert
    expect(savedComment).toStrictEqual({ ...savedCommentExpected });
    expect(mockCommentRepository.validateAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(new NewComment({ content: useCasePayload.content }, credentialUser, threadId));
    expect(mockCommentRepository.addComment).toHaveBeenCalledTimes(1);
  });
});
