class AddThread {
  constructor(payload) {
    this._validatePayload(payload);

    this.title = payload.title;
    this.body = payload.body;
    this.user_id = payload.user_id;
  }

  _validatePayload({ title, body, user_id }) {
    this._validateRequiredProperties(title, body, user_id);
    this._validateDataTypes(title, body, user_id);
    this._validateTitleLength(title);
  }

  _validateRequiredProperties(title, body, user_id) {
    if (!title || !body || !user_id) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }

  _validateDataTypes(title, body, user_id) {
    if (typeof title !== 'string' || typeof body !== 'string' || typeof user_id !== 'string') {
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
