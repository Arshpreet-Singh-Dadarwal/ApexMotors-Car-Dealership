import { Modal } from './Modal';
import { Loader2 } from 'lucide-react';
import type { Vehicle } from '@/types';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onConfirm: () => Promise<void>;
  submitting?: boolean;
}

export function ConfirmDeleteModal({
  open,
  onClose,
  vehicle,
  onConfirm,
  submitting,
}: ConfirmDeleteModalProps) {
  if (!vehicle) return null;

  const handleConfirm = async () => {
    // Check if vehicle has an ID
    if (!vehicle || !vehicle.id) {
      console.error('Cannot delete: Vehicle or vehicle ID is missing', vehicle);
      // You might want to show a toast notification here
      onClose();
      return;
    }
    
    try {
      await onConfirm();
    } catch (error) {
      console.error('Delete failed:', error);
      // Error will be handled by the parent component
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Vehicle"
      description="This action cannot be undone."
      variant="danger"
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost" disabled={submitting}>
            Cancel
          </button>
          <button onClick={handleConfirm} className="btn-danger" disabled={submitting}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Delete Permanently
          </button>
        </>
      }
    >
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
        <p className="text-sm text-slate-300">
          You are about to permanently remove{' '}
          <span className="font-bold text-white">
            {vehicle.make} {vehicle.model}
          </span>{' '}
          ({vehicle.category}) from the inventory. This cannot be recovered.
        </p>
        {!vehicle.id && (
          <p className="mt-2 text-xs text-rose-400">
            Warning: This vehicle has no valid ID. Please refresh and try again.
          </p>
        )}
      </div>
    </Modal>
  );
}