const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey_cardealership_2026';

describe('Inventory Management API (/api/vehicles/:id/purchase & restock)', () => {
  let userToken;
  let adminToken;
  let vehicleId;
  let outOfStockVehicleId;

  beforeAll(async () => {
    userToken = jwt.sign({ id: 1, email: 'user@example.com', role: 'user' }, jwtSecret, { expiresIn: '1h' });
    adminToken = jwt.sign({ id: 2, email: 'admin@example.com', role: 'admin' }, jwtSecret, { expiresIn: '1h' });

    // Seed vehicle with stock
    const res1 = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        make: 'Ferrari',
        model: 'F8 Tributo',
        year: 2024,
        category: 'Sports',
        price: 280000,
        quantity: 2
      });
    vehicleId = res1.body.vehicle.id;

    // Seed out of stock vehicle
    const res2 = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        make: 'Lamborghini',
        model: 'Huracan Evo',
        year: 2023,
        category: 'Sports',
        price: 210000,
        quantity: 0
      });
    outOfStockVehicleId = res2.body.vehicle.id;
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should successfully purchase a vehicle and decrement stock quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Vehicle purchased successfully');
      expect(res.body.vehicle.quantity).toBe(1);
    });

    it('should reject purchase when vehicle is out of stock', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${outOfStockVehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/out of stock/i);
    });

    it('should return 404 if vehicle ID does not exist', async () => {
      const res = await request(app)
        .post('/api/vehicles/999999/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Vehicle not found');
    });
  });

  describe('POST /api/vehicles/:id/restock (Admin Only)', () => {
    it('should reject restock attempt by regular non-admin user', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${outOfStockVehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toMatch(/Admin access required/);
    });

    it('should allow admin to restock vehicle and increase quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${outOfStockVehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Vehicle restocked successfully');
      expect(res.body.vehicle.quantity).toBe(5);
    });
  });
});
