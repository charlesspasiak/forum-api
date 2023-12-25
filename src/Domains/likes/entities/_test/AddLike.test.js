const AddLike = require('../AddLike');

describe('a AddLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      thread_id: 'thread-123',
      comment_id: 'comment-xx123',
    };
    expect(() => new AddLike(payload)).toThrowError('REGISTER_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      thread_id: 1234,
      comment_id: [],
      user_id: 'user-123',
    };
    expect(() => new AddLike(payload)).toThrowError('REGISTER_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddLike object correctly', () => {
    const payload = {
      thread_id: 'thread-123',
      comment_id: 'comment-xx123',
      user_id: 'user-123',
    };
    const { thread_id, comment_id, user_id } = new AddLike(payload);
    expect(thread_id).toEqual('thread-123');
    expect(comment_id).toEqual('comment-xx123');
    expect(user_id).toEqual('user-123');
  });
});
