import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    category: {
      type: String,
      required: true,
      enum: ['Sedan', 'SUV', 'Sports', 'Electric', 'Luxury', 'Truck'],
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    year: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    image_url: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Indexes for performance
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ make: 1 });
vehicleSchema.index({ price: 1 });

// Remove __v when converting to JSON
vehicleSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;