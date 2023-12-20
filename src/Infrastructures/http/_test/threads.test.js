const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  async function getAccessToken() {
    const loginPayload = {
      username: 'lestrapa',
      password: 'secret',
    };

    const server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'lestrapa',
        password: 'secret',
        fullname: 'Charles Pasiak',
      },
    });

    const authentication = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: loginPayload,
    });

    const responseAuth = JSON.parse(authentication.payload);
    return responseAuth.data.accessToken;
  }

  describe('when POST /threads', () => {
    let server;
    let accessToken;

    beforeEach(async () => {
      server = await createServer(container);
      accessToken = await getAccessToken();
    });

    it('should respond with 401 if payload has no access token', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 400 if payload does not contain required properties', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'gagal membuat thread, beberapa properti yang dibutuhkan tidak ada'
      );
    });

    it('should respond with 400 if payload does not meet data type specifications', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'judul thread',
          body: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal membuat thread baru, tipe data tidak sesuai');
    });

    it('should respond with 201 and create a new thread', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread.title).toEqual('sebuah thread');
    });
  });

  describe('when GET /threads', () => {
    let server;
    let accessToken;

    beforeEach(async () => {
      server = await createServer(container);
      accessToken = await getAccessToken();
    });

    it('should respond with 404 when thread is not found', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/threads/4oo4',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan!');
    });

    it('should respond with 200 and return the detail of the thread', async () => {
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'judul sebuah thread',
          body: 'coba isi thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual(JSON.parse(threadResponse.payload).data.addedThread.id);
      expect(responseJson.data.thread.title).toEqual('judul sebuah thread');
      expect(responseJson.data.thread.body).toEqual('coba isi thread');
      expect(responseJson.data.thread.username).toEqual('lestrapa');
      expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
      if (Array.isArray(responseJson.data.thread.comments)) {
        responseJson.data.thread.comments.forEach((comments) => {
          if (comments.replies) {
            expect(Array.isArray(responseJson.data.thread.comments.replies)).toBe(true);
          }
        });
      }
    });
  });
});
