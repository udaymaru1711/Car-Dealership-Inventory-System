const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { verifyToken, requireAdmin } = require('../src/middleware/authMiddleware');

const jwtSecret = 'supersecretjwtkey_cardealership_2026';

// Test Express app setup
const app = express();
app.use(express.json());

// Protected test routes
app.get('/api/test/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

app.get('/api/test/admin-only', verifyToken, requireAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome Admin', user: req.user });
});

describe('Authentication & Authorization Middleware', () => {
  let userToken;
  let adminToken;

  beforeAll(() => {
    userToken = jwt.sign({ id: 1, email: 'user@example.com', role: 'user' }, jwtSecret, { expiresIn: '1h' });
    adminToken = jwt.sign({ id: 2, email: 'admin@example.com', role: 'admin' }, jwtSecret, { expiresIn: '1h' });
  });

  describe('verifyToken Middleware', () => {
    it('should grant access when valid Bearer token is provided', async () => {
      const res = await request(app)
        .get('/api/test/protected')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Access granted');
      expect(res.body.user).toHaveProperty('email', 'user@example.com');
    });

    it('should reject request without Authorization header', async () => {
      const res = await request(app).get('/api/test/protected');

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toMatch(/No authorization token provided/);
    });

    it('should reject request with malformed Authorization header', async () => {
      const res = await request(app)
        .get('/api/test/protected')
        .set('Authorization', `Basic ${userToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toMatch(/Invalid token format/);
    });

    it('should reject request with invalid/tampered JWT token', async () => {
      const res = await request(app)
        .get('/api/test/protected')
        .set('Authorization', 'Bearer invalid.jwt.token');

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toMatch(/Invalid authentication token/);
    });
  });

  describe('requireAdmin Middleware', () => {
    it('should allow access to admin user', async () => {
      const res = await request(app)
        .get('/api/test/admin-only')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Welcome Admin');
    });

    it('should block non-admin user with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/test/admin-only')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toMatch(/Admin access required/);
    });
  });
});
