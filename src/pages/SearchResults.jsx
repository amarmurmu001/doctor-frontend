import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DoctorCard from '../components/doctor/DoctorCard';

import PageSeo from '../components/seo/PageSeo';
import DynamicFAQ from '../components/FAQ/DynamicFAQ';
import ClearYourDoubts from '../components/FAQ/ClearYourDoubts';

// ✅ Enhanced strict keyword filtering function with improved accuracy
const strictKeywordFilter = (doctors, searchTerm, searchType) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return doctors; // Return all doctors if no search term
  }

  const term = searchTerm.toLowerCase().trim();
  const normalizedTerm = normalizeMedicalTerm(term);
  const searchWords = term.split(' ').filter(word => word.length > 0);
  const normalizedWords = normalizedTerm.split(' ').filter(word => word.length > 0);

  // Score and filter doctors based on relevance
  const scoredDoctors = doctors.map(doctor => {
    let score = 0;
    let matchType = 'none';

    // Get all searchable fields from the doctor
    const doctorName = (doctor.user?.name || doctor.name || '').toLowerCase();
    const doctorSpecialty = (doctor.specialty || '').toLowerCase();
    const doctorAbout = (doctor.about || '').toLowerCase();
    const doctorClinic = (doctor.clinicName || '').toLowerCase();
    const doctorCity = (doctor.city || doctor.address?.city || '').toLowerCase();
    const doctorLanguages = (doctor.languages || []).join(' ').toLowerCase();
    const doctorEducation = (doctor.education || []).join(' ').toLowerCase();
    const doctorExperience = (doctor.experience || []).join(' ').toLowerCase();
    const doctorServices = (doctor.services || []).join(' ').toLowerCase();
    const doctorKeySpecializations = (doctor.keySpecialization || []).join(' ').toLowerCase();

    // Enhanced specialty detection
    if (searchType === 'specialty' || isSpecialty(searchTerm)) {
      matchType = 'specialty';

      // Exact specialty match (highest priority)
      if (doctorSpecialty.includes(term) ||
          doctorSpecialty.includes(normalizedTerm) ||
          doctorKeySpecializations.includes(term) ||
          doctorKeySpecializations.includes(normalizedTerm) ||
          doctorServices.includes(term) ||
          doctorServices.includes(normalizedTerm)) {
        score += 100;
      }

      // Fuzzy specialty matching
      if (fuzzySpecialtyMatch(term, doctorSpecialty) ||
          fuzzySpecialtyMatch(normalizedTerm, doctorSpecialty) ||
          fuzzySpecialtyMatch(term, doctorKeySpecializations) ||
          fuzzySpecialtyMatch(normalizedTerm, doctorKeySpecializations) ||
          fuzzySpecialtyMatch(term, doctorServices) ||
          fuzzySpecialtyMatch(normalizedTerm, doctorServices)) {
        score += 50;
      }

      // Word-by-word specialty matching
      normalizedWords.forEach(word => {
        if (doctorSpecialty.includes(word) ||
            doctorKeySpecializations.includes(word) ||
            doctorServices.includes(word)) {
          score += 25;
        }
      });

      // Must have specialty match for specialty searches
      if (score === 0) return null;
    }

    // Enhanced doctor name matching
    else if (isDoctorName(searchTerm)) {
      matchType = 'name';

      // Exact name match
      if (doctorName === term) {
        score += 100;
      }
      // Partial name match
      else if (doctorName.includes(term)) {
        score += 80;
      }
      // Word-by-word name matching
      else if (doctorName.split(' ').some(namePart =>
        searchWords.some(word => namePart.includes(word) && word.length > 2))) {
        score += 60;
      }

      // Must have name match for name searches
      if (score === 0) return null;
    }

    // General search with improved accuracy
    else {
      matchType = 'general';

      // Name matches (highest priority)
      if (doctorName.includes(term)) {
        score += 90;
        matchType = 'name_in_general';
      }

      // Specialty matches (high priority)
      if (doctorSpecialty.includes(term) ||
          doctorSpecialty.includes(normalizedTerm) ||
          doctorKeySpecializations.includes(term) ||
          doctorKeySpecializations.includes(normalizedTerm) ||
          doctorServices.includes(term) ||
          doctorServices.includes(normalizedTerm)) {
        score += 80;
        matchType = 'specialty_in_general';
      }

      // Fuzzy specialty matching
      if (fuzzySpecialtyMatch(term, doctorSpecialty) ||
          fuzzySpecialtyMatch(normalizedTerm, doctorSpecialty) ||
          fuzzySpecialtyMatch(term, doctorKeySpecializations) ||
          fuzzySpecialtyMatch(normalizedTerm, doctorKeySpecializations) ||
          fuzzySpecialtyMatch(term, doctorServices) ||
          fuzzySpecialtyMatch(normalizedTerm, doctorServices)) {
        score += 40;
      }

      // Clinic name matches
      if (doctorClinic.includes(term)) {
        score += 70;
        matchType = 'clinic_in_general';
      }

      // About/description matches
      if (doctorAbout.includes(term)) {
        score += 60;
        matchType = 'about_in_general';
      }

      // City/location matches
      if (doctorCity.includes(term)) {
        score += 50;
        matchType = 'location_in_general';
      }

      // Language matches
      if (doctorLanguages.includes(term)) {
        score += 30;
      }

      // Education matches
      if (doctorEducation.includes(term)) {
        score += 20;
      }

      // Word-by-word matching for multi-word searches
      [...searchWords, ...normalizedWords].forEach(word => {
        if (word.length > 2) { // Only check meaningful words
          const allText = [
            doctorName, doctorSpecialty, doctorAbout, doctorClinic,
            doctorCity, doctorLanguages, doctorEducation, doctorExperience,
            doctorServices, doctorKeySpecializations
          ].join(' ');

          if (allText.includes(word)) {
            score += 10;
          }
        }
      });

      // Additional fuzzy matching for partial words
      searchWords.forEach(word => {
        if (word.length > 3) {
          // Check for partial matches (e.g., "cardio" matches "cardiology")
          const allText = [
            doctorName, doctorSpecialty, doctorAbout, doctorClinic,
            doctorCity, doctorLanguages, doctorEducation, doctorExperience,
            doctorServices, doctorKeySpecializations
          ].join(' ');

          // Look for words that start with the search term
          const words = allText.split(' ');
          words.forEach(textWord => {
            if (textWord.startsWith(word) && textWord.length > word.length) {
              score += 5; // Smaller score for partial matches
            }
          });
        }
      });

      // Must have minimum score for general searches
      if (score < 10) return null;
    }

    return {
      doctor,
      score,
      matchType
    };
  }).filter(item => item !== null); // Remove null entries

  // Sort by score (highest first) and return doctors
  return scoredDoctors
    .sort((a, b) => b.score - a.score)
    .map(item => item.doctor);
};

