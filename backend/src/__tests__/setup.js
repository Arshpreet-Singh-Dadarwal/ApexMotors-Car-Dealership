import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use a test database
const TEST_DB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/dealership_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Drop test database and close connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});