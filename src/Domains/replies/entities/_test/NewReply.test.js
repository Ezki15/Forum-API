const NewReply = require('../NewReply');

describe(' a new reply entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};
    const credentialUser = 'user-123';
    const commentId = 'comment-123';

    // Action and assert
    expect(() => new NewReply(payload, credentialUser, commentId)).toThrow('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };
    const credentialUser = 'user-123';
    const commentId = 'comment-123';

    // Action and assert
    expect(() => new NewReply(payload, credentialUser, commentId)).toThrow('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'reply is reply',
    };
    const credentialUser = 'user-123';
    const commentId1 = 'comment-123';

    // Action
    const {
      content, owner, commentId,
    } = new NewReply(payload, credentialUser, commentId1);

    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(credentialUser);
    expect(commentId).toEqual(commentId1);
  });
});
