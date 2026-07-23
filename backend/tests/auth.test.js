const request = require('supertest');
const app = require('../src/app');

describe('POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Driver',
        email: 'driver@example.com',
        password: 'password123',
        role: 'user'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body.user).toHaveProperty('email', 'driver@example.com');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should reject registration if email is already taken', async () => {
    // First registration
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate User',
        email: 'duplicate@example.com',
        password: 'password123'
      });

    // Duplicate registration attempt
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate User',
        email: 'duplicate@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'User with this email already exists');
  });

  it('should fail validation if password is missing or too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Short Pass',
        email: 'short@example.com',
        password: '123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Password must be at least 6 characters/);
  });
});
