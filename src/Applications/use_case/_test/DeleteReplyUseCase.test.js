const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case not contain needed argument value', async () => {
    // Arrange
    const replyId = 'reply-123';
    const owner = 'user-123';
    const threadId = '';
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action and assert
    await expect(deleteReplyUseCase.execute(replyId, owner, threadId)).rejects.toThrow('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if property not meet data type specification', async () => {
    // Arrange
    const replyId = 'reply-123';
    const owner = 123;
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action and assert
    await expect(deleteReplyUseCase.execute(replyId, owner, commentId, threadId)).rejects.toThrow('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if thread not available', async () => {
    // Arrange
    const replyId = 'reply-123';
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => {
      throw new Error('Thread tidak ditemukan');
    });
    mockCommentRepository.validateAvailableComment = jest.fn().mockImplementation(() => {});

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and assert
    await expect(deleteReplyUseCase.execute(replyId, owner, commentId, threadId)).rejects.toThrow('Thread tidak ditemukan');
  });

  it('should throw error when comment not available', async () => {
    // Arrange
    const replyId = 'reply-123';
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateAvailableComment = jest.fn().mockImplementation(() => {
      throw new Error('Comment tidak ditemukan');
    });
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action and assert
    await expect(deleteReplyUseCase.execute(replyId, owner, commentId, threadId)).rejects.toThrow('Comment tidak ditemukan');
  });

  it('should throw error when reply not available', async () => {
    // Arrange
    const replyId = 'reply-123';
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.validateAvailableReply = jest.fn().mockImplementation(() => {
      throw new Error('Reply tidak ditemukan');
    });
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action and assert
    await expect(deleteReplyUseCase.execute(replyId, owner, commentId, threadId)).rejects.toThrow('Reply tidak ditemukan');
  });

  it('should throw error when owner not match', async () => {
    // Arrange
    const replyId = 'reply-123';
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.validateAvailableReply = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => {
      throw new Error('Tidak dapat mengakses sumber ini!');
    });
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action and assert
    await expect(deleteReplyUseCase.execute(replyId, owner, commentId, threadId)).rejects.toThrow('Tidak dapat mengakses sumber ini!');
  });
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const replyId = 'reply-123';
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.validateAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.validateAvailableReply = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action
    await deleteReplyUseCase.execute(replyId, owner, commentId, threadId);
    // Assert
    expect(mockThreadRepository.validateAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.validateAvailableComment).toHaveBeenCalledWith(commentId);
    expect(mockReplyRepository.validateAvailableReply).toHaveBeenCalledWith(replyId);
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(replyId, owner);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(replyId, owner, commentId);
  });
});
