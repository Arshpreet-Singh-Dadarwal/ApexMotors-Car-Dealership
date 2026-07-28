import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  PackagePlus,
  Search,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { Navbar } from '@/layouts/Navbar';
import { StatsGrid, CategoryBreakdown, TopValueModels } from '@/components/Analytics';
import {
  StatCardSkeleton,
  TableSkeleton,
} from '@/components/Skeletons';
import { VehicleFormModal } from '@/components/VehicleFormModal';
import { RestockModal } from '@/components/RestockModal';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { StockBadge } from '@/components/StockBadge';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  restockVehicle,
} from '@/api/vehicles';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';
import type { Vehicle } from '@/types';
import type { VehicleFormValues } from '@/lib/validation';

export function AdminDashboardPage() {
  const { notify } = useToast();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [restockTarget, setRestockTarget] = useState<Vehicle | null>(null);
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockSubmitting, setRestockSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      `${v.make} ${v.model} ${v.category}`.toLowerCase().includes(q)
    );
  }, [vehicles, search]);

  // ── handlers ──────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  
  const openEdit = (v: Vehicle) => {
    setEditing(v);
    setFormOpen(true);
  };

  const onFormSubmit = async (values: VehicleFormValues) => {
    setFormSubmitting(true);
    try {
      const payload = {
        make: values.make,
        model: values.model,
        category: values.category,
        price: Number(values.price),
        quantity: Number(values.quantity),
        year: values.year ?? null,
        description: values.description ?? null,
        image_url: values.image_url ?? null,
      };
      
      let updatedVehicle: Vehicle;
      if (editing) {
        updatedVehicle = await updateVehicle(editing.id, payload);
        notify('success', `${updatedVehicle.make} ${updatedVehicle.model} updated`);
        setVehicles((prev) => prev.map((v) => v.id === updatedVehicle.id ? updatedVehicle : v));
      } else {
        updatedVehicle = await createVehicle(payload);
        notify('success', 'Vehicle added to inventory');
        setVehicles((prev) => [updatedVehicle, ...prev]);
      }
      
      setFormOpen(false);
    } catch (err) {
      notify('error', (err as Error).message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const onRestock = async (amount: number) => {
    if (!restockTarget) {
      notify('error', 'No vehicle selected for restock');
      return;
    }
    
    if (!restockTarget.id) {
      notify('error', 'Invalid vehicle ID');
      setRestockOpen(false);
      setRestockTarget(null);
      return;
    }
    
    setRestockSubmitting(true);
    try {
      const updated = await restockVehicle(restockTarget.id, amount);
      
      notify(
        'success',
        `Restocked ${updated.make} ${updated.model} by ${amount} (now ${updated.quantity} in stock)`
      );
      
      // Update the vehicle in the list immediately
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          if (v.id === updated.id) {
            return {
              ...updated,
              // Ensure we use the updated data from the server
              quantity: updated.quantity,
              updated_at: updated.updated_at,
            };
          }
          return v;
        })
      );
      
      setRestockOpen(false);
      setRestockTarget(null);
    } catch (err) {
      notify('error', (err as Error).message);
    } finally {
      setRestockSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) {
      notify('error', 'No vehicle selected for deletion');
      return;
    }
    
    if (!deleteTarget.id) {
      notify('error', 'Invalid vehicle ID');
      setDeleteOpen(false);
      setDeleteTarget(null);
      return;
    }
    
    setDeleteSubmitting(true);
    try {
      await deleteVehicle(deleteTarget.id);
      notify('success', `${deleteTarget.make} ${deleteTarget.model} deleted`);
      setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      notify('error', (err as Error).message);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />
      <div className="bg-grid relative">
        <div className="bg-radial-glow absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-steel-400">
                <Shield size={13} />
                Admin Console
              </span>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Inventory Control
              </h1>
              <p className="text-sm text-slate-400">
                Welcome back, {user?.full_name ?? 'Admin'} — manage the full lot.
              </p>
            </div>
            <button onClick={openAdd} className="btn-primary">
              <Plus size={16} />
              Add Vehicle
            </button>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <StatsGrid vehicles={vehicles} />
          )}

          {/* Analytics row */}
          {vehicles.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <CategoryBreakdown vehicles={vehicles} />
              <TopValueModels vehicles={vehicles} />
            </div>
          )}

          {/* Table */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">
                Vehicle Registry
              </h2>
              <div className="relative w-full max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search registry…"
                  className="form-input pl-11 py-2.5"
                />
              </div>
            </div>

            {loading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <div className="glass flex flex-col items-center justify-center rounded-2xl py-16 text-center">
                <TrendingUp size={28} className="mb-3 text-slate-500" />
                <p className="font-display text-lg font-bold text-white">
                  No vehicles found
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Add your first vehicle to get started.
                </p>
                <button onClick={openAdd} className="btn-primary mt-4">
                  <Plus size={16} />
                  Add Vehicle
                </button>
              </div>
            ) : (
              <div className="glass overflow-hidden rounded-2xl">
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Vehicle</th>
                        <th className="px-5 py-4 font-semibold">Category</th>
                        <th className="px-5 py-4 font-semibold">Price</th>
                        <th className="px-5 py-4 font-semibold">Stock</th>
                        <th className="px-5 py-4 font-semibold">Updated</th>
                        <th className="px-5 py-4 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filtered.map((v) => (
                        <tr
                          key={v.id}
                          className="transition hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-white">
                              {v.make} {v.model}
                            </div>
                            <div className="text-xs text-slate-500">
                              {v.year ? `${v.year} · ` : ''}
                              {formatDate(v.created_at)}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="chip chip-inactive">{v.category}</span>
                          </td>
                          <td className="px-5 py-4 font-semibold text-white">
                            {formatCurrency(Number(v.price))}
                          </td>
                          <td className="px-5 py-4">
                            <StockBadge quantity={v.quantity} />
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-500">
                            {formatDate(v.updated_at)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEdit(v)}
                                className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-steel-400/40 hover:text-steel-300"
                                aria-label="Edit vehicle"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => {
                                  setRestockTarget(v);
                                  setRestockOpen(true);
                                }}
                                className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
                                aria-label="Restock vehicle"
                                title="Restock"
                              >
                                <PackagePlus size={15} />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget(v);
                                  setDeleteOpen(true);
                                }}
                                className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-rose-400/40 hover:text-rose-300"
                                aria-label="Delete vehicle"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-white/5 md:hidden">
                  {filtered.map((v) => (
                    <div key={v.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-white">
                            {v.make} {v.model}
                          </p>
                          <p className="text-xs text-slate-500">
                            {v.category}
                            {v.year ? ` · ${v.year}` : ''}
                          </p>
                        </div>
                        <StockBadge quantity={v.quantity} />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-display text-lg font-bold text-metallic">
                          {formatCurrency(Number(v.price))}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openEdit(v)}
                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setRestockTarget(v);
                              setRestockOpen(true);
                            }}
                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300"
                            aria-label="Restock"
                          >
                            <PackagePlus size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget(v);
                              setDeleteOpen(true);
                            }}
                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-rose-300"
                            aria-label="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary footer */}
          {!loading && vehicles.length > 0 && (
            <p className="mt-4 text-center text-xs text-slate-500">
              Showing {formatNumber(filtered.length)} of{' '}
              {formatNumber(vehicles.length)} vehicles
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      <VehicleFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={onFormSubmit}
        initial={editing}
        submitting={formSubmitting}
      />
      <RestockModal
        open={restockOpen}
        onClose={() => setRestockOpen(false)}
        vehicle={restockTarget}
        onConfirm={onRestock}
        submitting={restockSubmitting}
      />
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        vehicle={deleteTarget}
        onConfirm={onDelete}
        submitting={deleteSubmitting}
      />
    </div>
  );
}