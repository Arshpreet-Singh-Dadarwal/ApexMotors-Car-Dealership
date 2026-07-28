import Vehicle from '../models/Vehicle.js';
import { validationResult } from 'express-validator';

// @desc    Get all vehicles with optional search/filtering
// @route   GET /api/vehicles
// @route   GET /api/vehicles/search
// @access  Private
export const getVehicles = async (req, res) => {
  try {
    const { search, make, model, category, minPrice, maxPrice } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Search by make or model (text search)
    if (search) {
      filter.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by make
    if (make) {
      filter.make = { $regex: make, $options: 'i' };
    }
    
    // Filter by model
    if (model) {
      filter.model = { $regex: model, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const vehicles = await Vehicle.find(filter).sort({ created_at: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search vehicles (alias for getVehicles with search param)
// @route   GET /api/vehicles/search
// @access  Private
export const searchVehicles = async (req, res) => {
  try {
    const { q, make, model, category, minPrice, maxPrice } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Search by make or model (text search)
    if (q) {
      filter.$or = [
        { make: { $regex: q, $options: 'i' } },
        { model: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Filter by make
    if (make) {
      filter.make = { $regex: make, $options: 'i' };
    }
    
    // Filter by model
    if (model) {
      filter.model = { $regex: model, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by price range
    if (minPrice !== undefined && minPrice !== '') {
      filter.price = { $gte: Number(minPrice) };
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }

    const vehicles = await Vehicle.find(filter).sort({ created_at: -1 });
    res.json({
      results: vehicles,
      count: vehicles.length,
      query: req.query
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
export const createVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Restock vehicle
// @route   POST /api/vehicles/:id/restock
// @access  Private/Admin
// @desc    Restock vehicle
// @route   POST /api/vehicles/:id/restock
// @access  Private/Admin
export const restockVehicle = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'Amount must be at least 1' 
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        message: 'Vehicle not found' 
      });
    }

    const oldQuantity = vehicle.quantity;
    vehicle.quantity += Number(amount);
    await vehicle.save();

    // Return the full updated vehicle
    res.json({
      _id: vehicle._id,
      make: vehicle.make,
      model: vehicle.model,
      category: vehicle.category,
      price: vehicle.price,
      quantity: vehicle.quantity,
      year: vehicle.year,
      description: vehicle.description,
      image_url: vehicle.image_url,
      created_at: vehicle.created_at,
      updated_at: vehicle.updated_at,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Purchase vehicle (atomic)
// @route   POST /api/vehicles/:id/purchase
// @access  Private
export const purchaseVehicle = async (req, res) => {
  try {
    const { quantity = 1 } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    if (vehicle.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock — only ${vehicle.quantity} available`,
      });
    }

    // Atomic decrement
    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: -quantity } },
      { new: true }
    );

    res.json({
      success: true,
      message: `Purchase confirmed for ${quantity} unit(s) of ${updated.make} ${updated.model}`,
      data: {
        vehicle_id: updated._id,
        make: updated.make,
        model: updated.model,
        quantity_purchased: quantity,
        quantity_remaining: updated.quantity,
        price_per_unit: updated.price,
        total_price: updated.price * quantity
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get vehicles by category
// @route   GET /api/vehicles/category/:category
// @access  Private
export const getVehiclesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const vehicles = await Vehicle.find({ category }).sort({ created_at: -1 });
    res.json({
      category,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory summary/stats
// @route   GET /api/vehicles/stats/summary
// @access  Private/Admin
export const getInventoryStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const totalUnits = await Vehicle.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const totalValue = await Vehicle.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$quantity'] } } } }
    ]);
    const outOfStock = await Vehicle.countDocuments({ quantity: 0 });
    const lowStock = await Vehicle.countDocuments({ quantity: { $gt: 0, $lte: 3 } });
    const categories = await Vehicle.distinct('category');
    const categoryCounts = await Vehicle.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, units: { $sum: '$quantity' } } }
    ]);

    res.json({
      total_models: totalVehicles,
      total_units: totalUnits[0]?.total || 0,
      total_value: totalValue[0]?.total || 0,
      out_of_stock: outOfStock,
      low_stock: lowStock,
      categories: categories.length,
      category_breakdown: categoryCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};