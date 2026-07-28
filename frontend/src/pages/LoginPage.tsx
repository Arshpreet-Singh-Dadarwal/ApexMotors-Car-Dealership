import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { authSchema, type AuthFormValues } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in - but wait for loading to complete
  useEffect(() => {
    if (!loading && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({ resolver: zodResolver(authSchema) });

  const onSubmit = async (values: AuthFormValues) => {
    setSubmitting(true);
    const { error } = await signIn(values.email, values.password);
    setSubmitting(false);
    
    if (error) {
      notify('error', error);
      return;
    }
    
    notify('success', 'Welcome back!');
    // Navigation will happen via useEffect
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <Loader2 size={32} className="animate-spin text-steel-500" />
      </div>
    );
  }

  // If already logged in, don't render the login form (useEffect will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="bg-radial-glow absolute inset-0" />

      <div className="animate-fade-in-up relative w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-steel-400 to-steel-700 shadow-lg shadow-steel-900/50">
              <Car size={26} className="text-white" />
            </span>
            <h1 className="font-display text-2xl font-bold text-white">
              Apex<span className="text-metallic">Motors</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Sign in to your dealership account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  {...register('email')}
                  className="form-input pl-11"
                  placeholder="you@apexmotors.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="password"
                  {...register('password')}
                  className="form-input pl-11"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            No account?{' '}
            <Link
              to="/register"
              className="font-semibold text-steel-400 transition hover:text-steel-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}