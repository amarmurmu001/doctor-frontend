import React, { useState, useEffect, useCallback } from "react";
import DoctorCard from "./DoctorCard";
import useLocationStore from "../../stores/locationStore";

export default function DoctorsList() {
  const { selectedLocation, expandLocationToCities } = useLocationStore();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDoctors = useCallback(async () => {
    if (!selectedLocation) {
      setDoctors([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      
      if (!API_BASE_URL) {
        throw new Error('Backend URL not configured');
      }

      // Improved API call with better error handling and state-to-city mapping
      const locationCities = expandLocationToCities(selectedLocation);
      console.log('🔍 Searching for doctors in cities:', locationCities);
      
      // If location expands to multiple cities, search for the first one
      // (Backend will handle state-to-city mapping as well)
      const searchCity = locationCities[0] || selectedLocation;
      
      const params = new URLSearchParams({ 
        city: searchCity.toLowerCase().trim(),
        limit: '20' // Limit results for better performance
      });
      
      const url = `${API_BASE_URL}/api/doctors?${params}`;
      console.log('🏥 Fetching doctors for:', selectedLocation, 'URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          setDoctors([]);
          setError(`No doctors found in ${selectedLocation}`);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Doctors data received:', data);
      
      // Handle different response formats
      const doctorsArray = Array.isArray(data) ? data : (data.doctors || data.data || []);
      setDoctors(doctorsArray);
      
      if (doctorsArray.length === 0) {
        setError(`No doctors found in ${selectedLocation}. Try selecting a different location.`);
      }
      
    } catch (err) {
      console.error('❌ Error fetching doctors:', err);
      setError(err.message || 'Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, expandLocationToCities]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  function mapDoctorToCardProps(doctor) {
    return {
      name: doctor.user && doctor.user.name ? doctor.user.name : 'Doctor',
      specialty: doctor.specialty || 'General',
      price: typeof doctor.consultationFee === 'number' ? `₹${doctor.consultationFee}/Consultation` : 'N/A',
      image: '/icons/doctor.png',
      doctorId: doctor._id || doctor.id,
    };
  }

  // Loading state
  if (loading) {
    return (
      <div className="px-4">
        <h2 className="text-lg font-bold mb-4">
          {selectedLocation ? `Finding doctors in ${selectedLocation}...` : 'Finding doctors near you...'}
        </h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[300px] h-32 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No location selected
  if (!selectedLocation) {
    return (
      <div className="px-4">
        <div className="text-center py-8 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-4xl mb-3">📍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Location</h3>
          <p className="text-gray-600 text-sm">
            Please select a location to find doctors near you
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      {/* Header with retry button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          Doctors in {selectedLocation}
          {doctors.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({doctors.length} found)
            </span>
          )}
        </h2>
        {error && (
          <button
            onClick={fetchDoctors}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200 mb-4">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Doctors</h3>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={fetchDoctors}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Doctors list */}
      {doctors.length > 0 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id || doctor.id}
              {...mapDoctorToCardProps(doctor)}
            />
          ))}
        </div>
      )}

      {/* Empty state (when no error but no doctors) */}
      {!error && !loading && doctors.length === 0 && selectedLocation && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-4xl mb-3">🏥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Doctors Found</h3>
          <p className="text-gray-600 text-sm mb-4">
            We couldn't find any doctors in {selectedLocation}
          </p>
          <p className="text-gray-500 text-xs">
            Try selecting a nearby city or check back later
          </p>
        </div>
      )}
    </div>
  );
}


