// Curated vehicle images by make and model
const VEHICLE_IMAGES: Record<string, Record<string, string>> = {
  // BMW
  BMW: {
    'M5 Competition': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
    'X5': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop'
  },
  // Mercedes-Benz
  'Mercedes-Benz': {
    'E-Class': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
    'GLE': 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&auto=format&fit=crop',
    'S-Class': 'https://images.unsplash.com/photo-1620549783234-b4f0b1d3a9d6?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'
  },
  // Audi
  Audi: {
    'A6': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop',
    'Q7': 'https://images.unsplash.com/photo-1539794830467-1f1755804d13?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop'
  },
  // Tesla
  Tesla: {
    'Model S': 'https://images.unsplash.com/photo-1617886903357-28f5f3b4b0e8?w=800&auto=format&fit=crop',
    'Model X': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1617886903357-28f5f3b4b0e8?w=800&auto=format&fit=crop'
  },
  // Range Rover
  'Range Rover': {
    'Sport': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop'
  },
  // Porsche
  Porsche: {
    '911 Turbo S': 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop'
  },
  // Ferrari
  Ferrari: {
    '296 GTB': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop'
  },
  // Lamborghini
  Lamborghini: {
    'Huracán': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&auto=format&fit=crop'
  },
  // Chevrolet
  Chevrolet: {
    'Corvette Z06': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop',
    'Silverado ZR2': 'https://images.unsplash.com/photo-1579641471651-9e7930a0fbc7?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop'
  },
  // Rivian
  Rivian: {
    'R1S': 'https://images.unsplash.com/photo-1617886903357-28f5f3b4b0e8?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1617886903357-28f5f3b4b0e8?w=800&auto=format&fit=crop'
  },
  // Lucid
  Lucid: {
    'Air': 'https://images.unsplash.com/photo-1617886903357-28f5f3b4b0e8?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1617886903357-28f5f3b4b0e8?w=800&auto=format&fit=crop'
  },
  // Bentley
  Bentley: {
    'Continental GT': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop'
  },
  // Rolls-Royce
  'Rolls-Royce': {
    'Ghost': 'https://images.unsplash.com/photo-1631292784510-6ce5a6f0cbd5?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1631292784510-6ce5a6f0cbd5?w=800&auto=format&fit=crop'
  },
  // Ford
  Ford: {
    'F-150 Raptor': 'https://images.unsplash.com/photo-1579641471651-9e7930a0fbc7?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1579641471651-9e7930a0fbc7?w=800&auto=format&fit=crop'
  },
  // Ram
  Ram: {
    '1500 TRX': 'https://images.unsplash.com/photo-1579641471651-9e7930a0fbc7?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1579641471651-9e7930a0fbc7?w=800&auto=format&fit=crop'
  },
};

// Fallback images by category (if make/model not found)
const CATEGORY_FALLBACKS: Record<string, string> = {
  Sedan: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
  SUV: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop',
  Sports: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop',
  Electric: 'https://images.unsplash.com/photo-1617886903357-28f5f3b4b0e8?w=800&auto=format&fit=crop',
  Luxury: 'https://images.unsplash.com/photo-1631292784510-6ce5a6f0cbd5?w=800&auto=format&fit=crop',
  Truck: 'https://images.unsplash.com/photo-1579641471651-9e7930a0fbc7?w=800&auto=format&fit=crop',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop';

export function imageForVehicle(
  category: string,
  make: string,
  model: string,
  customUrl?: string | null
): string {
  // Use custom URL if provided
  if (customUrl && customUrl.trim().length > 0) {
    return customUrl;
  }

  // Try to find image by make and model
  const makeImages = VEHICLE_IMAGES[make];
  if (makeImages) {
    // Check for exact model match
    if (makeImages[model]) {
      return makeImages[model];
    }
    // Use default for this make
    if (makeImages.default) {
      return makeImages.default;
    }
  }

  // Fallback to category-based image
  if (CATEGORY_FALLBACKS[category]) {
    return CATEGORY_FALLBACKS[category];
  }

  // Ultimate fallback
  return FALLBACK_IMAGE;
}

export function fallbackImage(): string {
  return FALLBACK_IMAGE;
}