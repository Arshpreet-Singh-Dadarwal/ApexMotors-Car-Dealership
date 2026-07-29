import request from 'supertest';
import app from '../../server.js';

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
      vehicleId = response.body.id || response.body._id;
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
      expect(response.body.id || response.body._id).toBe(vehicleId);
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
      const response = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});