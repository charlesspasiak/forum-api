class AddedThread {
  constructor(payload) {
    this._validatePayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.user_id = payload.user_id;
  }

  _validatePayload({ id, title, user_id }) {
    this._validateRequiredProperties(id, title, user_id);
    this._validateDataTypes(id, title, user_id);
  }

  _validateRequiredProperties(id, title, user_id) {
    if (!id || !title || !user_id) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }

  _validateDataTypes(id, title, user_id) {
    if (typeof id !== 'string' || typeof title !== 'string' || typeof user_id !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
