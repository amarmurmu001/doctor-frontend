// Location utility functions for consistent location handling across the app

/**
 * Get location from URL parameter or return default
 * @param {string} locationParam - Location parameter from URL
 * @returns {string} Formatted location name
 */
export const getLocationFromParam = (locationParam) => {
  if (!locationParam) return 'India';

  // Capitalize first letter and lowercase the rest
  return locationParam.charAt(0).toUpperCase() + locationParam.slice(1).toLowerCase();
};

/**
 * Get user's current location using geolocation API (future enhancement)
 * @returns {Promise<string>} User's location or default
 */
export const getCurrentLocation = async () => {
  // Future enhancement: Use geolocation API
  // For now, return default or check localStorage for user preference
  const savedLocation = localStorage.getItem('userLocation');
  return savedLocation || 'India';
};

/**
 * Save user's location preference
 * @param {string} location - Location to save
 */
export const saveUserLocation = (location) => {
  if (location) {
    localStorage.setItem('userLocation', location);
  }
};

/**
 * Get location-based API parameters
 * @param {string} location - Location name
 * @returns {URLSearchParams} Search parameters for API calls
 */
export const getLocationApiParams = (location) => {
  const params = new URLSearchParams();

  if (location && location !== 'India') {
    params.set('city', location.toLowerCase());
  }

  return params;
};

/**
 * Validate location against allowed locations
 * @param {string} location - Location to validate
 * @param {Array<string>} allowedLocations - List of allowed locations
 * @returns {boolean} Whether location is valid
 */
export const isValidLocation = (location, allowedLocations = []) => {
  if (!location) return true; // Allow empty for default
  return allowedLocations.includes(location.toLowerCase());
};

/**
 * Get location display name with proper formatting
 * @param {string} location - Raw location string
 * @returns {string} Formatted location name
 */
export const formatLocationName = (location) => {
  if (!location) return 'India';

  // Handle common location formats
  const formatted = location
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return formatted;
};
