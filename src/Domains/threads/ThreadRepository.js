const METHOD_NOT_IMPLEMENTED_ERROR = new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

class ThreadRepository {
  async addThread(newThread) {
    throw METHOD_NOT_IMPLEMENTED_ERROR;
  }

  async checkAvailabilityThread(threadId) {
    throw METHOD_NOT_IMPLEMENTED_ERROR;
  }

  async getThread(threadId) {
    throw METHOD_NOT_IMPLEMENTED_ERROR;
  }
}

module.exports = ThreadRepository;
