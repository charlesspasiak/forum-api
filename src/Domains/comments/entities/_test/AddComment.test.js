const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: 'user-123',
      thread: 'thread-123',
    };

    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      user_id: 'user-123',
      thread_id: 'thread-123',
      content: true,
    };

    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new comment object correctly', () => {
    const payload = {
      user_id: 'user-123',
      thread_id: 'thread-123',
      content: 'isi comment',
    };

    const { user_id, thread_id, content } = new AddComment(payload);

    expect(user_id).toEqual(payload.user_id);
    expect(thread_id).toEqual(payload.thread_id);
    expect(content).toEqual(payload.content);
  });
});