// Fuzzy specialty matching for common variations and misspellings
const fuzzySpecialtyMatch = (searchTerm, doctorField) => {
  if (!searchTerm || !doctorField) return false;

  const term = searchTerm.toLowerCase().trim();
  const field = doctorField.toLowerCase();

  // Common specialty variations and abbreviations
  const specialtyMappings = {
    // Cardiology variations
    'cardio': ['cardiology', 'cardiologist', 'cardiovascular', 'heart'],
    'heart': ['cardiology', 'cardiologist', 'cardiovascular'],

    // Dermatology variations
    'derma': ['dermatology', 'dermatologist', 'skin'],
    'skin': ['dermatology', 'dermatologist'],

    // Pediatrics variations
    'pedia': ['pediatrics', 'pediatrician', 'child', 'children'],
    'child': ['pediatrics', 'pediatrician'],
    'kids': ['pediatrics', 'pediatrician'],

    // Gynecology variations
    'gyn': ['gynecology', 'gynecologist', 'women', 'obgyn'],
    'women': ['gynecology', 'gynecologist', 'obstetrics'],
    'obgyn': ['gynecology', 'obstetrics', 'gynecologist'],

    // Neurology variations
    'neuro': ['neurology', 'neurologist', 'brain', 'nervous'],
    'brain': ['neurology', 'neurologist'],

    // Orthopedics variations
    'ortho': ['orthopedics', 'orthopedic', 'bone', 'joint'],
    'bone': ['orthopedics', 'orthopedic'],
    'joint': ['orthopedics', 'orthopedic', 'rheumatology'],

    // Psychiatry variations
    'psych': ['psychiatry', 'psychiatrist', 'mental', 'mind'],
    'mental': ['psychiatry', 'psychiatrist', 'psychology'],
    'mind': ['psychiatry', 'psychiatrist'],

    // Dentistry variations
    'dental': ['dentistry', 'dentist', 'teeth', 'oral'],
    'teeth': ['dentistry', 'dentist', 'oral'],
    'oral': ['dentistry', 'dentist', 'oral surgery'],

    // General medicine variations
    'general': ['general medicine', 'family medicine', 'gp', 'physician'],
    'gp': ['general medicine', 'family medicine', 'physician'],
    'family': ['family medicine', 'general medicine'],

    // ENT variations
    'ent': ['ent', 'ear nose throat', 'otorhinolaryngology'],
    'ear': ['ent', 'ear nose throat'],
    'nose': ['ent', 'ear nose throat'],
    'throat': ['ent', 'ear nose throat'],

    // Eye variations
    'eye': ['ophthalmology', 'ophthalmologist', 'eye care'],
    'vision': ['ophthalmology', 'ophthalmologist'],

    // Surgery variations
    'surgery': ['surgeon', 'surgical', 'operation'],
    'surgeon': ['surgery', 'surgical'],

    // Alternative medicine
    'ayurveda': ['ayurvedic', 'ayurveda', 'traditional medicine'],
    'ayurvedic': ['ayurveda', 'traditional medicine'],
    'homeopathy': ['homeopathic', 'homeopathy', 'natural medicine'],
    'homeopathic': ['homeopathy', 'natural medicine'],
    'allopathy': ['allopathic', 'modern medicine', 'western medicine'],
    'allopathic': ['allopathy', 'modern medicine']
  };

  // Check if search term matches any specialty variations
  for (const [key, variations] of Object.entries(specialtyMappings)) {
    if (term.includes(key) || variations.some(v => term.includes(v))) {
      return variations.some(variation => field.includes(variation));
    }
  }

  // Check if field contains the search term or vice versa
  return field.includes(term) || term.includes(field);
};

