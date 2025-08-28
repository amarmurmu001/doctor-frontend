import React, { useState, useEffect, useRef } from "react";
import useLocationStore from "../../stores/locationStore";

const LocationPicker = ({
  className = "",
  showIcon = true,
  placeholder = "Select location",
  onLocationChange,
}) => {
  const {
    selectedLocation,
    availableLocations,
    updateLocation,
    refreshLocation,
    locationLoading,
    searchLocations,
    isValidLocation,
  } = useLocationStore();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const panelRef = useRef(null);

  // Handle location search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const suggestions = searchLocations(searchQuery);
      setLocationSuggestions(suggestions);
    } else {
      setLocationSuggestions([]);
    }
  }, [searchQuery, searchLocations]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClickAway = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

  const handleLocationSelect = (location) => {
    setSearchQuery("");
    setLocationSuggestions([]);
    setOpen(false);

    // Validate location before setting
    if (
      location === "Use current location" ||
      location === "Current Location"
    ) {
      refreshLocation();
    } else if (isValidLocation(location) || location === "Near me") {
      updateLocation(location);
      if (onLocationChange) {
        onLocationChange(location);
      }
    } else {
      console.warn("⚠️ Invalid location selected:", location);
      // Fall back to first available location
      if (availableLocations.length > 0) {
        updateLocation(availableLocations[0]);
        if (onLocationChange) {
          onLocationChange(availableLocations[0]);
        }
      }
    }
  };

     const popularCities = [
     "Jharkhand", // State option for better UX
     "Dhanbad",
     "Deoghar",
     "Kolkata",
     "Sahjahanpur",
     "Patna",
     "Delhi",
     "Mumbai",
     "Bengaluru",
     "Pune",
   ];

  // Filter and combine locations for dropdown
  const displayLocations =
    searchQuery.length >= 2
      ? locationSuggestions
      : popularCities.filter((city) => availableLocations.includes(city));

  return (
    <div className={`relative ${className}`} ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-[120px] md:w-[140px] items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1 rounded-md transition"
        title="Select location"
      >
        {showIcon && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
        )}
        <span className="text-sm truncate">
          {selectedLocation || placeholder}
          {locationLoading && <span className="ml-1">...</span>}
        </span>
        <svg
          className={`w-3 h-3 text-white transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-lg shadow-xl border z-50">
          {/* Search Location Input */}
          <div className="border-b border-gray-200 p-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                autoFocus
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setLocationSuggestions([]);
                  }}
                  className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* GPS Location Option */}
          <div className="border-b border-gray-200 p-2">
            <button
              onClick={() => handleLocationSelect("Use current location")}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-blue-50 rounded-lg group"
              disabled={locationLoading}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  locationLoading
                    ? "bg-blue-100 animate-pulse"
                    : "bg-blue-100 group-hover:bg-blue-200"
                }`}
              >
                {locationLoading ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    />
                    <circle cx="12" cy="9" r="2.5" fill="currentColor" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 1v2m0 18v2M1 12h2m18 0h2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {locationLoading
                    ? "Getting location..."
                    : "Use current location"}
                </div>
                <div className="text-xs text-gray-500">
                  Auto-detect using GPS
                </div>
              </div>
            </button>
          </div>

          {/* Locations List */}
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2 uppercase tracking-wide">
              {searchQuery.length >= 2 ? "Search Results" : "Popular Cities"}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {displayLocations.length > 0 ? (
                displayLocations.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleLocationSelect(city)}
                    className={`w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors ${
                      selectedLocation === city
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className="font-medium">{city}</span>
                      {selectedLocation === city && (
                        <svg
                          className="w-4 h-4 text-purple-600 ml-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))
              ) : searchQuery.length >= 2 ? (
                <div className="p-3 text-center text-gray-500">
                  <div className="text-4xl mb-2">🏙️</div>
                  <div className="text-sm">
                    No cities found matching "{searchQuery}"
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Try a different spelling or nearby city
                  </div>
                </div>
              ) : (
                <div className="p-3 text-center text-gray-500">
                  <div className="text-sm">Start typing to search cities</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
