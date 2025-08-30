import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocationStore from '../../stores/locationStore';

export default function SearchBar({ 
  placeholder = "Search doctors, specialties, locations...", 
  onSearch 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const { selectedLocation } = useLocationStore();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Use existing /api/doctors endpoint for suggestions
  useEffect(() => {
    async function fetchSuggestions() {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
        
        // ✅ Use the existing doctors endpoint with search parameter and approval filter
        const params = new URLSearchParams();
        params.set('search', searchTerm);
        params.set('status', 'approved'); // Only show approved doctors
        if (selectedLocation) params.set('city', selectedLocation.toLowerCase());
        params.set('limit', '5'); // Limit to 5 suggestions
        
        const response = await fetch(`${API_BASE_URL}/api/doctors?${params}`);
        
        if (!response.ok) {
          console.warn('Search suggestions failed:', response.status);
          setSuggestions([]);
          return;
        }
        
        const data = await response.json();
        console.log('✅ Suggestions data:', data);
        
        // ✅ Process doctors data into suggestions (only approved doctors)
        const doctors = Array.isArray(data) ? data : (data.data || []);
        const approvedDoctors = doctors.filter(doctor => doctor.status === 'approved');
        const doctorSuggestions = approvedDoctors.map(doctor => ({
          type: 'doctor',
          text: `Dr. ${doctor.user?.name || doctor.name}`,
          value: doctor.user?.name || doctor.name,
          specialty: doctor.specialty,
          id: doctor._id
        }));
        
        // ✅ Add specialty suggestions (unique from approved doctors)
        const specialties = [...new Set(approvedDoctors.map(d => d.specialty).filter(Boolean))];
        const specialtySuggestions = specialties.map(specialty => ({
          type: 'specialty',
          text: specialty,
          value: specialty
        }));
        
        // ✅ Combine all suggestions
        const allSuggestions = [
          ...doctorSuggestions.slice(0, 3),
          ...specialtySuggestions.slice(0, 2)
        ];
        
        setSuggestions(allSuggestions);
      } catch (error) {
        console.error('❌ Suggestions error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }
    
    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedLocation]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
    
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        executeSearch(searchTerm);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(suggestions[highlightedIndex]);
        } else {
          executeSearch(searchTerm);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (suggestion) => {
    setSearchTerm(suggestion.value);
    setShowSuggestions(false);
    executeSearch(suggestion.value, suggestion.type);
  };

  const executeSearch = (value, type = null) => {
    if (value.trim()) {
      const params = new URLSearchParams({ q: value.trim() });
      if (type) params.set('type', type);
      if (selectedLocation) params.set('location', selectedLocation);
      
      navigate(`/search?${params.toString()}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // ✅ Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Suggestion icons removed - cleaner design

  return (
    <div className="flex items-center bg-white rounded-full w-full max-w-md shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Search Icon */}
      <div className="p-2 mx-1">
        <img 
          src="/icons/Search.png"
          alt="Search"
          className="w-5 h-5 object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '🔍';
          }}
        />
      </div>

      {/* Input Container */}
      <div className="relative flex-1" ref={inputRef}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400 focus:placeholder-gray-300 transition-colors duration-200"
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 flex items-center justify-center"
            aria-label="Clear search"
          >
            ×
          </button>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white mt-2 rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`group w-full text-left px-4 py-3 hover:bg-[#7551B2] hover:text-white transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                  highlightedIndex === index ? 'bg-[#7551B2] text-white' : 'text-gray-700'
                }`}
              >
                <div className="flex-1">
                  <div className={`font-medium ${highlightedIndex === index ? 'text-white' : 'text-gray-900'} group-hover:text-white`}>
                    {suggestion.text}
                  </div>
                  {suggestion.specialty && (
                    <div className={`text-xs ${highlightedIndex === index ? 'text-purple-100' : 'text-gray-500'} group-hover:text-purple-100`}>
                      {suggestion.specialty}
                    </div>
                  )}
                </div>
              </button>
            ))}
            
            {loading && (
              <div className="px-4 py-3 text-center text-gray-500">
                <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                Loading suggestions...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Language Button */}
      <div className="bg-[#1F1F1F] text-white text-sm w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-800 transition-colors duration-200 ">
        En
      </div>
    </div>
  );
}
