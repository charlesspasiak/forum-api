class AddThread {
  constructor(payload) {
    this._validatePayload(payload);

    this.title = payload.title;
    this.body = payload.body;
    this.userId = payload.userId;
  }

  _validatePayload({ title, body, userId }) {
    this._validateRequiredProperties(title, body, userId);
    this._validateDataTypes(title, body, userId);
    this._validateTitleLength(title);
  }

  _validateRequiredProperties(title, body, userId) {
    if (!title || !body || !userId) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }

  _validateDataTypes(title, body, userId) {
    if (typeof title !== 'string' || typeof body !== 'string' || typeof userId !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _validateTitleLength(title) {
    if (title.length > 50) {
      throw new Error('ADD_THREAD.TITLE_LIMIT_CHAR');
    }
  }
}

module.exports = AddThread;
