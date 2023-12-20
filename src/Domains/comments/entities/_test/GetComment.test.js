const GetComment = require('../GetComment');

describe('a GetComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      comments: [
        {
          id: 'comment-xx123',
          username: 'naruto',
          date: '2023-12-19',
          content: 'isi comment',
          deleted_at: '',
        },
      ],
    };

    expect(() => new GetComment(payload)).toThrow('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      comments: {},
    };

    const payload2 = {
      comments: [
        {
          id: 'comment-xx123',
          username: 1234,
          date: '2023-12-19',
          content: 'isi comment',
          deleted_at: '',
          is_delete: true,
        },
      ],
    };

    const payload3 = {
      comments: [
        {
          id: 'reply-123',
          username: 'zorro',
          date: '2023-12-19',
          content: 'isi comment pada thread',
          deleted_at: '',
          is_delete: 'true',
        },
      ],
    };

    expect(() => new GetComment(payload)).toThrow('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetComment(payload2)).toThrow('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetComment(payload3)).toThrow('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should remap comments data correctly', () => {
    const payload = {
      comments: [
        {
          id: 'comment-xx123',
          username: 'lutfy',
          date: '2023-12-19',
          content: 'sebuah comment',
          is_delete: false,
        },
        {
          id: 'comment-zrr12',
          username: 'zorro',
          date: '2023-12-19',
          content: 'komentar sudah dihapus',
          is_delete: true,
        },
      ],
    };

    const { comments } = new GetComment(payload);

    const expectedComment = [
      {
        id: 'comment-xx123',
        username: 'lutfy',
        date: '2023-12-19',
        content: 'sebuah comment',
      },
      {
        id: 'comment-zrr12',
        username: 'zorro',
        date: '2023-12-19',
        content: '**komentar telah dihapus**',
      },
    ];

    expect(comments).toEqual(expectedComment);
  });

  it('should create GetComment object correctly', () => {
    const payload = {
      comments: [
        {
          id: 'comment-sj123',
          username: 'sanji',
          date: '2023-12-19',
          content: 'sebuah comment',
          deleted_at: '2023-12-19',
          is_delete: true,
        },
        {
          id: 'comment-xx123',
          username: 'naruto',
          date: '2023-12-19',
          content: 'sebuah comment',
          deleted_at: '2023-12-19',
          is_delete: false,
        },
      ],
    };

    const expected = {
      comments: [
        {
          id: 'comment-sj123',
          username: 'sanji',
          date: '2023-12-19',
          content: '**komentar telah dihapus**',
        },
        {
          id: 'comment-xx123',
          username: 'naruto',
          date: '2023-12-19',
          content: 'sebuah comment',
        },
      ],
    };

    const { comments } = new GetComment(payload);

    expect(comments).toEqual(expected.comments);
  });
});
