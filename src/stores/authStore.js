import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(persist((set, get) => ({
  user: null,
  token: null,
  onboarding: {
    email: '',
    phone: '',
    otpVerified: false,
    persona: '', // 'patient' | 'doctor'
    city: '',
    language: '',
    gender: '',
    dob: '',
  },

  setOnboarding: (patch) => set(state => ({ onboarding: { ...state.onboarding, ...patch } })),
  completeOnboarding: () => set({ onboarding: { email: '', phone: '', otpVerified: false, persona: '', city: '', language: '', gender: '', dob: '' } }),

  setAuth: ({ user, token }) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}), { name: 'auth-store' }))

export default useAuthStore


