import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Modal } from './Modal';
import { vehicleSchema, type VehicleFormValues } from '@/lib/validation';
import type { Vehicle } from '@/types';

const CATEGORIES = ['Sedan', 'SUV', 'Sports', 'Electric', 'Luxury', 'Truck'];

interface VehicleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  initial?: Vehicle | null;
  submitting?: boolean;
}

export function VehicleFormModal({
  open,
  onClose,
  onSubmit,
  initial,
  submitting,
}: VehicleFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema) as Resolver<VehicleFormValues>,
    defaultValues: {
      make: '',
      model: '',
      category: 'Sedan',
      price: 0,
      quantity: 0,
      year: null,
      description: null,
      image_url: null,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        make: initial?.make ?? '',
        model: initial?.model ?? '',
        category: initial?.category ?? 'Sedan',
        price: initial ? Number(initial.price) : 0,
        quantity: initial?.quantity ?? 0,
        year: initial?.year ?? null,
        description: initial?.description ?? null,
        image_url: initial?.image_url ?? null,
      });
    }
  }, [open, initial, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Update Vehicle' : 'Add New Vehicle'}
      description={
        initial
          ? `Editing ${initial.make} ${initial.model}`
          : 'Enter the details for the new inventory item'
      }
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost" disabled={submitting}>
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="btn-primary"
            disabled={submitting}
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {initial ? 'Save Changes' : 'Add Vehicle'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Make</label>
            <input
              {...register('make')}
              className="form-input"
              placeholder="e.g. BMW"
            />
            {errors.make && (
              <p className="mt-1 text-xs text-rose-400">{errors.make.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Model</label>
            <input
              {...register('model')}
              className="form-input"
              placeholder="e.g. M5 Competition"
            />
            {errors.model && (
              <p className="mt-1 text-xs text-rose-400">{errors.model.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="form-label">Category</label>
            <select {...register('category')} className="form-input cursor-pointer">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-rose-400">{errors.category.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Price (USD)</label>
            <input
              type="number"
              step="0.01"
              {...register('price')}
              className="form-input"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-rose-400">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Quantity</label>
            <input
              type="number"
              {...register('quantity')}
              className="form-input"
              placeholder="0"
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-rose-400">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Year (optional)</label>
            <input
              type="number"
              {...register('year')}
              className="form-input"
              placeholder="e.g. 2024"
            />
            {errors.year && (
              <p className="mt-1 text-xs text-rose-400">{errors.year.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Image URL (optional)</label>
            <input
              {...register('image_url')}
              className="form-input"
              placeholder="https://…"
            />
            {errors.image_url && (
              <p className="mt-1 text-xs text-rose-400">{errors.image_url.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label">Description (optional)</label>
          <textarea
            {...register('description')}
            rows={3}
            className="form-input resize-none"
            placeholder="Brief description of the vehicle…"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-400">{errors.description.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
