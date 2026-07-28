import {
  Car,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Layers,
} from 'lucide-react';
import type { Vehicle } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/format';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  accent: string;
  sublabel?: string;
}

function StatCard({ label, value, icon: Icon, accent, sublabel }: StatCardProps) {
  return (
    <div className="glass animate-fade-in-up rounded-2xl p-5 transition-all duration-300 hover:border-white/15">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {label}
          </p>
          <p className="font-display text-2xl font-bold text-white">{value}</p>
          {sublabel && (
            <p className="text-xs text-slate-500">{sublabel}</p>
          )}
        </div>
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accent}`}
        >
          <Icon size={22} />
        </span>
      </div>
    </div>
  );
}

export function StatsGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const totalUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const totalValue = vehicles.reduce(
    (sum, v) => sum + Number(v.price) * v.quantity,
    0
  );
  const outOfStock = vehicles.filter((v) => v.quantity === 0).length;
  const lowStock = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3).length;
  const distinctMakes = new Set(vehicles.map((v) => v.make)).size;

  // Define stat cards as an array with unique keys
  const statCards = [
    {
      key: 'models',
      label: 'Models',
      value: formatNumber(vehicles.length),
      icon: Car,
      accent: 'border-steel-500/30 bg-steel-500/10 text-steel-400',
      sublabel: `${distinctMakes} makes`
    },
    {
      key: 'units',
      label: 'Total Units',
      value: formatNumber(totalUnits),
      icon: Package,
      accent: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      sublabel: 'Across all models'
    },
    {
      key: 'value',
      label: 'Inventory Value',
      value: formatCurrency(totalValue),
      icon: DollarSign,
      accent: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      sublabel: 'At list price'
    },
    {
      key: 'outofstock',
      label: 'Out of Stock',
      value: formatNumber(outOfStock),
      icon: AlertTriangle,
      accent: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      sublabel: outOfStock === 0 ? 'All stocked' : 'Needs attention'
    },
    {
      key: 'lowstock',
      label: 'Low Stock',
      value: formatNumber(lowStock),
      icon: TrendingUp,
      accent: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
      sublabel: '3 or fewer left'
    },
    {
      key: 'categories',
      label: 'Categories',
      value: formatNumber(new Set(vehicles.map((v) => v.category)).size),
      icon: Layers,
      accent: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
      sublabel: 'Vehicle types'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={card.value}
          icon={card.icon}
          accent={card.accent}
          sublabel={card.sublabel}
        />
      ))}
    </div>
  );
}

interface CategoryBar {
  category: string;
  count: number;
  units: number;
  pct: number;
}

export function CategoryBreakdown({ vehicles }: { vehicles: Vehicle[] }) {
  const byCategory = new Map<string, { count: number; units: number }>();
  for (const v of vehicles) {
    const entry = byCategory.get(v.category) ?? { count: 0, units: 0 };
    entry.count += 1;
    entry.units += v.quantity;
    byCategory.set(v.category, entry);
  }
  const maxCount = Math.max(1, ...Array.from(byCategory.values()).map((v) => v.count));
  const rows: CategoryBar[] = Array.from(byCategory.entries())
    .map(([category, { count, units }]) => ({
      category,
      count,
      units,
      pct: Math.round((count / maxCount) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Inventory by Category
          </h3>
          <p className="text-xs text-slate-500">Model distribution across the lot</p>
        </div>
      </div>
      <div className="space-y-3.5">
        {rows.map((row) => (
          <div key={row.category}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-200">{row.category}</span>
              <span className="text-slate-500">
                {row.count} models · {formatNumber(row.units)} units
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-steel-600 to-steel-400 transition-all duration-700"
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-slate-500">No vehicles to analyze.</p>
        )}
      </div>
    </div>
  );
}

export function TopValueModels({ vehicles }: { vehicles: Vehicle[] }) {
  const top = [...vehicles]
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 5);

  if (top.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="mb-5">
          <h3 className="font-display text-base font-bold text-white">
            Highest-Value Models
          </h3>
          <p className="text-xs text-slate-500">Top 5 by list price</p>
        </div>
        <p className="text-sm text-slate-500">No vehicles yet.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="font-display text-base font-bold text-white">
          Highest-Value Models
        </h3>
        <p className="text-xs text-slate-500">Top 5 by list price</p>
      </div>
      <div className="space-y-3">
        {top.map((v, i) => (
          <div key={v.id} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-800 font-display text-sm font-bold text-steel-400">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {v.make} {v.model}
              </p>
              <p className="text-xs text-slate-500">{v.category}</p>
            </div>
            <span className="font-display text-sm font-bold text-metallic">
              {formatCurrency(Number(v.price))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}