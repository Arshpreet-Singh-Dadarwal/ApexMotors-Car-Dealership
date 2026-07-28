import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car, Mail, Lock, User, Loader2, ArrowRight, Shield, UserCircle } from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { UserRole } from '@/types';

export function RegisterPage() {
  const { signUp, user, loading } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState<UserRole>('user');

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
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'user' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true);
    const { error } = await signUp(
      values.email,
      values.password,
      values.fullName,
      values.role
    );
    setSubmitting(false);
    
    if (error) {
      notify('error', error);
      return;
    }
    
    notify('success', 'Account created — welcome to Apex Motors');
    // Navigation will happen via useEffect
  };

  const selectRole = (r: UserRole) => {
    setRole(r);
    setValue('role', r, { shouldValidate: true });
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <Loader2 size={32} className="animate-spin text-steel-500" />
      </div>
    );
  }

  // If already logged in, don't render the register form (useEffect will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-8">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="bg-radial-glow absolute inset-0" />

      <div className="animate-fade-in-up relative w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-steel-400 to-steel-700 shadow-lg shadow-steel-900/50">
              <Car size={26} className="text-white" />
            </span>
            <h1 className="font-display text-2xl font-bold text-white">
              Create Account
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Join the Apex Motors platform
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => selectRole('user')}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                role === 'user'
                  ? 'border-steel-400/60 bg-steel-500/15 text-white'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <UserCircle size={24} />
              <span className="text-sm font-semibold">Customer</span>
              <span className="text-[10px] text-slate-500">Browse & buy</span>
            </button>
            <button
              type="button"
              onClick={() => selectRole('admin')}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                role === 'admin'
                  ? 'border-steel-400/60 bg-steel-500/15 text-white'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <Shield size={24} />
              <span className="text-sm font-semibold">Admin</span>
              <span className="text-[10px] text-slate-500">Manage inventory</span>
            </button>
          </div>

          <input type="hidden" {...register('role')} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <User
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  {...register('fullName')}
                  className="form-input pl-11"
                  placeholder="Jane Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-rose-400">{errors.fullName.message}</p>
              )}
            </div>

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
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
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
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-steel-400 transition hover:text-steel-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}