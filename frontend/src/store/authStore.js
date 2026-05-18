import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      getToken: () => get().token,
    }),
    {
      name: 'rhc-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
