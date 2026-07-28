import { memo, useState } from 'react';
import { ShoppingCart, Calendar, Tag, Gauge } from 'lucide-react';
import type { Vehicle } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/format';
import { imageForVehicle, fallbackImage } from '@/lib/vehicleImages';
import { StockBadge } from './StockBadge';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (vehicle: Vehicle) => void;
  purchasingId?: string | null;
}

function VehicleCardBase({ vehicle, onPurchase, purchasingId }: VehicleCardProps) {
  const [imgSrc, setImgSrc] = useState(
    imageForVehicle(vehicle.category, vehicle.make, vehicle.model, vehicle.image_url)
  );
  const outOfStock = vehicle.quantity === 0;
  const isPurchasing = purchasingId === vehicle.id;

  const handlePurchase = () => {
    if (vehicle && vehicle.id) {
      onPurchase(vehicle);
    } else {
      console.error('Cannot purchase: Vehicle or vehicle ID is missing');
    }
  };

  return (
    <article className="group glass animate-fade-in-up overflow-hidden rounded-2xl transition-all duration-300 hover:border-white/15 hover:shadow-2xl hover:shadow-black/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
        <img
          src={imgSrc}
          alt={`${vehicle.make} ${vehicle.model}`}
          loading="lazy"
          onError={() => setImgSrc(fallbackImage())}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
        <div className="absolute left-4 top-4">
          <span className="chip chip-active backdrop-blur-md">
            <Tag size={12} />
            {vehicle.category}
          </span>
        </div>
        <div className="absolute right-4 top-4">
          <StockBadge quantity={vehicle.quantity} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
            {vehicle.make}
          </p>
          <h3 className="mt-0.5 font-display text-xl font-bold text-white">
            {vehicle.model}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
          {vehicle.year && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} />
              {vehicle.year}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Gauge size={13} />
            {formatNumber(vehicle.quantity)} units
          </span>
        </div>

        {vehicle.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">
            {vehicle.description}
          </p>
        )}

        <div className="flex items-end justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Price
            </p>
            <p className="font-display text-2xl font-bold text-metallic">
              {formatCurrency(Number(vehicle.price))}
            </p>
          </div>
          <button
            onClick={handlePurchase}
            disabled={outOfStock || isPurchasing || !vehicle.id}
            className="btn-primary"
            aria-label={`Purchase ${vehicle.make} ${vehicle.model}`}
          >
            <ShoppingCart size={16} />
            {outOfStock ? 'Sold Out' : isPurchasing ? 'Processing' : 'Purchase'}
          </button>
        </div>
      </div>
    </article>
  );
}

export const VehicleCard = memo(VehicleCardBase);