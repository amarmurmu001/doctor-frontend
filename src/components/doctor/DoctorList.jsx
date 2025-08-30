import React, { useState, useEffect, useCallback } from "react";
import DoctorCard from "./DoctorCard";
import useLocationStore from "../../stores/locationStore";
import { useNavigate } from "react-router-dom";

export default function DoctorsList() {
  const { selectedLocation, expandLocationToCities } = useLocationStore();
  const navigate = useNavigate();
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
      
      
      // If location expands to multiple cities, search for the first one
      // (Backend will handle state-to-city mapping as well)
      const searchCity = locationCities[0] || selectedLocation;
      
      const params = new URLSearchParams({
        city: searchCity.toLowerCase().trim(),
        limit: '20', // Limit results for better performance
        status: 'approved' // Only show approved doctors
      });
      
      const url = `${API_BASE_URL}/api/doctors?${params}`;
     
      
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
      let doctorsArray = [];
      
      if (Array.isArray(data)) {
        doctorsArray = data;
      } else if (data && typeof data === 'object') {
        doctorsArray = data.doctors || data.data || data.results || [];
      }
      
      // Ensure we have valid doctor objects and only approved doctors
      const validDoctors = doctorsArray.filter(doctor =>
        doctor &&
        (doctor._id || doctor.id) &&
        (doctor.user?.name || doctor.name) &&
        doctor.status === 'approved' // Additional client-side filtering
      );

      setDoctors(validDoctors);
      
      if (validDoctors.length === 0 && doctorsArray.length > 0) {
        setError(`Found doctors but couldn't display them. Please try again.`);
      } else if (validDoctors.length === 0) {
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
    // Handle different possible data structures
    const userName = doctor.user?.name || doctor.name || 'Doctor';
    const userSpecialty = doctor.specialty || doctor.keySpecialization?.[0] || 'General';
    const consultationFee = doctor.consultationFee || doctor.fee || 0;
    const doctorImage = doctor.profileImage || doctor.user?.profileImage || '/icons/doctor.png';
    const city = doctor.address?.city || selectedLocation || 'India';
    const yearsOfExperience = doctor.yearsOfExperience || 0;
    // Comprehensive rating field mapping
    const ratingAverage = doctor.averageRating ||
                         doctor.rating ||
                         doctor.ratings ||
                         doctor.totalRating ||
                         doctor.average_rating ||
                         doctor.ratingAverage ||
                         (doctor.reviews && doctor.reviews.length > 0
                           ? (doctor.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / doctor.reviews.length)
                           : 0) ||
                         0;
    const languages = doctor.languages || [];
    
    return {
      name: userName,
      specialty: userSpecialty,
      price: consultationFee > 0 ? `₹${consultationFee}/Consultation` : 'Contact for price',
      image: doctorImage,
      doctorId: doctor._id || doctor.id,
      city: city,
      yearsOfExperience: yearsOfExperience,
      ratingAverage: ratingAverage,
      languages: languages,
    };
  }

  // Loading state
  if (loading) {
    return (
      <div className="px-4 ">
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
        
          <button
            onClick={() => navigate('/doctors')}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
          >
            All
          </button>
          
      
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
          {doctors.map((doctor, index) => (
            <DoctorCard
              key={doctor._id || doctor.id || `doctor-${index}`}
              {...mapDoctorToCardProps(doctor)}
            />
          ))}
        </div>
      )}
      
      {/* Add scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

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


