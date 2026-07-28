import { Search, X, SlidersHorizontal } from 'lucide-react';
import type { SearchFilters } from '@/types';

interface SearchBarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  categories: string[];
}

export function SearchBar({ filters, onChange, categories }: SearchBarProps) {
  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.minPrice !== null ? 1 : 0) +
    (filters.maxPrice !== null ? 1 : 0);

  const clearAll = () =>
    onChange({ search: '', category: null, minPrice: null, maxPrice: null });

  return (
    <div className="glass sticky top-4 z-30 rounded-2xl p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by make or model…"
            className="form-input pl-11"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-white"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="shrink-0 text-slate-500" />
          <select
            value={filters.category ?? ''}
            onChange={(e) =>
              onChange({
                ...filters,
                category: e.target.value || null,
              })
            }
            className="form-input min-w-[140px] cursor-pointer py-2.5"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Price inputs */}
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  minPrice: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="Min $"
              className="form-input w-24 py-2.5"
            />
            <span className="text-slate-500">—</span>
            <input
              type="number"
              min={0}
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="Max $"
              className="form-input w-24 py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/5 pt-3">
          <span className="text-xs font-semibold text-slate-500">
            Active filters:
          </span>
          {filters.category && (
            <span className="chip chip-active">
              {filters.category}
              <button
                onClick={() => onChange({ ...filters, category: null })}
                aria-label="Remove category filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.minPrice !== null && (
            <span className="chip chip-active">
              Min {formatChipPrice(filters.minPrice)}
              <button
                onClick={() => onChange({ ...filters, minPrice: null })}
                aria-label="Remove min price filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.maxPrice !== null && (
            <span className="chip chip-active">
              Max {formatChipPrice(filters.maxPrice)}
              <button
                onClick={() => onChange({ ...filters, maxPrice: null })}
                aria-label="Remove max price filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={clearAll}
            className="ml-1 text-xs font-semibold text-rose-400 transition hover:text-rose-300"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function formatChipPrice(value: number): string {
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return `$${value}`;
}
