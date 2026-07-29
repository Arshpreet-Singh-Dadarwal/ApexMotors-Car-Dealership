import request from 'supertest';
import app from '../../server.js';
import User from '../models/User.js';

describe('Vehicle API Tests', () => {
  let adminToken, userToken;
  let vehicleId;

  const adminUser = {
    email: 'admin@test.com',
    password: 'admin123',
    fullName: 'Admin User',
    role: 'admin'
  };

  const regularUser = {
    email: 'user@test.com',
    password: 'user123',
    fullName: 'Regular User',
    role: 'user'
  };

  const testVehicle = {
    make: 'BMW',
    model: 'M5 Competition',
    category: 'Sedan',
    price: 125000,
    quantity: 3,
    year: 2024,
    description: 'Test description',
    image_url: 'https://example.com/image.jpg'
  };

  beforeAll(async () => {
    // Create admin user and get token
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send(adminUser);
    adminToken = adminRes.body.token;

    // Create regular user and get token
    const userRes = await request(app)
      .post('/api/auth/register')
      .send(regularUser);
    userToken = userRes.body.token;
  });

  describe('POST /api/vehicles', () => {
    test('should create vehicle as admin', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testVehicle);

      expect(response.status).toBe(201);
      expect(response.body.make).toBe(testVehicle.make);
      expect(response.body.model).toBe(testVehicle.model);
      expect(response.body.price).toBe(testVehicle.price);
      vehicleId = response.body.id;
    });

    test('should reject vehicle creation as regular user', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testVehicle);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Not authorized as admin');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ make: 'BMW' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/vehicles', () => {
    test('should get all vehicles', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/vehicles/search', () => {
    test('should search vehicles by make', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?q=BMW')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.results.length).toBeGreaterThan(0);
      expect(response.body.results[0].make).toBe('BMW');
    });

    test('should search vehicles by price range', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?minPrice=100000&maxPrice=150000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.results.every(v => v.price >= 100000 && v.price <= 150000)).toBe(true);
    });
  });

  describe('GET /api/vehicles/:id', () => {
    test('should get vehicle by id', async () => {
      const response = await request(app)
        .get(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(vehicleId);
    });

    test('should return 404 for non-existent vehicle', async () => {
      const response = await request(app)
        .get('/api/vehicles/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    test('should update vehicle as admin', async () => {
      const updateData = { price: 135000, quantity: 5 };
      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.price).toBe(135000);
      expect(response.body.quantity).toBe(5);
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    test('should purchase vehicle successfully', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity_remaining).toBe(4);
    });

    test('should fail when insufficient stock', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    test('should restock vehicle as admin', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 3 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(7);
    });

    test('should reject restock as regular user', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ amount: 3 });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    test('should delete vehicle as admin', async () => {
      const response = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Vehicle removed successfully');
    });

    test('should reject deletion as regular user', async () => {
      const response = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});