import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Profile, UserRole } from '@/types';

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Session expired');
        }
        return res.json();
      })
      .then((data) => {
        setUser({
          id: data._id,
          email: data.email,
          full_name: data.fullName,
          role: data.role,
          created_at: data.createdAt,
        });
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isAdmin: user?.role === 'admin',

    async signIn(email, password) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { error: data.message || 'Login failed' };
        }

        localStorage.setItem('token', data.token);
        setUser({
          id: data._id,
          email: data.email,
          full_name: data.fullName,
          role: data.role,
          created_at: data.createdAt,
        });
        
        return { error: null };
      } catch (err) {
        return { error: (err as Error).message };
      }
    },

    async signUp(email, password, fullName, role) {
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, fullName, role }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { error: data.message || 'Registration failed' };
        }

        localStorage.setItem('token', data.token);
        setUser({
          id: data._id,
          email: data.email,
          full_name: data.fullName,
          role: data.role,
          created_at: data.createdAt,
        });
        
        return { error: null };
      } catch (err) {
        return { error: (err as Error).message };
      }
    },

    async signOut() {
      localStorage.removeItem('token');
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}