const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchDoctorsByLocation = async (location) => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctor/search?location=${encodeURIComponent(location.toLowerCase())}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const searchDoctors = async (location, specialty = '', name = '') => {
  try {
    const params = new URLSearchParams({
      location: location.toLowerCase(),
      ...(specialty && { specialty }),
      ...(name && { name })
    });
    
    const response = await fetch(`${API_BASE_URL}/doctor/search?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error('Error searching doctors:', error);
    throw error;
  }
};
