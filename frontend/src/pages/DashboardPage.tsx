import { useEffect, useMemo, useState } from 'react';
import { Car, Inbox } from 'lucide-react';
import { Navbar } from '@/layouts/Navbar';
import { VehicleCard } from '@/components/VehicleCard';
import { SearchBar } from '@/components/SearchBar';
import { DashboardSkeleton } from '@/components/Skeletons';
import { PurchaseModal } from '@/components/PurchaseModal';
import { useToast } from '@/context/ToastContext';
import { fetchVehicles, purchaseVehicle } from '@/api/vehicles';
import type { SearchFilters, Vehicle } from '@/types';

export function DashboardPage() {
  const { notify } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: null,
    minPrice: null,
    maxPrice: null,
  });
  const [purchaseTarget, setPurchaseTarget] = useState<Vehicle | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await fetchVehicles();
      setVehicles(data);
    } catch (err) {
      notify('error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.category))).sort(),
    [vehicles]
  );

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (q && !`${v.make} ${v.model}`.toLowerCase().includes(q)) return false;
      if (filters.category && v.category !== filters.category) return false;
      if (filters.minPrice !== null && Number(v.price) < filters.minPrice) return false;
      if (filters.maxPrice !== null && Number(v.price) > filters.maxPrice) return false;
      return true;
    });
  }, [vehicles, filters]);

  const confirmPurchase = async () => {
    if (!purchaseTarget) return;
    
    setPurchasing(true);
    try {
      const result = await purchaseVehicle(purchaseTarget.id);
      
      if (!result.success) {
        notify('error', result.message);
        setPurchaseTarget(null);
        return;
      }
      
      // Get the new quantity from the result
      const newQuantity = result.data?.quantity_remaining ?? purchaseTarget.quantity - 1;
      
      // Update the vehicle in the list immediately
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          if (v.id === purchaseTarget.id) {
            return {
              ...v,
              quantity: newQuantity,
              updated_at: new Date().toISOString(),
            };
          }
          return v;
        })
      );
      
      notify('success', `Purchased ${purchaseTarget.make} ${purchaseTarget.model}`);
      setPurchaseTarget(null);
    } catch (err) {
      notify('error', (err as Error).message);
      setPurchaseTarget(null);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />
      <div className="bg-grid relative">
        <div className="bg-radial-glow absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-steel-400">
              <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-steel-400" />
              Live Showroom
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Browse the Collection
            </h1>
            <p className="text-sm text-slate-400">
              {loading
                ? 'Loading inventory…'
                : `${filtered.length} of ${vehicles.length} vehicles available`}
            </p>
          </div>

          {/* Search + filters */}
          <SearchBar
            filters={filters}
            onChange={setFilters}
            categories={categories}
          />

          {/* Grid */}
          <div className="mt-8">
            {loading ? (
              <DashboardSkeleton />
            ) : filtered.length === 0 ? (
              <EmptyState
                hasFilters={
                  filters.search !== '' ||
                  filters.category !== null ||
                  filters.minPrice !== null ||
                  filters.maxPrice !== null
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    onPurchase={setPurchaseTarget}
                    purchasingId={purchasing ? purchaseTarget?.id : null}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PurchaseModal
        open={!!purchaseTarget}
        onClose={() => setPurchaseTarget(null)}
        vehicle={purchaseTarget}
        onConfirm={confirmPurchase}
        submitting={purchasing}
      />
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl py-20 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        {hasFilters ? <Inbox size={28} className="text-slate-500" /> : <Car size={28} className="text-slate-500" />}
      </span>
      <h3 className="font-display text-lg font-bold text-white">
        {hasFilters ? 'No matches found' : 'No vehicles yet'}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400">
        {hasFilters
          ? 'Try widening your search or clearing the filters.'
          : 'The showroom is empty. Check back soon.'}
      </p>
    </div>
  );
}