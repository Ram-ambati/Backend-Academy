import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null, // { id, name, email, role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' }
      isAuthenticated: false,

      login: (token, user) => set({ token, user, isAuthenticated: true }),
      
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      
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
