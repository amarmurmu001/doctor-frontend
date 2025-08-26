import { create } from 'zustand'
import { persist } from 'zustand/middleware'


const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      onboarding: {
        email: '',
        phone: '',
        otpVerified: false,
        persona: '',
        city: '',
        language: '',
        gender: '',
        dob: '',
      },

      // Actions
      setOnboarding: (patch) => 
        set(state => ({ 
          onboarding: { ...state.onboarding, ...patch } 
        })),

      completeOnboarding: () => 
        set({ 
          onboarding: { 
            email: '', 
            phone: '', 
            otpVerified: false, 
            persona: '', 
            city: '', 
            language: '', 
            gender: '', 
            dob: '' 
          } 
        }),

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
      },

      updateProfileImage: (image) => 
        set(state => ({ 
          user: { ...state.user, image } 
        })),

      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        onboarding: state.onboarding
      })
    }
  )
)

// Make sure this line exists!
export default useAuthStore
