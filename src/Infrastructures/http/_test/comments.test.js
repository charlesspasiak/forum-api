const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  const getAccessToken = async (server) => {
    const loginPayload = {
      username: 'lestrapa',
      password: 'secret',
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: loginPayload.username,
        password: loginPayload.password,
        fullname: 'Naruto Uzumaki',
      },
    });

    const authentication = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: loginPayload,
    });

    const responseAuth = JSON.parse(authentication.payload);
    const { accessToken } = responseAuth.data;

    return accessToken;
  };

  const createThread = async (server, accessToken) => server.inject({
    method: 'POST',
    url: '/threads',
    payload: {
      title: 'sebuah thread',
      body: 'isi body thread',
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const createComment = async (server, accessToken, threadId, content) => server.inject({
    method: 'POST',
    url: `/threads/${threadId}/comments`,
    payload: {
      content,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const deleteComment = async (server, accessToken, threadId, commentId) => server.inject({
    method: 'DELETE',
    url: `/threads/${threadId}/comments/${commentId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  describe('when POST threads/{threadId}/comments', () => {
    it('should respond with 401 if payload lacks an access token', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 400 if payload lacks needed properties', async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const thread = await createThread(server, accessToken);

      const threadResponse = JSON.parse(thread.payload);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'gagal membuat komentar baru, properti yang dibutuhkan tidak ada'
      );
    });

    it('should respond with 400 if payload does not meet data type specifications', async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const thread = await createThread(server, accessToken);

      const threadResponse = JSON.parse(thread.payload);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: {},
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal membuat komentar baru, tipe data tidak sesuai');
    });

    it('should respond with 404 if thread id is invalid', async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-xyz/comments',
        payload: {
          content: 'isi comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan!');
    });

    it('should respond with 201 and return the addedComment', async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const thread = await createThread(server, accessToken);

      const threadResponse = JSON.parse(thread.payload);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.content).toEqual('sebuah comment');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{id}', () => {
    it('should respond with 404 if thread is not found', async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      const response = await deleteComment(server, accessToken, 'xxx', 'xyz');

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan!');
    });

    it('should respond with 404 if comment is not found', async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const thread = await createThread(server, accessToken);

      const threadResponse = JSON.parse(thread.payload);

      const response = await deleteComment(
        server,
        accessToken,
        threadResponse.data.addedThread.id,
        '123'
      );

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan!');
    });

    it('should respond with 403 if another user tries to delete the comment', async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const thread = await createThread(server, accessToken);

      const threadResponse = JSON.parse(thread.payload);

      const comment = await createComment(
        server,
        accessToken,
        threadResponse.data.addedThread.id,
        'mantuull!!'
      );

      const commentResponse = JSON.parse(comment.payload);

      // Other user
      const loginPayload2 = {
        username: 'zorro',
        password: 'secret',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'zorro',
          password: 'secret',
          fullname: 'Roronoa Zorro',
        },
      });

      const authentication2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload2,
      });

      const responseAuth2 = JSON.parse(authentication2.payload);

      const replyResponse = await deleteComment(
        server,
        responseAuth2.data.accessToken,
        threadResponse.data.addedThread.id,
        commentResponse.data.addedComment.id
      );

      const responseJson = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak bisa menghapus komentar orang lain.');
    });

    it('should respond with 200 and return success', async () => {
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const thread = await createThread(server, accessToken);

      const threadResponse = JSON.parse(thread.payload);

      const comment = await createComment(
        server,
        accessToken,
        threadResponse.data.addedThread.id,
        'mantuull!!'
      );

      const commentResponse = JSON.parse(comment.payload);

      const replyResponse = await deleteComment(
        server,
        accessToken,
        threadResponse.data.addedThread.id,
        commentResponse.data.addedComment.id
      );

      const responseJson = JSON.parse(replyResponse.payload);

      expect(replyResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
