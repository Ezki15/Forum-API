const SavedComment = require('../SavedComment');

describe('a SavedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new SavedComment(payload)).toThrow('SAVED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new SavedComment(payload)).toThrow('SAVED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create SavedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'commment is comment',
      owner: 'user-123',
    };
    // Action
    const savedComment = new SavedComment(payload);
    // Assert
    expect(savedComment.id).toEqual(payload.id);
    expect(savedComment.content).toEqual(payload.content);
    expect(savedComment.owner).toEqual(payload.owner);
  });
});
