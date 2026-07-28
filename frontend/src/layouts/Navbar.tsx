import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Get user's display name
  const displayName = user?.full_name || user?.email || 'User';
  
  // Get first letter for avatar
  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get short name (first name only)
  const getShortName = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      return names[0]; // Return first name only
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Return email prefix
    }
    return 'User';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-steel-400 to-steel-700 shadow-lg shadow-steel-900/50">
            <Car size={18} className="text-white" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Apex<span className="text-metallic">Motors</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:flex"
            >
              <Shield size={16} />
              Admin
            </Link>
          )}
          <Link
            to="/dashboard"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:flex"
          >
            <LayoutDashboard size={16} />
            Showroom
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:border-white/20"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-steel-500 to-steel-700 text-xs font-bold text-white">
                {getInitials()}
              </span>
              <span className="hidden text-sm font-semibold text-slate-200 sm:block">
                {getShortName()}
              </span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="animate-scale-in absolute right-0 top-12 z-20 w-56 glass-strong rounded-xl p-2 shadow-2xl">
                  <div className="border-b border-white/5 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-white">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email}
                    </p>
                    <span
                      className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isAdmin
                          ? 'bg-steel-500/20 text-steel-300'
                          : 'bg-slate-500/20 text-slate-300'
                      }`}
                    >
                      {isAdmin ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}