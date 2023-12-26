const AddLike = require('../AddLike');

describe('a AddLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-xx123',
    };
    expect(() => new AddLike(payload)).toThrow('REGISTER_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 1234,
      commentId: [],
      userId: 'user-123',
    };
    expect(() => new AddLike(payload)).toThrow('REGISTER_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddLike object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-xx123',
      userId: 'user-123',
    };
    const { threadId, commentId, userId } = new AddLike(payload);
    expect(threadId).toEqual('thread-123');
    expect(commentId).toEqual('comment-xx123');
    expect(userId).toEqual('user-123');
  });
});
