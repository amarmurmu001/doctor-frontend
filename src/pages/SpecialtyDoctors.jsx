import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import DoctorCard from "../components/doctor/DoctorCard";

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

export default function SpecialtyDoctors() {
  const { specialty } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formattedSpecialty = specialty ? specialty.charAt(0).toUpperCase() + specialty.slice(1).toLowerCase() : '';

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      if (!API_BASE_URL) {
        throw new Error('Backend URL not configured');
      }

      // Fetch doctors with pagination and approval filter
      // We'll do specialty filtering client-side for better control
      const params = new URLSearchParams({
        limit: '100', // Fetch more doctors for better filtering
        status: 'approved' // Only show approved doctors
      });

      const url = `${API_BASE_URL}/api/doctors?${params}`;
      console.log('🏥 Fetching doctors from:', url, 'for specialty:', formattedSpecialty);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Doctors data received:', data);

      // Debug: Log rating data and specialty data for first few doctors
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('🔍 First doctor data:', {
          name: data[0].name || data[0].user?.name,
          specialty: data[0].specialty,
          keySpecialization: data[0].keySpecialization,
          specialization: data[0].specialization,
          status: data[0].status,
          formattedSpecialty: formattedSpecialty
        });
      }

      // Handle different response formats
      let doctorsArray = [];

      if (Array.isArray(data)) {
        doctorsArray = data;
      } else if (data && typeof data === 'object') {
        doctorsArray = data.doctors || data.data || data.results || [];
      }

      // Helper function to check if specialty matches
      const specialtyMatches = (doctor, targetSpecialty) => {
        const specialtyFields = [
          doctor.specialty,
          doctor.keySpecialization?.[0],
          doctor.specialization,
          doctor.primarySpecialty,
          doctor.medicalSpecialty
        ];

        return specialtyFields.some(field => {
          if (!field) return false;
          const fieldStr = field.toString().toLowerCase();
          const targetStr = targetSpecialty.toLowerCase();

          // Exact match
          if (fieldStr === targetStr) return true;

          // Partial match (e.g., "cardiologist" matches "cardiology")
          if (fieldStr.includes(targetStr) || targetStr.includes(fieldStr)) return true;

          // Handle common variations
          const variations = {
            'cardiology': ['cardiac', 'heart', 'cardiovascular'],
            'cardiac': ['cardiology', 'heart', 'cardiovascular'],
            'heart': ['cardiology', 'cardiac', 'cardiovascular'],
            'cardiovascular': ['cardiology', 'cardiac', 'heart'],
            'dermatology': ['skin', 'dermatologist'],
            'skin': ['dermatology', 'dermatologist'],
            'dermatologist': ['dermatology', 'skin'],
            'pediatrics': ['pediatric', 'child', 'children'],
            'pediatric': ['pediatrics', 'child', 'children'],
            'child': ['pediatrics', 'pediatric', 'children'],
            'children': ['pediatrics', 'pediatric', 'child'],
            'orthopedics': ['orthopedic', 'bone', 'joint'],
            'orthopedic': ['orthopedics', 'bone', 'joint'],
            'bone': ['orthopedics', 'orthopedic', 'joint'],
            'joint': ['orthopedics', 'orthopedic', 'bone'],
            'neurology': ['neurological', 'brain', 'nerve'],
            'neurological': ['neurology', 'brain', 'nerve'],
            'brain': ['neurology', 'neurological', 'nerve'],
            'nerve': ['neurology', 'neurological', 'brain'],
            'gynecology': ['gynecologist', 'women', 'obstetrics'],
            'gynecologist': ['gynecology', 'women', 'obstetrics'],
            'women': ['gynecology', 'gynecologist', 'obstetrics'],
            'obstetrics': ['gynecology', 'gynecologist', 'women'],
            'psychiatry': ['psychiatrist', 'mental', 'psychology'],
            'psychiatrist': ['psychiatry', 'mental', 'psychology'],
            'mental': ['psychiatry', 'psychiatrist', 'psychology'],
            'psychology': ['psychiatry', 'psychiatrist', 'mental'],
            // Allopathic medicine variations - includes most conventional specialties
            'allopathic': ['general physician', 'internal medicine', 'family medicine', 'cardiology', 'dermatology', 'neurology', 'orthopedics', 'pediatrics', 'gynecology', 'psychiatry', 'ent', 'ophthalmology', 'urology', 'surgery', 'medicine'],
            'general physician': ['allopathic', 'general medicine', 'family physician', 'gp'],
            'general medicine': ['allopathic', 'general physician', 'internal medicine'],
            'internal medicine': ['allopathic', 'general medicine', 'general physician'],
            'family medicine': ['allopathic', 'family physician', 'general physician']
          };

          const fieldVariations = variations[fieldStr] || [];
          return fieldVariations.some(variation => variation === targetStr);
        });
      };

      // Ensure we have valid doctor objects and only approved doctors
      const validDoctors = doctorsArray.filter(doctor => {
        const hasBasicInfo = doctor &&
          (doctor._id || doctor.id) &&
          (doctor.user?.name || doctor.name);

        const isApproved = doctor.status === 'approved' || doctor.status === 'active';

        const specialtyMatch = specialtyMatches(doctor, formattedSpecialty);

        console.log('🔍 Doctor filtering:', {
          name: doctor.user?.name || doctor.name,
          specialty: doctor.specialty,
          keySpecialization: doctor.keySpecialization,
          hasBasicInfo,
          isApproved,
          specialtyMatch,
          formattedSpecialty
        });

        return hasBasicInfo && isApproved && specialtyMatch;
      });

      console.log('✅ Filtering results:', {
        totalDoctors: doctorsArray.length,
        validDoctors: validDoctors.length,
        formattedSpecialty
      });

      setDoctors(validDoctors);

      if (validDoctors.length === 0) {
        if (doctorsArray.length === 0) {
          setError('No doctors found.');
        } else {
          setError(`No ${formattedSpecialty} doctors found. Please try a different specialty.`);
        }
      }

    } catch (err) {
      console.error('❌ Error fetching doctors:', err);
      setError(err.message || 'Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [formattedSpecialty]);

  useEffect(() => {
    // Fetch doctors when specialty changes
    if (formattedSpecialty) {
      fetchDoctors();
    }
  }, [fetchDoctors, formattedSpecialty]);

  // Function to map doctor data to card props
  function mapDoctorToCardProps(doctor, index = 0) {
    const userName = doctor.user?.name || doctor.name || 'Doctor';
    const userSpecialty = doctor.specialty || doctor.keySpecialization?.[0] || 'General';
    const consultationFee = doctor.consultationFee || doctor.fee || 0;
    const doctorImage = doctor.profileImage || doctor.user?.profileImage || '/icons/doctor.png';
    const city = doctor.address?.city || 'India';
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
            Finding {formattedSpecialty} Doctors...
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
              onClick={() => navigate('/specialists')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Back to Specialties
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
        

        <div className="max-w-7xl mx-auto">
          <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-center">
            {doctors.length > 0 ?
              `${doctors.length} ${formattedSpecialty} doctors found` :
              `${formattedSpecialty} Doctors`
            }
          </h2>

          {/* Empty state */}
          {doctors.length === 0 && !loading && (
            <div className="text-center py-6 sm:py-8 bg-yellow-50 rounded-lg border border-yellow-200 mx-4 sm:mx-0">
              <div className="text-3xl sm:text-4xl mb-3">🏥</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No {formattedSpecialty} Doctors Found</h3>
              <p className="text-gray-600 text-sm px-4 sm:px-0">
                We couldn't find any {formattedSpecialty} doctors at the moment. Please try a different specialty or try again later.
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
    </div>
  );
}
