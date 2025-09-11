import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import DoctorCard from "../components/doctor/DoctorCard";
import { getLocationApiParams, getLocationFromParam } from "../utils/locationUtils";

// Utility function to extract rating from doctor data
const extractRating = (doctor) => {
  if (!doctor) return 0;

  // Try different rating field names
  const rating = doctor.averageRating ||
                doctor.rating ||
                doctor.ratings ||
                doctor.totalRating ||
                doctor.average_rating ||
                doctor.ratingAverage;

  // If we have a numeric rating, return it
  if (typeof rating === 'number' && rating > 0) {
    return rating;
  }

  // If we have reviews array, calculate average
  if (doctor.reviews && Array.isArray(doctor.reviews) && doctor.reviews.length > 0) {
    const totalRating = doctor.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return totalRating / doctor.reviews.length;
  }

  return 0;
};

export default function LocationDoctors() {
  const { location } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formattedLocation = getLocationFromParam(location);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      if (!API_BASE_URL) {
        throw new Error('Backend URL not configured');
      }

      // Fetch doctors with pagination, approval filter, and location filter
      const locationParams = getLocationApiParams(formattedLocation);
      const params = new URLSearchParams({
        limit: '50', // Fetch more doctors for better location filtering
        status: 'approved' // Only show approved doctors
      });

      // Add location parameters
      for (let [key, value] of locationParams) {
        params.set(key, value);
      }

      const url = `${API_BASE_URL}/api/doctors?${params}`;
      console.log('🏥 Fetching doctors from:', url, 'for location:', formattedLocation);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Doctors data received:', data);

      // Debug: Log rating data for first few doctors
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('🔍 Rating data check for first doctor:', {
          doctor: data[0].name || data[0].user?.name,
          ratingAverage: data[0].ratingAverage,
          averageRating: data[0].averageRating,
          rating: data[0].rating,
          ratings: data[0].ratings,
          totalRating: data[0].totalRating,
          average_rating: data[0].average_rating
        });
      }

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
        setError('Found doctors but couldn\'t display them. Please try again.');
      }

    } catch (err) {
      console.error('❌ Error fetching doctors:', err);
      setError(err.message || 'Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [formattedLocation]);

  useEffect(() => {
    // Fetch doctors when location changes
    if (formattedLocation) {
      fetchDoctors();
    }
  }, [fetchDoctors, formattedLocation]);

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

    return {
      count: doctors.length,
      specialty: mostCommonSpecialty,
      location: formattedLocation
    };
  }

  // Function to map doctor data to card props
  function mapDoctorToCardProps(doctor, index = 0) {
    const userName = doctor.user?.name || doctor.name || 'Doctor';
    const userSpecialty = doctor.specialty || doctor.keySpecialization?.[0] || 'General';
    const consultationFee = doctor.consultationFee || doctor.fee || 0;
    const doctorImage = doctor.profileImage || doctor.user?.profileImage || '/icons/doctor.png';
    const city = doctor.address?.city || formattedLocation;
    const languages = doctor.languages || ['English'];
    const yearsOfExperience = doctor.yearsOfExperience || 0;
    // Extract rating using utility function
    const ratingAverage = extractRating(doctor);

    // Debug: Log rating extraction for first few doctors
    if (index < 3) {
      console.log(`🔍 Doctor ${index + 1} rating extraction:`, {
        name: userName,
        extractedRating: ratingAverage,
        originalData: {
          averageRating: doctor.averageRating,
          rating: doctor.rating,
          ratings: doctor.ratings,
          totalRating: doctor.totalRating,
          average_rating: doctor.average_rating,
          ratingAverage: doctor.ratingAverage,
          reviewsCount: doctor.reviews?.length || 0
        }
      });
    }

    return {
      name: userName,
      specialty: userSpecialty,
      price: consultationFee > 0 ? `₹${consultationFee}/Consultation` : 'Contact for price',
      image: doctorImage,
      doctorId: doctor._id || doctor.id,
      city: city,
      languages: languages,
      yearsOfExperience: yearsOfExperience,
      ratingAverage: ratingAverage,
    };
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen bg-[#f4f4ff] flex flex-col">
        <PageHeader />
        <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
          <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-center">
            Finding Doctors in {formattedLocation}...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:h-full overflow-y-auto">
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
            `${getHeaderInfo().count} doctors found in ${getHeaderInfo().location}` :
            `Doctors in ${formattedLocation}`
          }
        </h2>

        {/* Empty state */}
        {doctors.length === 0 && !loading && (
          <div className="text-center py-6 sm:py-8 bg-yellow-50 rounded-lg border border-yellow-200 mx-4 sm:mx-0">
            <div className="text-3xl sm:text-4xl mb-3">🏥</div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Doctors Found</h3>
            <p className="text-gray-600 text-sm px-4 sm:px-0">
              We couldn't find any doctors in {formattedLocation} at the moment. Please try a different location or try again later.
            </p>
          </div>
        )}

        {/* 3-column grid layout - maintaining original card height */}
        {doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ">
            {doctors.map((doctor, index) => (
              <DoctorCard
                key={doctor._id || doctor.id || `doctor-${index}`}
                {...mapDoctorToCardProps(doctor, index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
