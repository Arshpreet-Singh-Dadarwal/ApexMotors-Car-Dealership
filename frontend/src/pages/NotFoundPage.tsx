import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function NotFoundPage() {
  const { session } = useAuth();
  const home = session ? '/dashboard' : '/login';

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-950 px-4 text-center">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="bg-radial-glow absolute inset-0" />

      <div className="animate-fade-in-up relative">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Compass size={28} className="text-steel-400" />
        </span>
        <p className="font-display text-7xl font-bold text-metallic">404</p>
        <h1 className="mt-2 font-display text-xl font-bold text-white">
          Page not found
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          The page you're looking for has been moved, sold, or never existed in the
          first place.
        </p>
        <Link to={home} className="btn-primary mt-6">
          <ArrowLeft size={16} />
          Back to safety
        </Link>
      </div>
    </div>
  );
}
