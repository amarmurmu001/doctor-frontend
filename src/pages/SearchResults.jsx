import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DoctorCard from '../components/doctor/DoctorCard';

import useLocationStore from '../stores/locationStore';
import PageSeo from '../components/seo/PageSeo';
import DynamicFAQ from '../components/FAQ/DynamicFAQ';

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectedLocation } = useLocationStore();
  
  const searchTerm = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || '';
  const searchLocation = searchParams.get('location') || selectedLocation;
  
  const [doctors, setDoctors] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSearchResults = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const params = new URLSearchParams();
      
      // ✅ Use existing API parameters with approval filter
      params.set('search', searchTerm);
      params.set('status', 'approved'); // Only show approved doctors
      if (searchLocation) params.set('city', searchLocation.toLowerCase());
      if (searchType === 'specialty') params.set('specialty', searchTerm);
      
      console.log('🔍 Searching:', `${API_BASE_URL}/api/doctors?${params}`);
      
      const response = await fetch(`${API_BASE_URL}/api/doctors?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Search failed`);
      }
      
      const data = await response.json();
      console.log('✅ Search results:', data);
      
      // ✅ Handle response format and filter for approved doctors
      const doctorsData = Array.isArray(data) ? data : (data.data || []);
      const approvedDoctors = doctorsData.filter(doctor => doctor.status === 'approved');
      setDoctors(approvedDoctors);
      setTotalResults(data.total || approvedDoctors.length);
      
    } catch (err) {
      console.error('❌ Search error:', err);
      setError(err.message || 'Failed to search');
      setDoctors([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, searchLocation, searchType]);

  useEffect(() => {
    if (!searchTerm) return;
    fetchSearchResults();
  }, [searchTerm, searchType, searchLocation, fetchSearchResults]);

  // Function to detect if search term is likely a doctor name
  const isDoctorName = (searchTerm) => {
    if (!searchTerm) return false;
    
    const term = searchTerm.toLowerCase().trim();
    
    // Check if it starts with common doctor prefixes
    const doctorPrefixes = ['dr.', 'dr ', 'doctor '];
    if (doctorPrefixes.some(prefix => term.startsWith(prefix))) {
      return true;
    }
    
    // Check if it contains multiple words (likely a name)
    const words = term.split(' ').filter(word => word.length > 0);
    if (words.length >= 2) {
      // Check if any word looks like a common first/last name pattern
      const namePatterns = /^[a-z]+$/;
      const hasNameLikeWords = words.some(word => namePatterns.test(word) && word.length >= 3);
      
      // Check if it doesn't contain common specialty terms
      const specialtyTerms = ['cardiologist', 'dermatologist', 'pediatrician', 'gynecologist', 'neurologist', 
                              'orthopedic', 'psychiatrist', 'surgeon', 'physician', 'specialist', 'therapy', 
                              'treatment', 'clinic', 'hospital', 'medicine', 'surgery'];
      const hasSpecialtyTerms = words.some(word => specialtyTerms.includes(word));
      
      return hasNameLikeWords && !hasSpecialtyTerms;
    }
    
    return false;
  };

  // Function to detect if search term is likely a specialty
  const isSpecialty = (searchTerm) => {
    if (!searchTerm) return false;
    
    const term = searchTerm.toLowerCase().trim();
    
    // Common medical specialties
    const specialties = [
      'cardiologist', 'dermatologist', 'pediatrician', 'gynecologist', 'neurologist',
      'orthopedic', 'psychiatrist', 'surgeon', 'physician', 'dentist', 'ent',
      'ophthalmologist', 'urologist', 'oncologist', 'radiologist', 'pathologist',
      'anesthesiologist', 'emergency', 'internal medicine', 'family medicine',
      'cardiology', 'dermatology', 'pediatrics', 'gynecology', 'neurology',
      'orthopedics', 'psychiatry', 'surgery', 'dentistry', 'ophthalmology'
    ];
    
    return specialties.some(specialty => 
      term.includes(specialty) || specialty.includes(term)
    );
  };

  // Determine relevant FAQ categories based on search context
  const determineRelevantCategories = (searchTerm, searchType, totalResults) => {
    const categories = ['general', 'patients'];
    
    // Add appointments category if results found
    if (totalResults > 0) {
      categories.push('appointments');
    }
    
    // Add doctors category for specialty searches or general doctor searches
    if (searchType === 'specialty' || 
        isSpecialty(searchTerm) || 
        (searchTerm && searchTerm.toLowerCase().includes('doctor'))) {
      categories.push('doctors');
    }
    
    // Add support category for general searches with no results
    if (totalResults === 0) {
      categories.push('support');
    }
    
    return categories;
  };



  // Generate dynamic SEO based on search
  const searchTitle = searchTerm 
    ? `Search Results for "${searchTerm}" | Find Doctors | Doctar`
    : 'Search Doctors | Find Medical Specialists | Doctar';
  
  const searchDescription = searchTerm
    ? `Find doctors for "${searchTerm}" ${searchLocation ? `in ${searchLocation}` : ''}. Book appointments with verified medical specialists. ${totalResults} results found.`
    : 'Search for doctors and medical specialists. Find the right doctor for your needs and book appointments online.';

  return (
    <>
      <PageSeo 
        title={searchTitle}
        description={searchDescription}
        keywords={`${searchTerm}, doctors near me, medical specialist, book appointment, ${searchLocation || 'India'}`}
        canonicalUrl={`https://www.doctar.in/search?q=${encodeURIComponent(searchTerm)}`}
        noIndex={!searchTerm} // Don't index empty search pages
      />
      
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Summary */}
      <div className="mb-6">
  <h1 className="text-2xl font-bold text-gray-900 mb-2">
    Search Results for "{searchTerm}"
  </h1>
  {!loading && (
    <div className="space-y-3">
      {/* SEO-friendly result summary */}
      <p className="text-gray-700 text-lg">
        Found {totalResults} doctor{totalResults !== 1 ? 's' : ''} 
        {searchLocation && <span> in {searchLocation}</span>}
        {searchType && <span> for {searchType}</span>}
      </p>
    </div>
  )}
</div>


        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">
              <strong>Search Failed:</strong> {error}
              <button 
                onClick={() => fetchSearchResults()}
                className="ml-4 bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {doctors.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-6">
                  Try different keywords or check spelling
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Go Home
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id || doctor.id}
                    name={doctor.user?.name || doctor.name}
                    specialty={doctor.specialty}
                    price={doctor.consultationFee 
                      ? `₹${doctor.consultationFee}/Consultation` 
                      : 'Contact for fee'
                    }
                    image={doctor.profilePicture?.url || '/icons/doctor.png'}
                    doctorId={doctor._id || doctor.id}
                    city={doctor.city}
                    slug={doctor.slug}
                    yearsOfExperience={doctor.yearsOfExperience}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* FAQ Section */}
        
      </div>
      {!loading && (
          <div className="mt-12 bg-[#7551B2] py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {(() => {
                    if (searchTerm && searchLocation) {
                      if (isDoctorName(searchTerm)) {
                        return `FAQs about finding Dr. ${searchTerm} in ${searchLocation}`;
                      } else if (isSpecialty(searchTerm)) {
                        return `FAQs about ${searchTerm} specialists in ${searchLocation}`;
                      } else {
                        return `FAQs about ${searchTerm} in ${searchLocation}`;
                      }
                    } else if (searchTerm) {
                      if (isDoctorName(searchTerm)) {
                        return `FAQs about finding Dr. ${searchTerm}`;
                      } else if (isSpecialty(searchTerm)) {
                        return `FAQs about ${searchTerm} specialists`;
                      } else {
                        return `FAQs about ${searchTerm}`;
                      }
                    } else if (searchLocation) {
                      return `FAQs about doctors in ${searchLocation}`;
                    } else {
                      return "Frequently Asked Questions";
                    }
                  })()}
                </h2>
                <p className="text-white/80">
                  {totalResults > 0 ? (() => {
                    if (isDoctorName(searchTerm)) {
                      return `Get answers to common questions about finding and booking appointments with doctors like ${searchTerm} ${searchLocation ? `in ${searchLocation}` : ''}`;
                    } else if (isSpecialty(searchTerm)) {
                      return `Get answers to common questions about finding ${searchTerm} specialists ${searchLocation ? `in ${searchLocation}` : ''}`;
                    } else {
                      return `Get answers to common questions about finding ${searchTerm || 'doctors'} ${searchLocation ? `in ${searchLocation}` : ''}`;
                    }
                  })() : "Get answers to common questions about finding doctors"}
                </p>
              </div>
              <DynamicFAQ
                categories={determineRelevantCategories(searchTerm, searchType, totalResults)}
                location={searchLocation}
                specialty={(searchType === 'specialty' || isSpecialty(searchTerm)) && !isDoctorName(searchTerm) ? searchTerm : null}
                searchContext={{
                  searchTerm,
                  searchType: isDoctorName(searchTerm) ? 'doctor_name' : isSpecialty(searchTerm) ? 'specialty' : searchType,
                  totalResults,
                  hasResults: totalResults > 0,
                  isDoctorName: isDoctorName(searchTerm),
                  isSpecialty: isSpecialty(searchTerm)
                }}
                maxItems={totalResults > 0 ? 8 : 6}
                title=""
                searchable={false}
                className="bg-transparent shadow-none border-none"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;
