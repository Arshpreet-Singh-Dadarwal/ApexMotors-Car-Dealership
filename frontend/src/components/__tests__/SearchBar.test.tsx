import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  const mockFilters = {
    search: '',
    category: null,
    minPrice: null,
    maxPrice: null,
  };

  const mockCategories = ['Sedan', 'SUV', 'Sports'];

  it('should render search input', () => {
    render(
      <SearchBar
        filters={mockFilters}
        onChange={() => {}}
        categories={mockCategories}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search by make or model…');
    expect(searchInput).toBeInTheDocument();
  });

  it('should update search query on input change', () => {
    const onChange = vi.fn();
    render(
      <SearchBar
        filters={mockFilters}
        onChange={onChange}
        categories={mockCategories}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search by make or model…');
    fireEvent.change(searchInput, { target: { value: 'BMW' } });

    expect(onChange).toHaveBeenCalledWith({ ...mockFilters, search: 'BMW' });
  });

  it('should render category dropdown', () => {
    render(
      <SearchBar
        filters={mockFilters}
        onChange={() => {}}
        categories={mockCategories}
      />
    );

    const categorySelect = screen.getByRole('combobox');
    expect(categorySelect).toBeInTheDocument();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('SUV')).toBeInTheDocument();
  });
});