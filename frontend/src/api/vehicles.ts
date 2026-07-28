import type { PurchaseResult, Vehicle, VehicleInput } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Helper to transform MongoDB _id to id
const transformVehicle = (data: any): Vehicle => {
  return {
    id: data._id || data.id,
    make: data.make,
    model: data.model,
    category: data.category,
    price: data.price,
    quantity: data.quantity,
    year: data.year || null,
    description: data.description || null,
    image_url: data.image_url || null,
    created_at: data.created_at || data.createdAt,
    updated_at: data.updated_at || data.updatedAt,
  };
};

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const response = await fetch(`${API_URL}/vehicles`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<any[]>(response);
    return data.map(transformVehicle);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}

export async function fetchVehicle(id: string): Promise<Vehicle> {
  if (!id) {
    throw new Error('Vehicle ID is required');
  }
  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<any>(response);
    return transformVehicle(data);
  } catch (error) {
    console.error(`Error fetching vehicle ${id}:`, error);
    throw error;
  }
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  try {
    const response = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(input),
    });
    const data = await handleResponse<any>(response);
    return transformVehicle(data);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
}

export async function updateVehicle(
  id: string,
  input: Partial<VehicleInput>
): Promise<Vehicle> {
  if (!id) {
    throw new Error('Vehicle ID is required');
  }
  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(input),
    });
    const data = await handleResponse<any>(response);
    return transformVehicle(data);
  } catch (error) {
    console.error(`Error updating vehicle ${id}:`, error);
    throw error;
  }
}

export async function deleteVehicle(id: string): Promise<void> {
  if (!id) {
    throw new Error('Vehicle ID is required');
  }
  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting vehicle ${id}:`, error);
    throw error;
  }
}

export async function restockVehicle(id: string, amount: number): Promise<Vehicle> {
  if (!id) {
    throw new Error('Vehicle ID is required');
  }
  try {
    const response = await fetch(`${API_URL}/vehicles/${id}/restock`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount }),
    });
    const data = await handleResponse<any>(response);
    return transformVehicle(data);
  } catch (error) {
    console.error(`Error restocking vehicle ${id}:`, error);
    throw error;
  }
}

export async function purchaseVehicle(
  id: string,
  quantity = 1
): Promise<PurchaseResult> {
  if (!id) {
    throw new Error('Vehicle ID is required');
  }
  try {
    const response = await fetch(`${API_URL}/vehicles/${id}/purchase`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse<PurchaseResult>(response);
  } catch (error) {
    console.error(`Error purchasing vehicle ${id}:`, error);
    throw error;
  }
}