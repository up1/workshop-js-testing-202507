const request = require('supertest');
const { server } = require('../../server');

describe('User API Tests', () => {
  let app;

  beforeAll(() => {
    app = server;
  });

  afterAll((done) => {
    // Close the server after tests
    if (app && app.close) {
      app.close(done);
    } else {
      done();
    }
  });

  describe('GET /users', () => {
    test('should return 401 when no authorization header is provided', async () => {
      const response = await request(app)
        .get('/users');

      expect(response.status).toBe(401);
    });

    test('should return 401 when invalid authorization token is provided', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    test('should return users when valid authorization token is provided', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verify the structure of the first user
      if (response.body.length > 0) {
        const user = response.body[0];
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
      }
    });

    test('should return initial users data', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'John Doe',
            email: 'john.doe@example.com',
            age: 30
          }),
          expect.objectContaining({
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            age: 25
          })
        ])
      );
    });
  });

  describe('POST /users', () => {
    test('should create a new user with valid data', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        age: 28
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer token')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newUser);
    });

    test('should return 400 when name is missing', async () => {
      const invalidUser = {
        email: 'test@example.com',
        age: 28
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer token')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Name and email are required');
    });

    test('should return 400 when email is missing', async () => {
      const invalidUser = {
        name: 'Test User',
        age: 28
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer token')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Name and email are required');
    });

    test('should return 400 when both name and email are missing', async () => {
      const invalidUser = {
        age: 28
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer token')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Name and email are required');
    });

    test('should create user and verify it appears in GET request', async () => {
      const newUser = {
        name: 'Verification User',
        email: 'verification@example.com',
        age: 35
      };

      // Create the user
      const createResponse = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer token')
        .send(newUser);

      expect(createResponse.status).toBe(201);

      // Verify the user appears in the list
      const getResponse = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer token');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining(newUser)
        ])
      );
    });
  });

  describe('Content-Type handling', () => {
    test('should handle JSON content type for POST requests', async () => {
      const newUser = {
        name: 'JSON User',
        email: 'json@example.com'
      };

      const response = await request(app)
        .post('/users')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newUser);
    });
  });
});



