import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, setAuthToken } from '@/lib/api';
import type { User } from '@/types/portfolio';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          const response = await authApi.login(email, password);
          set({ user: response.user, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },
      
      logout: () => {
        authApi.logout();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          setAuthToken(localStorage.getItem('auth_token'));
        }
      },
    }
  )
);