// Helper function to detect if search term is likely a specialty
const isSpecialty = (searchTerm) => {
  if (!searchTerm) return false;

  const term = searchTerm.toLowerCase().trim();

  // Common medical specialties and their variations
  const specialties = [
    'cardiologist', 'dermatologist', 'pediatrician', 'gynecologist', 'neurologist',
    'orthopedic', 'psychiatrist', 'surgeon', 'physician', 'dentist', 'ent',
    'ophthalmologist', 'urologist', 'oncologist', 'radiologist', 'pathologist',
    'anesthesiologist', 'emergency', 'internal medicine', 'family medicine',
    'cardiology', 'dermatology', 'pediatrics', 'gynecology', 'neurology',
    'orthopedics', 'psychiatry', 'surgery', 'dentistry', 'ophthalmology',
    'general medicine', 'ayurvedic', 'homeopathy', 'allopathic',
    // Add common variations and abbreviations
    'cardio', 'derma', 'pedia', 'gyn', 'neuro', 'ortho', 'psych', 'gp',
    'obgyn', 'ent', 'eye', 'heart', 'skin', 'child', 'women', 'bone',
    'mental', 'dental', 'oral', 'family'
  ];

  return specialties.some(specialty =>
    term.includes(specialty) || specialty.includes(term)
  );
};

