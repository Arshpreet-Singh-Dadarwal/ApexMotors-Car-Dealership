import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VehicleCard } from '../VehicleCard';
import type { Vehicle } from '@/types';

const mockVehicle: Vehicle = {
  id: '1',
  make: 'BMW',
  model: 'M5 Competition',
  category: 'Sedan',
  price: 125000,
  quantity: 3,
  year: 2024,
  description: 'Test description',
  image_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe('VehicleCard', () => {
  it('should render vehicle details correctly', () => {
    render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);

    expect(screen.getByText('BMW')).toBeInTheDocument();
    expect(screen.getByText('M5 Competition')).toBeInTheDocument();
    expect(screen.getByText('$125,000')).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('should show "3 In Stock" badge when quantity > 3', () => {
    render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);
    expect(screen.getByText('3 In Stock')).toBeInTheDocument();
  });

  it('should show "Out of Stock" when quantity is 0', () => {
    const outOfStockVehicle = { ...mockVehicle, quantity: 0 };
    render(<VehicleCard vehicle={outOfStockVehicle} onPurchase={() => {}} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Purchase/ })).toBeDisabled();
  });

  it('should show "X Left" when quantity is 1-3', () => {
    const lowStockVehicle = { ...mockVehicle, quantity: 2 };
    render(<VehicleCard vehicle={lowStockVehicle} onPurchase={() => {}} />);
    expect(screen.getByText('2 Left')).toBeInTheDocument();
  });

  it('should call onPurchase when purchase button is clicked', () => {
    const onPurchase = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onPurchase={onPurchase} />);

    const purchaseButton = screen.getByRole('button', { name: /Purchase/ });
    fireEvent.click(purchaseButton);

    expect(onPurchase).toHaveBeenCalledWith(mockVehicle);
  });

  it('should not call onPurchase when button is disabled', () => {
    const onPurchase = vi.fn();
    const outOfStockVehicle = { ...mockVehicle, quantity: 0 };
    render(<VehicleCard vehicle={outOfStockVehicle} onPurchase={onPurchase} />);

    const purchaseButton = screen.getByRole('button', { name: /Purchase/ });
    expect(purchaseButton).toBeDisabled();
    fireEvent.click(purchaseButton);
    expect(onPurchase).not.toHaveBeenCalled();
  });
});