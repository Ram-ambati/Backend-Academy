import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null, // { id, name, email, role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' }
      isAuthenticated: false,

      login: (token, user, refreshToken) => set({ token, refreshToken, user, isAuthenticated: true }),
      
      setToken: (token) => set({ token }),

      logout: () => set({ token: null, refreshToken: null, user: null, isAuthenticated: false }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
);

export default useAuthStore;
