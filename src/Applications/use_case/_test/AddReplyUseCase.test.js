const NewReply = require('../../../Domains/replies/entities/NewReply');
const SavedReply = require('../../../Domains/replies/entities/SavedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should throw error when thread is not available', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Reply content',
    };

    const credential = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.reject(new Error('Thread tidak ditemukan')));
    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(new SavedReply({
      id: 'reply-123',
      content: 'Reply content',
      owner: 'user-123',
      commentId: 'comment-123',
    })));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload, credential, threadId, commentId))
      .rejects
      .toThrow('Thread tidak ditemukan');

    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledTimes(1);
    expect(mockReplyRepository.addReply).not.toHaveBeenCalled();
  });

  it('should throw error when comment is not available', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Reply content',
    };

    const credential = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateAvailableComment = jest.fn().mockImplementation(() => Promise.reject(new Error('Comment tidak ditemukan')));
    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(new SavedReply({
      id: 'reply-123',
      content: 'Reply content',
      owner: 'user-123',
      commentId: 'comment-123',
    })));
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload, credential, threadId, commentId))
      .rejects
      .toThrow('Comment tidak ditemukan');
    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.validateAvailableComment).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.validateAvailableComment).toHaveBeenCalledTimes(1);
    expect(mockReplyRepository.addReply).not.toHaveBeenCalled();
  });

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Reply content',
    };

    const credentialUser = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const savedReplyExpected = new SavedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: credentialUser,
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(new SavedReply({
      id: 'reply-123',
      content: 'Reply content',
      owner: 'user-123',
    })));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const savedReply = await addReplyUseCase.execute(useCasePayload, credentialUser, threadId, commentId);

    // Assert
    expect(savedReply).toStrictEqual(savedReplyExpected);
    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.validateAvailableComment).toHaveBeenCalledWith(commentId);
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(new NewReply({ content: useCasePayload.content }, credentialUser, commentId));
    expect(mockReplyRepository.addReply).toHaveBeenCalledTimes(1);
  });
});
