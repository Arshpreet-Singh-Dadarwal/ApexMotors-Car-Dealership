import { useState } from 'react';
import { Modal } from './Modal';
import { PackagePlus, Loader2 } from 'lucide-react';
import type { Vehicle } from '@/types';

interface RestockModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onConfirm: (amount: number) => Promise<void>;
  submitting?: boolean;
}

export function RestockModal({
  open,
  onClose,
  vehicle,
  onConfirm,
  submitting,
}: RestockModalProps) {
  const [amount, setAmount] = useState(10);

  if (!vehicle) return null;

  const newTotal = vehicle.quantity + amount;

  const handleConfirm = async () => {
    if (!vehicle || !vehicle.id) {
      console.error('Cannot restock: Vehicle or vehicle ID is missing');
      return;
    }
    await onConfirm(amount);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Restock Vehicle"
      description={`${vehicle.make} ${vehicle.model} — currently ${vehicle.quantity} in stock`}
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost" disabled={submitting}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="btn-primary"
            disabled={submitting || amount < 1}
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <PackagePlus size={16} />
            )}
            Add {amount} Units
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-steel-500/20 bg-steel-500/5 p-4">
          <PackagePlus size={20} className="text-steel-400" />
          <div>
            <p className="text-sm font-semibold text-white">Current Stock</p>
            <p className="text-xs text-slate-400">
              {vehicle.quantity} units on the lot
            </p>
          </div>
        </div>

        <div>
          <label className="form-label">Units to Add</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAmount((a) => Math.max(1, a - 1))}
              className="btn-ghost h-11 w-11 px-0 text-lg"
              disabled={submitting}
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
              className="form-input text-center text-lg font-bold"
            />
            <button
              type="button"
              onClick={() => setAmount((a) => a + 1)}
              className="btn-ghost h-11 w-11 px-0 text-lg"
              disabled={submitting}
            >
              +
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            {[5, 10, 25, 50].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAmount(n)}
                className={`chip ${amount === n ? 'chip-active' : 'chip-inactive'}`}
                disabled={submitting}
              >
                +{n}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-ink-900/50 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            New Total
          </p>
          <p className="font-display text-3xl font-bold text-metallic">{newTotal}</p>
        </div>
      </div>
    </Modal>
  );
}