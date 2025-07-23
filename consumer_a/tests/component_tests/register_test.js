const request = require('supertest');
const nock = require('nock');
const { server, register } = require('../../server');

describe('Register API Tests', () => {
  const userApiHost = process.env.USER_API_HOST || 'http://localhost:8081';
  
  beforeEach(() => {
    // Clean nock before each test
    nock.cleanAll();
  });

  afterEach(() => {
    // Ensure all HTTP interceptors are consumed
    if (!nock.isDone()) {
      console.error('Pending nock interceptors:', nock.pendingMocks());
    }
    nock.cleanAll();
  });

  describe('POST /api/register - Component Tests with Supertest and Nock user service', () => {
    test('should successfully register a user when user service returns 201', async () => {
      const userData = {
        name: 'demo',
        email: 'demo.email@example.com',
        age: 30
      };

      const expectedResponse = {
        id: 1,
        name: 'demo',
        email: 'demo.email@example.com',
        age: 30
      };

      // Mock the external user service
      nock(userApiHost)
        .post('/users', userData)
        .matchHeader('authorization', 'Bearer token')
        .reply(201, expectedResponse);

      const response = await request(server)
        .post('/api/register')
        .set('Authorization', 'Bearer token')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        header: {
          status: 'success',
          message: 'User registered successfully'
        },
        data: expectedResponse
      });
    });

    test('should return 401 when authorization header is missing', async () => {
      const userData = {
        name: 'demo',
        email: 'demo.email@example.com'
      };

      const response = await request(server)
        .post('/api/register')
        .send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized' });
    });

    test('should return 401 when authorization token is invalid', async () => {
      const userData = {
        name: 'demo',
        email: 'demo.email@example.com'
      };

      const response = await request(server)
        .post('/api/register')
        .set('Authorization', 'Bearer invalid-token')
        .send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized' });
    });

    test('should return 500 when user service returns 400 error', async () => {
      const userData = {
        name: '',
        email: 'invalid-email'
      };

      // Mock the external user service to return 400
      nock(userApiHost)
        .post('/users', userData)
        .matchHeader('authorization', 'Bearer token')
        .reply(400, { error: 'Invalid user data' });

      const response = await request(server)
        .post('/api/register')
        .set('Authorization', 'Bearer token')
        .send(userData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });

    test('should return 500 when user service is unreachable', async () => {
      const userData = {
        name: 'demo',
        email: 'demo.email@example.com'
      };

      // Mock network error
      nock(userApiHost)
        .post('/users')
        .replyWithError('Network error');

      const response = await request(server)
        .post('/api/register')
        .set('Authorization', 'Bearer token')
        .send(userData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });

    test('should return 500 when user service returns 500 error', async () => {
      const userData = {
        name: 'demo',
        email: 'demo.email@example.com'
      };

      // Mock the external user service to return 500
      nock(userApiHost)
        .post('/users', userData)
        .matchHeader('authorization', 'Bearer token')
        .reply(500, { error: 'Internal server error' });

      const response = await request(server)
        .post('/api/register')
        .set('Authorization', 'Bearer token')
        .send(userData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });

    test('should handle user service timeout', async () => {
      const userData = {
        name: 'demo',
        email: 'demo.email@example.com'
      };

      // Mock timeout
      nock(userApiHost)
        .post('/users')
        .delay(2000)
        .reply(201, { id: 1, ...userData });

      const response = await request(server)
        .post('/api/register')
        .set('Authorization', 'Bearer token')
        .send(userData);

      expect(response.status).toBe(500);
    }, 3000);

    test('should send correct headers to user service', async () => {
      const userData = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com'
      };

      const scope = nock(userApiHost)
        .post('/users', userData)
        .matchHeader('authorization', 'Bearer token')
        .matchHeader('content-type', 'application/json')
        .reply(201, { id: 2, ...userData });

      await request(server)
        .post('/api/register')
        .set('Authorization', 'Bearer token')
        .send(userData);

      expect(scope.isDone()).toBe(true);
    });
  });
});