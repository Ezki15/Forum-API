const NewThread = require('../NewThread');

describe('a new thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'dicoding',
    };
    const credentialUser = 'user-123';

    // Action and Assert
    expect(() => new NewThread(payload, credentialUser)).toThrow('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };
    const credentialUser = 'user-123';

    // Action and Assert
    expect(() => new NewThread(payload, credentialUser)).toThrow('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'How to play a jiksaw puzzle',
      body: 'Buy a jiksaw puzzle and play it',
    };
    const credentialUser = 'user-123';

    // Action
    const { title, body, owner } = new NewThread(payload, credentialUser);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(credentialUser);
  });
});
