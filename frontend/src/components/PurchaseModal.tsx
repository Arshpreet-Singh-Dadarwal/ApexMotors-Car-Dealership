import { Modal } from './Modal';
import { Loader2, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { Vehicle } from '@/types';

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onConfirm: () => Promise<void>;
  submitting?: boolean;
}

export function PurchaseModal({
  open,
  onClose,
  vehicle,
  onConfirm,
  submitting,
}: PurchaseModalProps) {
  if (!vehicle) return null;

  const handleConfirm = async () => {
    if (!vehicle || !vehicle.id) {
      console.error('Cannot purchase: Vehicle or vehicle ID is missing');
      return;
    }
    await onConfirm();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm Purchase"
      description="Review the details before completing the sale"
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost" disabled={submitting}>
            Cancel
          </button>
          <button onClick={handleConfirm} className="btn-primary" disabled={submitting}>
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ShoppingBag size={16} />
            )}
            Confirm Purchase
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-steel-500/20 bg-steel-500/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
            Vehicle
          </p>
          <p className="mt-1 font-display text-lg font-bold text-white">
            {vehicle.make} {vehicle.model}
          </p>
          <p className="text-sm text-slate-400">
            {vehicle.category}
            {vehicle.year ? ` · ${vehicle.year}` : ''}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-900/50 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Price
            </p>
            <p className="font-display text-2xl font-bold text-metallic">
              {formatCurrency(Number(vehicle.price))}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              After Purchase
            </p>
            <p className="font-display text-lg font-bold text-white">
              {Math.max(0, vehicle.quantity - 1)} left
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}