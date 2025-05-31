const SavedReply = require('../SavedReply');

describe('a SavedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new SavedReply(payload)).toThrow('SAVED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new SavedReply(payload)).toThrow('SAVED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create SavedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply is reply',
      owner: 'user-123',
    };
    // Action
    const savedReply = new SavedReply(payload);
    // Assert
    expect(savedReply.id).toEqual(payload.id);
    expect(savedReply.content).toEqual(payload.content);
    expect(savedReply.owner).toEqual(payload.owner);
  });
});
