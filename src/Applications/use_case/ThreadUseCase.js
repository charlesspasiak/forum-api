const AddThread = require('../../Domains/threads/entities/AddThread');
const GetComment = require('../../Domains/comments/entities/GetComment');
const GetReplies = require('../../Domains/replies/entities/GetReplies');

class ThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async addThread(useCasePayload) {
    const newThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(newThread);
  }

  async getThread(useCasePayload) {
    const threadId = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(threadId);

    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this.getFormattedItems(this._commentRepository.getComments(threadId), 'date');
    const replies = await this.getFormattedItems(this._replyRepository.getReplies(threadId), 'date');

    const commentsWithReplies = this.buildCommentsWithReplies(comments, replies, threadId);

    return {
      thread: {
        ...thread,
        comments: commentsWithReplies,
      },
    };
  }

  async getFormattedItems(repositoryPromise, key) {
    const items = await repositoryPromise;
    return items.map((item) => ({ ...item, [key]: new Date(item[key]).toISOString() }));
  }

  buildCommentsWithReplies(comments, replies, threadId) {
    return comments
      .filter((comment) => comment.thread_id === threadId)
      .map((comment) => {
        const repliesForComment = replies
          .filter((reply) => reply.comment_id === comment.id)
          .map((reply) => new GetReplies({ replies: [reply] }).replies[0]);

        const buildGetComment = new GetComment({ comments: [comment] }).comments[0];

        return {
          ...buildGetComment,
          replies: repliesForComment,
        };
      });
  }
}

module.exports = ThreadUseCase;
