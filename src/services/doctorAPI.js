const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchDoctorsByLocation = async (location) => {
  try {
    const params = new URLSearchParams({ city: String(location || '').toLowerCase() });
    const response = await fetch(`${API_BASE_URL}/api/doctors?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns an array of doctors
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const searchDoctors = async (location, specialty = '', name = '') => {
  try {
    const params = new URLSearchParams({
      ...(location && { city: String(location).toLowerCase() }),
      ...(specialty && { specialty }),
      ...(name && { q: name })
    });
    const response = await fetch(`${API_BASE_URL}/api/doctors?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error searching doctors:', error);
    throw error;
  }
};

