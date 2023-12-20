const GetReplies = require('../GetReplies');

describe('a GetReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      replies: [
        {
          id: 'reply-123',
          username: 'lestrapa',
          date: new Date('2023-12-16').toISOString(),
          content: 'sebuah balasan komentar',
          deleted_at: 333,
        },
      ],
    };

    expect(() => new GetReplies(payload)).toThrowError('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      replies: {},
    };

    const payload2 = {
      replies: [
        {
          id: 'reply-123',
          username: 1234,
          date: new Date('2023-12-16').toISOString(),
          content: 'sebuah balasan komentar',
          deleted_at: '',
          is_delete: true,
        },
      ],
    };

    const payload3 = {
      replies: [
        {
          id: 'reply-123',
          username: 'samtampan',
          date: new Date('2023-12-16').toISOString(),
          content: 'sebuah balasan komentar',
          deleted_at: '',
          is_delete: 'sam',
        },
      ],
    };

    expect(() => new GetReplies(payload)).toThrowError('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetReplies(payload2)).toThrowError('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetReplies(payload3)).toThrowError('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should remap replies data correctly', () => {
    const payload = {
      replies: [
        {
          id: 'reply-123',
          username: 'lestrapa',
          date: new Date('2023-12-16').toISOString(),
          content: 'sebuah balasan komentar',
          deleted_at: '',
          is_delete: false,
        },
      ],
    };

    const { replies } = new GetReplies(payload);

    const expectedReply = [
      {
        id: 'reply-123',
        username: 'lestrapa',
        date: new Date('2023-12-16').toISOString(),
        content: 'sebuah balasan komentar',
      },
    ];

    expect(replies).toEqual(expectedReply);
  });

  it('should create GetReplies object correctly', () => {
    const payload = {
      replies: [
        {
          id: 'reply-123y',
          username: 'boruto',
          date: new Date('2023-12-16').toISOString(),
          content: 'sebuah balasan komentar',
          deleted_at: '2023-09-24 17:52:01.000Z',
          is_delete: true,
        },
        {
          id: 'reply-123',
          username: 'lestrapa',
          date: new Date('2023-12-16').toISOString(),
          content: 'sebuah balasan komentar',
          deleted_at: '2023-09-24 17:52:01.000Z',
          is_delete: false,
        },
      ],
    };

    const expected = {
      replies: [
        {
          id: 'reply-123y',
          username: 'boruto',
          date: new Date('2023-12-16').toISOString(),
          content: '**balasan telah dihapus**',
        },
        {
          id: 'reply-123',
          username: 'lestrapa',
          date: new Date('2023-12-16').toISOString(),
          content: 'sebuah balasan komentar',
        },
      ],
    };

    const { replies } = new GetReplies(payload);

    expect(replies).toEqual(expected.replies);
  });
});
