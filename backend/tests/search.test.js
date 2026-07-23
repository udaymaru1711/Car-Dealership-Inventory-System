const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey_cardealership_2026';

describe('Vehicle Search API (GET /api/vehicles/search)', () => {
  let userToken;

  beforeAll(async () => {
    userToken = jwt.sign({ id: 1, email: 'user@example.com', role: 'user' }, jwtSecret, { expiresIn: '1h' });

    // Seed test vehicles
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        make: 'Tesla',
        model: 'Model S Plaid',
        year: 2024,
        category: 'Electric',
        price: 89990,
        quantity: 5
      });

    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        make: 'Audi',
        model: 'R8 V10',
        year: 2023,
        category: 'Sports',
        price: 158600,
        quantity: 2
      });

    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        make: 'Mercedes-Benz',
        model: 'G 63 AMG',
        year: 2024,
        category: 'SUV',
        price: 179000,
        quantity: 1
      });
  });

  it('should search vehicles by make substring', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Tesla')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.some(v => v.make === 'Tesla')).toBe(true);
  });

  it('should filter vehicles by category (e.g. SUV)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?category=SUV')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.every(v => v.category.toLowerCase() === 'suv')).toBe(true);
  });

  it('should filter vehicles by price range (minPrice and maxPrice)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?minPrice=100000&maxPrice=160000')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.every(v => v.price >= 100000 && v.price <= 160000)).toBe(true);
  });

  it('should return all vehicles if no query params are provided', async () => {
    const res = await request(app)
      .get('/api/vehicles/search')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('vehicles');
    expect(Array.isArray(res.body.vehicles)).toBe(true);
  });
});
