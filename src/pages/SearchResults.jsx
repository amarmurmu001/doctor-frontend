import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DoctorCard from '../components/doctor/DoctorCard';
import SearchBar from '../components/search/SearchBar';
import useLocationStore from '../stores/locationStore';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedLocation } = useLocationStore();
  
  const searchTerm = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || '';
  const searchLocation = searchParams.get('location') || selectedLocation;
  
  const [doctors, setDoctors] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!searchTerm) return;
    fetchSearchResults();
  }, [searchTerm, searchType, searchLocation]);

  async function fetchSearchResults() {
    setLoading(true);
    setError('');
    
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const params = new URLSearchParams();
      
      // ✅ Use existing API parameters
      params.set('search', searchTerm);
      if (searchLocation) params.set('city', searchLocation.toLowerCase());
      if (searchType === 'specialty') params.set('specialty', searchTerm);
      
      console.log('🔍 Searching:', `${API_BASE_URL}/api/doctors?${params}`);
      
      const response = await fetch(`${API_BASE_URL}/api/doctors?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Search failed`);
      }
      
      const data = await response.json();
      console.log('✅ Search results:', data);
      
      // ✅ Handle response format
      const doctorsData = Array.isArray(data) ? data : (data.data || []);
      setDoctors(doctorsData);
      setTotalResults(data.total || doctorsData.length);
      
    } catch (err) {
      console.error('❌ Search error:', err);
      setError(err.message || 'Failed to search');
      setDoctors([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }

  function handleNewSearch(newSearchTerm) {
    const params = new URLSearchParams();
    if (newSearchTerm) params.set('q', newSearchTerm);
    if (searchLocation) params.set('location', searchLocation);
    setSearchParams(params);
  }

  return (
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
      </div>
    </div>
  );
};

export default SearchResults;
