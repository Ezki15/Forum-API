const NewComment = require('../NewComment');

describe('a new comment entities', () => {
  it('should throw error when payload did not contain neede property', () => {
    // Arrange
    const payload = {};
    const credentialUser = 'user-123';
    const threadId = 'thread-123';

    // Action and assert
    expect(() => new NewComment(payload, credentialUser, threadId)).toThrow('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };
    const credentialUser = 'user-123';
    const threadId = 'thread-123';

    // Action and assert
    expect(() => new NewComment(payload, credentialUser, threadId)).toThrow('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'comment is comment',
    };
    const credentialUser = 'user-123';
    const threadId1 = 'thread-123';

    // Action
    const { content, owner, threadId } = new NewComment(payload, credentialUser, threadId1);

    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(credentialUser);
    expect(threadId).toEqual(threadId1);
  });
});
