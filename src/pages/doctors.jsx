import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../components/layout/PageHeader";
import DoctorCard from "../components/doctor/DoctorCard";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      if (!API_BASE_URL) {
        throw new Error('Backend URL not configured');
      }

      // Fetch doctors with pagination
      const params = new URLSearchParams({
        limit: '20', // Fetch more doctors for the grid
      });

      const url = `${API_BASE_URL}/api/doctors?${params}`;
      console.log('🏥 Fetching doctors from:', url);

      const response = await fetch(url);

      if (!response.ok) {
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

      // Ensure we have valid doctor objects
      const validDoctors = doctorsArray.filter(doctor =>
        doctor && (doctor._id || doctor.id) && (doctor.user?.name || doctor.name)
      );

      setDoctors(validDoctors);

      if (validDoctors.length === 0 && doctorsArray.length > 0) {
        setError('Found doctors but couldn\'t display them. Please try again.');
      }

    } catch (err) {
      console.error('❌ Error fetching doctors:', err);
      setError(err.message || 'Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Function to get location and specialty info
  function getHeaderInfo() {
    if (doctors.length === 0) return null;

    // Get the most common specialty
    const specialties = doctors.map(doctor =>
      doctor.specialty || doctor.keySpecialization?.[0] || 'General'
    );
    const specialtyCounts = specialties.reduce((acc, specialty) => {
      acc[specialty] = (acc[specialty] || 0) + 1;
      return acc;
    }, {});
    const mostCommonSpecialty = Object.keys(specialtyCounts).reduce((a, b) =>
      specialtyCounts[a] > specialtyCounts[b] ? a : b
    );

    // Get the most common location
    const locations = doctors.map(doctor => doctor.address?.city || 'India');
    const locationCounts = locations.reduce((acc, location) => {
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
    const mostCommonLocation = Object.keys(locationCounts).reduce((a, b) =>
      locationCounts[a] > locationCounts[b] ? a : b
    );

    return {
      count: doctors.length,
      specialty: mostCommonSpecialty,
      location: mostCommonLocation
    };
  }

  // Function to map doctor data to card props
  function mapDoctorToCardProps(doctor) {
    const userName = doctor.user?.name || doctor.name || 'Doctor';
    const userSpecialty = doctor.specialty || doctor.keySpecialization?.[0] || 'General';
    const consultationFee = doctor.consultationFee || doctor.fee || 0;
    const doctorImage = doctor.profileImage || doctor.user?.profileImage || '/icons/doctor.png';
    const city = doctor.address?.city || 'India';

    return {
      name: userName,
      specialty: userSpecialty,
      price: consultationFee > 0 ? `₹${consultationFee}/Consultation` : 'Contact for price',
      image: doctorImage,
      doctorId: doctor._id || doctor.id,
      city: city,
    };
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen bg-[#f4f4ff] flex flex-col">
        <PageHeader />
        <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
          <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-center">Finding Doctors...</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 h-full overflow-y-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="min-w-[300px] border-2 border-gray-200 rounded-xl bg-white overflow-hidden animate-pulse"
              >
                <div className="flex items-center p-4">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="w-24 h-24 bg-gray-200 rounded ml-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-screen bg-[#f4f4ff] flex flex-col">
        <PageHeader />
        <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6 flex items-center justify-center">
          <div className="text-center bg-red-50 rounded-lg p-8 border border-red-200 max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Doctors</h3>
            <p className="text-red-700 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#f4f4ff] flex flex-col">
      {/* Header with search */}
      <PageHeader />

      {/* Doctors grid with title */}
      <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
        <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-center">
          {getHeaderInfo() ?
            `Total ${getHeaderInfo().count} doctors found in ${getHeaderInfo().location}` :
            'Our Doctors'
          }
        </h2>

        {/* Empty state */}
        {doctors.length === 0 && !loading && (
          <div className="text-center py-6 sm:py-8 bg-yellow-50 rounded-lg border border-yellow-200 mx-4 sm:mx-0">
            <div className="text-3xl sm:text-4xl mb-3">🏥</div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Doctors Found</h3>
            <p className="text-gray-600 text-sm px-4 sm:px-0">
              We couldn't find any doctors at the moment. Please try again later.
            </p>
          </div>
        )}

        {/* 3-column grid layout - maintaining original card height */}
        {doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 h-full overflow-y-auto">
            {doctors.map((doctor, index) => (
              <DoctorCard
                key={doctor._id || doctor.id || `doctor-${index}`}
                {...mapDoctorToCardProps(doctor)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


