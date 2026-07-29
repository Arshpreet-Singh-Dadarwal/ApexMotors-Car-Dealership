import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { formatNumber } from '@/lib/format';

interface StockBadgeProps {
  quantity: number;
}

export function StockBadge({ quantity }: StockBadgeProps) {
  if (quantity === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-300">
        <XCircle size={13} />
        Out of Stock
      </span>
    );
  }
  if (quantity <= 3) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300">
        <AlertTriangle size={13} />
        {formatNumber(quantity)} Left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
      <CheckCircle2 size={13} />
      {formatNumber(quantity)} In Stock
    </span>
  );
}