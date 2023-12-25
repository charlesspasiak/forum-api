const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      userId: 'user-123',
      thread: 'thread-123',
      comment: 'comment-xx123',
    };

    expect(() => new AddReply(payload)).toThrow('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-xx123',
      content: 123,
    };

    expect(() => new AddReply(payload)).toThrow('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new reply object correctly', () => {
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-xx123',
      content: 'sebuah balasan komentar',
    };

    const { userId, threadId, commentId, content } = new AddReply(payload);

    expect(userId).toEqual(payload.userId);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
  });
});
