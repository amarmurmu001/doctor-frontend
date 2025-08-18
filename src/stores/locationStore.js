// stores/locationStore.js
import { create } from 'zustand';

const useLocationStore = create((set, get) => ({
  // State - Updated with your actual database locations
  selectedLocation: '',
  coordinates: { lat: null, lng: null },
  locationLoading: true,
  locationError: null,
  availableLocations: [],

  // Enhanced reverse geocoding with your database locations
  getLocationName: (lat, lng) => {
    console.log('🔍 Mapping coordinates to location:', { lat, lng });
    
    // Updated location mapping with your seeded locations
    const locationMap = [
      // Your seeded locations from database
      { name: 'Dhanbad', lat: 23.8000, lng: 86.4500, range: 0.5 },
      { name: 'Deoghar', lat: 24.4844, lng: 86.6947, range: 0.5 },
      { name: 'Howrah', lat: 22.5958, lng: 88.2636, range: 0.5 },
      { name: 'Sahjahanpur', lat: 27.8833, lng: 79.9667, range: 0.5 },
      
      // Major cities
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777, range: 1 },
      { name: 'Delhi', lat: 28.6139, lng: 77.2090, range: 1 },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946, range: 1 },
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639, range: 1 },
    ];

    // Find closest city with improved distance calculation
    let closestLocation = null;
    let minDistance = Infinity;

    for (const location of locationMap) {
      // Haversine distance formula for better accuracy
      const R = 6371; // Earth's radius in km
      const dLat = (lat - location.lat) * Math.PI / 180;
      const dLng = (lng - location.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(location.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c; // Distance in km

      if (distance <= location.range * 50 && distance < minDistance) { // 50km range
        minDistance = distance;
        closestLocation = location.name;
      }
    }

    if (closestLocation) {
      console.log('🏙️ Found closest match:', closestLocation, `(${minDistance.toFixed(1)}km away)`);
      return closestLocation;
    }

    // Enhanced regional mapping for India
    let regionName;
    // Jharkhand region (your main locations)
    if (lat >= 23 && lat <= 25 && lng >= 85 && lng <= 88) {
      regionName = 'Jharkhand';
    }
    // West Bengal region
    else if (lat >= 21.5 && lat <= 27.5 && lng >= 85.5 && lng <= 89.5) {
      regionName = 'West Bengal';
    }
    // Uttar Pradesh region
    else if (lat >= 23.5 && lat <= 30.5 && lng >= 77 && lng <= 84) {
      regionName = 'Uttar Pradesh';
    }
    // Northern India
    else if (lat > 25) {
      regionName = 'Northern India';
    }
    // Southern India
    else if (lat < 15) {
      regionName = 'Southern India';
    }
    // Eastern India
    else if (lng > 80) {
      regionName = 'Eastern India';
    }
    // Western India
    else {
      regionName = 'Western India';
    }

    console.log('📍 Using region-based location:', regionName);
    return regionName;
  },

  // Fetch available locations from backend
  fetchAvailableLocations: async () => {
    try {
      console.log('🌍 Fetching available locations from backend...');
      const response = await fetch('http://localhost:10000/api/doctor/locations');
      if (response.ok) {
        const data = await response.json();
        const locations = data.locations || [];
        console.log('📍 Locations from backend:', locations);
        
        // Merge with default locations
        const allLocations = [...new Set([
          ...locations
        ])];
        
        set({ availableLocations: allLocations });
        return allLocations;
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch locations from backend, using defaults');
    }
    return get().availableLocations;
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
        selectedLocation: 'Deoghar' // Default to your seeded location
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
            selectedLocation: 'Deoghar' // Your default location
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
          selectedLocation: 'Deoghar' // Your default location
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased to 15 seconds
        maximumAge: 300000 // 5 minutes cache
      }
    );
  },

  updateLocation: (location) => {
    console.log('🔄 Location manually changed to:', location);
    
    // If "Current Location" is selected, trigger GPS
    if (location === 'Current Location' || location === 'Near me') {
      get().getCurrentLocation();
    } else {
      set({ selectedLocation: location });
    }
  },

  setCoordinates: (coords) => {
    console.log('📍 Setting coordinates:', coords);
    set({ coordinates: coords });
  },

  refreshLocation: () => {
    console.log('🔄 Refreshing GPS location...');
    get().getCurrentLocation();
  },

  // Initialize location and fetch available locations
  initializeLocation: async () => {
    console.log('🚀 Initializing location store...');
    
    // Fetch available locations from backend first
    await get().fetchAvailableLocations();
    
    // Then get current location
    get().getCurrentLocation();
  }
}));

export default useLocationStore;
