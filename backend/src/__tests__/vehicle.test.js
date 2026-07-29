import request from 'supertest';
import app from '../../server.js';
import User from '../models/User.js';

describe('Vehicle API Tests', () => {
  let adminToken;
  let userToken;
  let vehicleId;

  const adminUser = {
    email: 'admin@test.com',
    password: 'admin123',
    fullName: 'Admin User',
    role: 'admin',
  };

  const regularUser = {
    email: 'user@test.com',
    password: 'user123',
    fullName: 'Regular User',
    role: 'user',
  };

  const testVehicle = {
    make: 'BMW',
    model: 'M5 Competition',
    category: 'Sedan',
    price: 125000,
    quantity: 3,
    year: 2024,
    description: 'Test description',
    image_url: 'https://example.com/image.jpg',
  };

  beforeEach(async () => {
    // Remove users so registration always succeeds
    await User.deleteMany({});

    // Register admin
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send(adminUser);

    console.log("Admin Register:", adminRes.body);

    adminToken = adminRes.body.token;

    // Register regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send(regularUser);

    console.log("User Register:", userRes.body);

    userToken = userRes.body.token;

    // Create one vehicle using admin
    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testVehicle);

    console.log("Vehicle Create:", vehicleRes.status, vehicleRes.body);

    vehicleId = vehicleRes.body._id;
  });

  describe('POST /api/vehicles', () => {

    test('should create vehicle as admin', async () => {

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testVehicle,
          model: 'M3',
        });

      expect(response.status).toBe(201);
      expect(response.body.make).toBe('BMW');
      expect(response.body.model).toBe('M3');
    });

    test('should reject vehicle creation as regular user', async () => {

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testVehicle);

      expect(response.status).toBe(403);
    });

  });

  describe('GET /api/vehicles', () => {

    test('should get all vehicles', async () => {

      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

    });

  });

  describe('GET /api/vehicles/:id', () => {

    test('should get vehicle by id', async () => {

      const response = await request(app)
        .get(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(vehicleId);

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

    });

  });

  describe('POST /api/vehicles/:id/restock', () => {

    test('should restock vehicle as admin', async () => {

      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 3 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBeDefined();

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

      // Create another vehicle first because the previous one may have been deleted
      const vehicleRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testVehicle,
          model: 'X5',
        });

      const id = vehicleRes.body._id;

      const response = await request(app)
        .delete(`/api/vehicles/${id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);

    });

  });
});