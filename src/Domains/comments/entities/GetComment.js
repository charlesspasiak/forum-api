class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);
    this.comments = this._transformComments(payload);
  }

  _verifyPayload({ comments }) {
    if (!Array.isArray(comments)) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    for (const comment of comments) {
      const requiredProperties = ['id', 'username', 'date', 'content', 'is_delete'];

      for (const prop of requiredProperties) {
        if (!(prop in comment)) {
          throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }
      }

      this._validateDataType(comment);
    }
  }

  _validateDataType(comment) {
    const dataTypeSpecifications = {
      id: 'string',
      username: 'string',
      date: 'string',
      content: 'string',
      is_delete: 'boolean',
    };

    for (const [key, expectedType] of Object.entries(dataTypeSpecifications)) {
      if (typeof comment[key] !== expectedType) {
        throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }

  _transformComments({ comments }) {
    return comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
    }));
  }
}

module.exports = GetComment;
