import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLocationStore = create(
  persist(
    (set, get) => ({
      // State - Updated with your actual database locations
      selectedLocation: '',
      coordinates: { lat: null, lng: null },
      locationLoading: false,
      locationError: null,
      availableLocations: [],
      isInitialized: false,

  // Enhanced reverse geocoding with your database locations
  getLocationName: (lat, lng) => {
    console.log('🔍 Mapping coordinates to location:', { lat, lng });
    
    // Updated location mapping with your seeded locations
    const locationMap = [
      // Jharkhand cities
      { name: 'Dhanbad', lat: 23.8000, lng: 86.4500, range: 0.5, state: 'Jharkhand' },
      { name: 'Deoghar', lat: 24.4844, lng: 86.6947, range: 0.5, state: 'Jharkhand' },
      { name: 'Ranchi', lat: 23.3441, lng: 85.3096, range: 0.5, state: 'Jharkhand' },
      { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029, range: 0.5, state: 'Jharkhand' },
      { name: 'Bokaro', lat: 23.6693, lng: 86.1511, range: 0.5, state: 'Jharkhand' },
      
      // West Bengal cities  
      { name: 'Howrah', lat: 22.5958, lng: 88.2636, range: 0.5, state: 'West Bengal' },
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639, range: 1, state: 'West Bengal' },
      
      // Uttar Pradesh cities
      { name: 'Sahjahanpur', lat: 27.8833, lng: 79.9667, range: 0.5, state: 'Uttar Pradesh' },
      { name: 'Lucknow', lat: 26.8467, lng: 80.9462, range: 0.5, state: 'Uttar Pradesh' },
      
      // Bihar cities
      { name: 'Patna', lat: 25.5941, lng: 85.1376, range: 0.5, state: 'Bihar' },
      
      // Major metro cities
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777, range: 1, state: 'Maharashtra' },
      { name: 'Delhi', lat: 28.6139, lng: 77.2090, range: 1, state: 'Delhi' },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946, range: 1, state: 'Karnataka' },
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
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      
      if (!API_BASE_URL) {
        console.warn('⚠️ VITE_BACKEND_URL not configured, using default locations');
        const defaultLocations = [
          'Dhanbad', 'Deoghar', 'Howrah', 'Sahjahanpur', 
          'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Patna'
        ];
        set({ availableLocations: defaultLocations });
        return defaultLocations;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/doctors?status=approved`);
      if (response.ok) {
        const data = await response.json();
        const locations = Array.isArray(data) 
          ? Array.from(new Set(data.map(d => (d.city || '').toString().trim()).filter(Boolean))) 
          : [];
        console.log('📍 Locations from backend:', locations);
        
        // Merge with popular cities and states for better UX
        const popularCities = [
          'Jharkhand', 'Dhanbad', 'Deoghar', 'Howrah', 'Sahjahanpur', 
          'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Patna', 'Pune',
          'West Bengal', 'Bihar', 'Uttar Pradesh'
        ];
        
        const allLocations = [...new Set([
          ...popularCities,
          ...locations
        ])];
        
        set({ availableLocations: allLocations });
        return allLocations;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch locations from backend:', error.message);
      const fallbackLocations = [
        'Jharkhand', 'Dhanbad', 'Deoghar', 'Howrah', 'Sahjahanpur', 
        'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Patna'
      ];
      set({ availableLocations: fallbackLocations });
      return fallbackLocations;
    }
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
    const state = get();
    
    // Prevent multiple initializations
    if (state.isInitialized) {
      console.log('🚀 Location store already initialized');
      return;
    }
    
    console.log('🚀 Initializing location store...');
    set({ isInitialized: true });
    
    // Fetch available locations from backend first
    await state.fetchAvailableLocations();
    
    // Only get current location if we don't have a stored location
    if (!state.selectedLocation) {
      state.getCurrentLocation();
    } else {
      console.log('📍 Using stored location:', state.selectedLocation);
    }
  },

  // Search locations with autocomplete
  searchLocations: (query) => {
    const { availableLocations } = get();
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    return availableLocations
      .filter(location => location.toLowerCase().includes(searchTerm))
      .slice(0, 8); // Limit to 8 results
  },

  // Validate if location exists in available locations
  isValidLocation: (location) => {
    const { availableLocations } = get();
    return availableLocations.some(loc => 
      loc.toLowerCase() === location.toLowerCase()
    );
  },

  // Get nearest popular cities for fallback
  getNearestCities: (lat, lng) => {
    const popularCities = [
      { name: 'Dhanbad', lat: 23.8000, lng: 86.4500 },
      { name: 'Deoghar', lat: 24.4844, lng: 86.6947 },
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946 }
    ];

    // Calculate distances and return nearest 3
    return popularCities
      .map(city => {
        const distance = Math.sqrt(
          Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
        );
        return { ...city, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(city => city.name);
  },

  // Map state to cities for better location filtering
  getStateToCityMapping: () => {
    return {
      'Jharkhand': ['Dhanbad', 'Deoghar', 'Ranchi', 'Jamshedpur', 'Bokaro', 'Hazaribagh', 'Giridih'],
      'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
      'Uttar Pradesh': ['Sahjahanpur', 'Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
      'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
      'Eastern India': ['Dhanbad', 'Deoghar', 'Kolkata', 'Howrah', 'Patna'],
      'Northern India': ['Delhi', 'Sahjahanpur', 'Lucknow', 'Patna']
    };
  },

  // Check if location is a state and expand to cities
  expandLocationToCities: (location) => {
    const stateMapping = get().getStateToCityMapping();
    const locationLower = location.toLowerCase();
    
    // Check if it's a state name
    for (const [state, cities] of Object.entries(stateMapping)) {
      if (state.toLowerCase() === locationLower || 
          state.toLowerCase().includes(locationLower) ||
          locationLower.includes(state.toLowerCase())) {
        console.log(`📍 Expanding ${location} to cities:`, cities);
        return cities;
      }
    }
    
    // If not a state, return the original location
    return [location];
  }
    }),
    {
      name: 'location-store',
      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
        coordinates: state.coordinates,
        availableLocations: state.availableLocations,
        isInitialized: state.isInitialized
      })
    }
  )
);

export default useLocationStore;
