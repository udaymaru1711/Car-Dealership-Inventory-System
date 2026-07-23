const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey_cardealership_2026';

describe('Vehicle CRUD API (/api/vehicles)', () => {
  let userToken;
  let adminToken;
  let testVehicleId;

  beforeAll(async () => {
    userToken = jwt.sign({ id: 1, email: 'user@example.com', role: 'user' }, jwtSecret, { expiresIn: '1h' });
    adminToken = jwt.sign({ id: 2, email: 'admin@example.com', role: 'admin' }, jwtSecret, { expiresIn: '1h' });

    // Seed initial test vehicle
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        make: 'Porsche',
        model: '911 GT3',
        year: 2024,
        category: 'Sports',
        price: 182900,
        quantity: 3,
        description: 'Track-ready precision engineering'
      });

    testVehicleId = res.body.vehicle.id;
  });

  describe('POST /api/vehicles (Create Vehicle)', () => {
    it('should create a new vehicle successfully', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'BMW',
          model: 'M5 Competition',
          year: 2024,
          category: 'Sedan',
          price: 109900,
          quantity: 2
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Vehicle created successfully');
      expect(res.body.vehicle).toHaveProperty('make', 'BMW');
    });

    it('should fail creation if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          model: 'Civic',
          year: 2023
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Make, model, year, category, and price are required/);
    });
  });

  describe('GET /api/vehicles (List Vehicles)', () => {
    it('should return list of all vehicles', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('count');
      expect(Array.isArray(res.body.vehicles)).toBe(true);
      expect(res.body.vehicles.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/vehicles/:id (Update Vehicle)', () => {
    it('should update vehicle details', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${testVehicleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          price: 195000,
          quantity: 5
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Vehicle updated successfully');
      expect(parseFloat(res.body.vehicle.price)).toBe(195000);
      expect(res.body.vehicle.quantity).toBe(5);
    });

    it('should return 404 if vehicle ID does not exist', async () => {
      const res = await request(app)
        .put('/api/vehicles/999999')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 20000 });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Vehicle not found');
    });
  });

  describe('DELETE /api/vehicles/:id (Delete Vehicle - Admin only)', () => {
    it('should reject delete attempt by regular non-admin user', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${testVehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toMatch(/Admin access required/);
    });

    it('should allow deletion of vehicle by admin', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${testVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Vehicle deleted successfully');
    });
  });
});
