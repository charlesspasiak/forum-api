const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    const testCases = [
      {
        input: 'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY',
        expected: 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
      },
      {
        input: 'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'tidak dapat membuat user baru karena tipe data tidak sesuai',
      },
      {
        input: 'REGISTER_USER.USERNAME_LIMIT_CHAR',
        expected: 'tidak dapat membuat user baru karena karakter username melebihi batas limit',
      },
      {
        input: 'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER',
        expected: 'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      },
      {
        input: 'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY',
        expected: 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
      },
      {
        input: 'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'tidak dapat membuat user baru karena tipe data tidak sesuai',
      },
      {
        input: 'REGISTER_USER.USERNAME_LIMIT_CHAR',
        expected: 'tidak dapat membuat user baru karena karakter username melebihi batas limit',
      },
      {
        input: 'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER',
        expected: 'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      },
      {
        input: 'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY',
        expected: 'harus mengirimkan username dan password',
      },
      {
        input: 'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'username dan password harus string',
      },
      {
        input: 'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
        expected: 'harus mengirimkan token refresh',
      },
      {
        input: 'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'refresh token harus string',
      },
      {
        input: 'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
        expected: 'harus mengirimkan token refresh',
      },
      {
        input: 'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'refresh token harus string',
      },
      {
        input: 'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
        expected: 'gagal membuat thread, beberapa properti yang dibutuhkan tidak ada',
      },
      {
        input: 'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'gagal membuat thread baru, tipe data tidak sesuai',
      },
      {
        input: 'ADD_THREAD.TITLE_LIMIT_CHAR',
        expected: 'tidak dapat membuat user baru karena title melebihi batas limit',
      },
      {
        input: 'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
        expected: 'gagal membuat thread, beberapa properti yang dibutuhkan tidak ada',
      },
      {
        input: 'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'gagal membuat thread baru, tipe data tidak sesuai',
      },
      {
        input: 'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
        expected: 'gagal membuat komentar baru, properti yang dibutuhkan tidak ada',
      },
      {
        input: 'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'gagal membuat komentar baru, tipe data tidak sesuai',
      },
      {
        input: 'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
        expected: 'gagal membuat komentar baru, properti yang dibutuhkan tidak ada',
      },
      {
        input: 'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'gagal membuat komentar baru, tipe data tidak sesuai',
      },
      {
        input: 'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
        expected: 'gagal membuat balasan baru, properti yang dibutuhkan tidak ada',
      },
      {
        input: 'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'gagal membuat balasan baru, tipe data tidak sesuai',
      },
      {
        input: 'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
        expected: 'gagal membuat balasan baru, properti yang dibutuhkan tidak ada',
      },
      {
        input: 'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
        expected: 'gagal membuat balasan baru, tipe data tidak sesuai',
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const error = new Error(input);
      expect(DomainErrorTranslator.translate(error)).toStrictEqual(new InvariantError(expected));
    });
  });

  it('should return original error when error message is not needed to translate', () => {
    const error = new Error('some_error_message');
    const translatedError = DomainErrorTranslator.translate(error);
    expect(translatedError).toStrictEqual(error);
  });
});
