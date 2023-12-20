class GetThread {
  constructor(payload) {
    this._validatePayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.date;
    this.username = payload.username;
  }

  _validatePayload(payload) {
    const { id, title, body, date, username } = payload;

    if (!id || !title || !body || !date || !username) {
      throw new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      !this._isString(id) ||
      !this._isString(title) ||
      !this._isString(body) ||
      !this._isString(date) ||
      !this._isString(username)
    ) {
      throw new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isString(value) {
    return typeof value === 'string';
  }
}

module.exports = GetThread;
