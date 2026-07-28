import { useEffect, type ReactNode } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = 'default',
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const accent =
    variant === 'danger'
      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      : 'text-steel-400 bg-steel-500/10 border-steel-500/20';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`animate-scale-in relative w-full ${SIZES[size]} glass-strong rounded-2xl shadow-2xl`}
      >
        <div className="flex items-start justify-between border-b border-white/5 p-6">
          <div className="flex items-start gap-3">
            {variant === 'danger' && (
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${accent}`}
              >
                <AlertTriangle size={18} />
              </span>
            )}
            <div>
              <h2 className="font-display text-lg font-bold text-white">{title}</h2>
              {description && (
                <p className="mt-1 text-sm text-slate-400">{description}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-white/5 p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
