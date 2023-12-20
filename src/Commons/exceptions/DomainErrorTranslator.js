const InvariantError = require('./InvariantError');

const createInvariantError = (message) => new InvariantError(message);

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': createInvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': createInvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai'
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': createInvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit'
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': createInvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang'
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': createInvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': createInvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': createInvariantError(
    'harus mengirimkan token refresh'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': createInvariantError(
    'refresh token harus string'
  ),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': createInvariantError(
    'harus mengirimkan token refresh'
  ),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': createInvariantError(
    'refresh token harus string'
  ),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': createInvariantError(
    'gagal membuat thread, beberapa properti yang dibutuhkan tidak ada'
  ),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': createInvariantError(
    'gagal membuat thread baru, tipe data tidak sesuai'
  ),
  'ADD_THREAD.TITLE_LIMIT_CHAR': createInvariantError(
    'tidak dapat membuat user baru karena title melebihi batas limit'
  ),
  'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': createInvariantError(
    'gagal membuat thread, beberapa properti yang dibutuhkan tidak ada'
  ),
  'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': createInvariantError(
    'gagal membuat thread baru, tipe data tidak sesuai'
  ),
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': createInvariantError(
    'gagal membuat komentar baru, properti yang dibutuhkan tidak ada'
  ),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': createInvariantError(
    'gagal membuat komentar baru, tipe data tidak sesuai'
  ),
  'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': createInvariantError(
    'gagal membuat komentar baru, properti yang dibutuhkan tidak ada'
  ),
  'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': createInvariantError(
    'gagal membuat komentar baru, tipe data tidak sesuai'
  ),
  'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': createInvariantError(
    'gagal membuat balasan baru, properti yang dibutuhkan tidak ada'
  ),
  'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': createInvariantError(
    'gagal membuat balasan baru, tipe data tidak sesuai'
  ),
  'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': createInvariantError(
    'gagal membuat balasan baru, properti yang dibutuhkan tidak ada'
  ),
  'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': createInvariantError(
    'gagal membuat balasan baru, tipe data tidak sesuai'
  ),
};

module.exports = DomainErrorTranslator;
