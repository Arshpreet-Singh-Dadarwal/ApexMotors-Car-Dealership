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

  describe('Stock Badge', () => {
    it('should show "Left" badge when quantity is 1-3', () => {
      const lowStockVehicle = { ...mockVehicle, quantity: 2 };
      render(<VehicleCard vehicle={lowStockVehicle} onPurchase={() => {}} />);
      
      // Using a function matcher for flexibility
      const badge = screen.getByText((content) => {
        return content.includes('2') && content.includes('Left');
      });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('text-amber-300');
    });

    it('should show "In Stock" badge when quantity > 3', () => {
      const inStockVehicle = { ...mockVehicle, quantity: 5 };
      render(<VehicleCard vehicle={inStockVehicle} onPurchase={() => {}} />);
      
      const badge = screen.getByText((content) => {
        return content.includes('5') && content.includes('In Stock');
      });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('text-emerald-300');
    });

    it('should show "Out of Stock" badge when quantity is 0', () => {
      const outOfStockVehicle = { ...mockVehicle, quantity: 0 };
      render(<VehicleCard vehicle={outOfStockVehicle} onPurchase={() => {}} />);
      
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
      expect(screen.getByText('Out of Stock')).toHaveClass('text-rose-300');
    });
  });

  describe('Purchase Button', () => {
    it('should be enabled when quantity > 0', () => {
      render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);
      const purchaseButton = screen.getByRole('button', { name: /Purchase/ });
      expect(purchaseButton).not.toBeDisabled();
    });

    it('should be disabled when quantity is 0', () => {
      const outOfStockVehicle = { ...mockVehicle, quantity: 0 };
      render(<VehicleCard vehicle={outOfStockVehicle} onPurchase={() => {}} />);
      
      const purchaseButton = screen.getByRole('button', { name: /Purchase/ });
      expect(purchaseButton).toBeDisabled();
      expect(purchaseButton).toHaveTextContent('Sold Out');
    });

    it('should call onPurchase when clicked', () => {
      const onPurchase = vi.fn();
      render(<VehicleCard vehicle={mockVehicle} onPurchase={onPurchase} />);

      const purchaseButton = screen.getByRole('button', { name: /Purchase/ });
      fireEvent.click(purchaseButton);

      expect(onPurchase).toHaveBeenCalledTimes(1);
      expect(onPurchase).toHaveBeenCalledWith(mockVehicle);
    });
  });

  describe('Vehicle Info', () => {
    it('should display the correct make and model', () => {
      render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);
      
      expect(screen.getByText('BMW')).toBeInTheDocument();
      expect(screen.getByText('M5 Competition')).toBeInTheDocument();
    });

    it('should display the category', () => {
      render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);
      expect(screen.getByText('Sedan')).toBeInTheDocument();
    });

    it('should display the year if available', () => {
      render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('should display the description', () => {
      render(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} />);
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });
});