import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use a test database
const TEST_DB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/dealership_test';

beforeAll(async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    console.log('Test database connected');
  } catch (error) {
    console.error('Test database connection error:', error);
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      console.log('Test database closed');
    }
  } catch (error) {
    console.error('Error closing test database:', error);
  }
});

afterEach(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    }
  } catch (error) {
    console.error('Error clearing collections:', error);
  }
});