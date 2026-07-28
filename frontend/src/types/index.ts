export type UserRole = 'admin' | 'user';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export type VehicleCategory =
  | 'Sedan'
  | 'SUV'
  | 'Sports'
  | 'Electric'
  | 'Luxury'
  | 'Truck';

export interface Vehicle {
  id: string;  // Make sure this is always a string
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  year: number | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  year?: number | null;
  description?: string | null;
  image_url?: string | null;
}

export interface PurchaseResult {
  success: boolean;
  message: string;
  data: {
    vehicle_id: string;
    make: string;
    model: string;
    quantity_remaining: number;
  } | null;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface SearchFilters {
  search: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}