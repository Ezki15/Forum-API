const NewThread = require('../../../Domains/threads/entities/NewThread');
const SavedThread = require('../../../Domains/threads/entities/SavedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread title',
      body: 'Thread body',
    };

    const mockSavedThread = new SavedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    const credentialUser = 'user-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockSavedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const savedThread = await getThreadUseCase.execute(useCasePayload, credentialUser);

    // Assert
    expect(savedThread).toStrictEqual(new SavedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    }));

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
