class AddedThread {
  constructor(payload) {
    this._validatePayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.userId;
  }

  _validatePayload({ id, title, userId }) {
    this._validateRequiredProperties(id, title, userId);
    this._validateDataTypes(id, title, userId);
  }

  _validateRequiredProperties(id, title, userId) {
    if (!id || !title || !userId) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }

  _validateDataTypes(id, title, userId) {
    if (typeof id !== 'string' || typeof title !== 'string' || typeof userId !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
