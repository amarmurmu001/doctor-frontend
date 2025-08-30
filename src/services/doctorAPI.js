const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchDoctorsByLocation = async (location) => {
  try {
    const params = new URLSearchParams({
      city: String(location || '').toLowerCase(),
      status: 'approved' // Only fetch approved doctors
    });
    const response = await fetch(`${API_BASE_URL}/api/doctors?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns an array of doctors, filter to ensure only approved ones
    const doctors = Array.isArray(data) ? data : [];
    return doctors.filter(doctor => doctor.status === 'approved');
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
      ...(name && { q: name }),
      status: 'approved' // Only fetch approved doctors
    });
    const response = await fetch(`${API_BASE_URL}/api/doctors?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Filter to ensure only approved doctors are returned
    const doctors = Array.isArray(data) ? data : [];
    return doctors.filter(doctor => doctor.status === 'approved');
  } catch (error) {
    console.error('Error searching doctors:', error);
    throw error;
  }
};