// Enhanced doctor name detection with better accuracy
const isDoctorName = (searchTerm) => {
  if (!searchTerm) return false;

  const term = searchTerm.toLowerCase().trim();
  const words = term.split(' ').filter(word => word.length > 0);

  // Check if it starts with common doctor prefixes
  const doctorPrefixes = ['dr.', 'dr ', 'doctor ', 'dr-', 'drs.', 'drs '];
  if (doctorPrefixes.some(prefix => term.startsWith(prefix))) {
    return true;
  }

  // Check for medical titles
  const medicalTitles = ['md', 'mbbs', 'ms', 'mch', 'dm', 'dnb', 'frcs', 'mrCP'];
  if (medicalTitles.some(title => term.includes(title))) {
    return false; // This is likely a qualification, not a name
  }

  // Check if it contains multiple words (likely a name)
  if (words.length >= 2) {
    // Common name patterns (first + last name)
    const namePattern = /^[a-z]{2,}$/; // At least 2 characters, only letters
    const hasValidNameWords = words.every(word =>
      namePattern.test(word) && word.length >= 2 && word.length <= 20
    );

    // Check if it doesn't contain common specialty terms
    const hasSpecialtyTerms = isSpecialty(searchTerm);

    // Additional check: if it looks like a proper name
    const looksLikeName = words.length <= 4 && // Typical name length
                         words.some(word => word.length >= 3) && // Has substantial words
                         !words.some(word => /\d/.test(word)); // No numbers

    return hasValidNameWords && !hasSpecialtyTerms && looksLikeName;
  }

  // Single word names (rare but possible)
  if (words.length === 1) {
    const singleWord = words[0];
    // Check if it's a common single-word doctor name or has name-like characteristics
    return singleWord.length >= 3 &&
           /^[a-z]+$/.test(singleWord) &&
           !isSpecialty(singleWord) &&
           !medicalTitles.includes(singleWord);
  }

  return false;
};

// Medical abbreviation and acronym handler
const normalizeMedicalTerm = (term) => {
  const abbreviations = {
    'cardio': 'cardiology',
    'derma': 'dermatology',
    'pedia': 'pediatrics',
    'gyn': 'gynecology',
    'neuro': 'neurology',
    'ortho': 'orthopedics',
    'psych': 'psychiatry',
    'gp': 'general physician',
    'ent': 'ear nose throat',
    'obgyn': 'obstetrics gynecology',
    'eye': 'ophthalmology',
    'kidney': 'nephrology',
    'liver': 'hepatology',
    'lung': 'pulmonology',
    'heart': 'cardiology',
    'skin': 'dermatology',
    'bone': 'orthopedics',
    'brain': 'neurology',
    'mental': 'psychiatry',
    'teeth': 'dentistry',
    'oral': 'dentistry',
    'women': 'gynecology',
    'child': 'pediatrics',
    'kids': 'pediatrics',
    'family': 'family medicine'
  };

  return abbreviations[term.toLowerCase()] || term;
};

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectedLocation } = useSelector((state) => state.location);
  
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

      // ✅ Implement strict keyword filtering
      const strictFilteredDoctors = strictKeywordFilter(approvedDoctors, searchTerm, searchType);

      setDoctors(strictFilteredDoctors);
      setTotalResults(strictFilteredDoctors.length);
      
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching doctors found</h3>
                <p className="text-gray-600 mb-4">
                  No doctors match your search criteria "{searchTerm}". Our search is strict to ensure relevant results.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Try searching for specific specialties like "Cardiology" or doctor names like "Dr. John Doe"
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate('/departments')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Browse Specialties
                  </button>
                <button
                  onClick={() => navigate('/')}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Go Home
                </button>
                </div>
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
                    languages={doctor.languages || ['English']}
                    ratingAverage={doctor.averageRating ||
                                   doctor.rating ||
                                   doctor.ratings ||
                                   doctor.totalRating ||
                                   doctor.average_rating ||
                                   doctor.ratingAverage ||
                                   (doctor.reviews && doctor.reviews.length > 0
                                     ? (doctor.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / doctor.reviews.length)
                                     : 0) ||
                                   0}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Clear your Doubts Section */}
        {!loading && !error && doctors.length > 0 && (
          <ClearYourDoubts />
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
