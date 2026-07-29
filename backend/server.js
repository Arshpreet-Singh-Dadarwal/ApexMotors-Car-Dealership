import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import vehicleRoutes from './src/routes/vehicleRoutes.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

dotenv.config();


// Connect to MongoDB (skip for tests)
if (process.env.NODE_ENV !== 'test') {
  await connectDB();
}
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
}
export default app;