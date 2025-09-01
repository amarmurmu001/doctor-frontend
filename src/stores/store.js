import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import adminReducer from './adminSlice';
import locationReducer from './locationSlice';

// Load persisted state from localStorage
const loadPersistedState = () => {
  try {
    const serializedState = localStorage.getItem('redux-state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Failed to load persisted state:', err);
    return undefined;
  }
};

// Save state to localStorage
const savePersistedState = (state) => {
  try {
    const serializedState = JSON.stringify({
      auth: {
        user: state.auth.user,
        token: state.auth.token,
        isAuthenticated: state.auth.isAuthenticated,
        onboarding: state.auth.onboarding,
      },
      location: {
        selectedLocation: state.location.selectedLocation,
        coordinates: state.location.coordinates,
        availableLocations: state.location.availableLocations,
        isInitialized: state.location.isInitialized,
      },
    });
    localStorage.setItem('redux-state', serializedState);
  } catch (err) {
    console.warn('Failed to save state:', err);
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    location: locationReducer,
  },
  preloadedState: loadPersistedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Subscribe to store changes to persist state
store.subscribe(() => {
  savePersistedState(store.getState());
});

export default store;
