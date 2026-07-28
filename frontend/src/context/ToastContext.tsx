import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import type { Toast } from '@/types';

interface ToastContextValue {
  toasts: Toast[];
  notify: (type: Toast['type'], message: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  error: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  info: 'border-steel-500/30 bg-steel-500/10 text-steel-300',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (type: Toast['type'], message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, notify, dismiss }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          return (
            <div
              key={toast.id}
              className={`animate-slide-in-right pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-2xl backdrop-blur-xl ${STYLES[toast.type]}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-sm font-medium leading-snug text-white">
                {toast.message}
              </p>
              <button
                onClick={() => dismiss(toast.id)}
                className="shrink-0 rounded-md p-0.5 text-white/50 transition hover:text-white"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
