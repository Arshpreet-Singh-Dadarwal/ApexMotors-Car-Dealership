import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import vehicleRoutes from './src/routes/vehicleRoutes.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

dotenv.config();

// Connect to MongoDB
connectDB();

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
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      vehicles: {
        list: 'GET /api/vehicles',
        search: 'GET /api/vehicles/search',
        get: 'GET /api/vehicles/:id',
        create: 'POST /api/vehicles (Admin)',
        update: 'PUT /api/vehicles/:id (Admin)',
        delete: 'DELETE /api/vehicles/:id (Admin)',
        purchase: 'POST /api/vehicles/:id/purchase',
        restock: 'POST /api/vehicles/:id/restock (Admin)',
        byCategory: 'GET /api/vehicles/category/:category',
        stats: 'GET /api/vehicles/stats/summary (Admin)'
      }
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API Base URL: http://localhost:${PORT}/api`);
 
});