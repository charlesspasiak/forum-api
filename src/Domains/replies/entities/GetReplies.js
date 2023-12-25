/* eslint-disable camelcase */
/* eslint-disable valid-typeof */
class GetReplies {
  constructor(payload) {
    this._verifyPayload(payload);
    const replies = this._transformReplies(payload);
    this.replies = replies;
  }

  _verifyPayload({ replies }) {
    if (!Array.isArray(replies)) {
      throw new Error('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const requiredProperties = ['id', 'username', 'date', 'content', 'is_delete'];

    for (const reply of replies) {
      const hasAllProperties = requiredProperties.every((property) => property in reply);

      if (!hasAllProperties) {
        throw new Error('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    for (const reply of replies) {
      for (const key in reply) {
        if (requiredProperties.includes(key)) {
          const expectedType = key === 'is_delete' ? 'boolean' : 'string';

          if (typeof reply[key] !== expectedType) {
            throw new Error('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
          }
        }
      }
    }
  }

  _transformReplies({ replies }) {
    return replies.map(({ id, username, date, is_delete, content }) => ({
      id,
      username,
      date,
      content: is_delete ? '**balasan telah dihapus**' : content,
    }));
  }
}

module.exports = GetReplies;
