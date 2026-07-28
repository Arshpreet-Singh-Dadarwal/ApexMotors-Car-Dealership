import express from 'express';
import { body } from 'express-validator';
import {
  getVehicles,
  searchVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  restockVehicle,
  purchaseVehicle,
  getVehiclesByCategory,
  getInventoryStats,
} from '../controllers/vehicleController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const vehicleValidation = [
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity cannot be negative'),
];

// Public routes (authenticated users)
router.get('/', protect, getVehicles);
router.get('/search', protect, searchVehicles);
router.get('/category/:category', protect, getVehiclesByCategory);
router.get('/stats/summary', protect, admin, getInventoryStats);
router.get('/:id', protect, getVehicle);
router.post('/:id/purchase', protect, purchaseVehicle);

// Admin only routes
router.post('/', protect, admin, vehicleValidation, createVehicle);
router.put('/:id', protect, admin, vehicleValidation, updateVehicle);
router.delete('/:id', protect, admin, deleteVehicle);
router.post('/:id/restock', protect, admin, restockVehicle);

export default router;