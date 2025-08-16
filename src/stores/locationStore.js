// stores/locationStore.js
import { create } from 'zustand';

const useLocationStore = create((set, get) => ({
  // State
  selectedLocation: '',
  coordinates: { lat: null, lng: null },
  locationLoading: true,
  locationError: null,
  availableLocations: ['Deoghar', 'Delhi', 'Mumbai', 'Kolkata', 'Bangalore'],

  // Simple reverse geocoding without Google API (for testing)
  getLocationName: (lat, lng) => {
    console.log('🔍 Mapping coordinates to location:', { lat, lng });
    
    // Mock location mapping based on approximate coordinates
    const locationMap = [
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777, range: 1 },
      { name: 'Delhi', lat: 28.6139, lng: 77.2090, range: 1 },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946, range: 1 },
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639, range: 1 },
      { name: 'Deoghar', lat: 24.4844, lng: 86.6947, range: 1 },
    ];

    // Find closest city
    for (const location of locationMap) {
      const distance = Math.sqrt(
        Math.pow(lat - location.lat, 2) + Math.pow(lng - location.lng, 2)
      );
      if (distance <= location.range) {
        console.log('🏙️ Found exact match:', location.name);
        return location.name;
      }
    }

    // If no exact match, return a generic location based on coordinates
    let regionName;
    if (lat > 25) regionName = 'Northern India';
    else if (lat < 15) regionName = 'Southern India';
    else if (lng > 80) regionName = 'Eastern India';
    else regionName = 'Western India';

    console.log('📍 Using region-based location:', regionName);
    return regionName;
  },

  // Actions
  getCurrentLocation: () => {
    set({ locationLoading: true, locationError: null });
    console.log('🔍 Starting GPS location detection...');

    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by this browser';
      console.error('❌', error);
      set({ 
        locationError: error,
        locationLoading: false,
        selectedLocation: 'Deoghar' // Default fallback
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('📍 GPS Coordinates received:', { latitude, longitude });
          
          const { getLocationName } = get();
          const cityName = getLocationName(latitude, longitude);
          
          console.log('🏙️ Final detected location:', cityName);
          
          set({
            coordinates: { lat: latitude, lng: longitude },
            selectedLocation: cityName,
            locationLoading: false,
            locationError: null
          });
        } catch (error) {
          console.error('❌ Error processing location:', error);
          set({
            locationError: 'Failed to process location',
            locationLoading: false,
            selectedLocation: 'Deoghar'
          });
        }
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        
        console.error('❌ Geolocation error:', error);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            console.log('🚫 User denied location permission');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            console.log('📍 Location unavailable');
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            console.log('⏰ Location request timeout');
            break;
          default:
            errorMessage = 'An unknown error occurred';
            console.log('❓ Unknown location error');
        }
        
        set({
          locationError: errorMessage,
          locationLoading: false,
          selectedLocation: 'Deoghar' // Default fallback
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 300000 // 5 minutes cache
      }
    );
  },

  updateLocation: (location) => {
    console.log('🔄 Location manually changed to:', location);
    set({ selectedLocation: location });
  },

  refreshLocation: () => {
    console.log('🔄 Refreshing GPS location...');
    get().getCurrentLocation();
  },

  // Initialize location (call this once when app starts)
  initializeLocation: () => {
    console.log('🚀 Initializing location store...');
    get().getCurrentLocation();
  }
}));

export default useLocationStore;
