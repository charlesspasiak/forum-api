const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      user_id: 'user-123',
    };

    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      content: {},
      user_id: 'user-123',
    };

    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new added reply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'mantap jiwa~',
      user_id: 'user-123',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.user_id);
  });
});
