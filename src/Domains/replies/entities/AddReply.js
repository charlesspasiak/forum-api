class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { threadId, commentId, content, userId } = payload;
    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
    this.userId = userId;
  }

  _verifyPayload({ threadId, commentId, content, userId }) {
    if (!threadId || !commentId || !content || !userId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof content !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
