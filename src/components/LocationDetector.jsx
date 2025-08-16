// components/LocationDetector.js
import React from 'react';
import useLocationStore from '../stores/locationStore';

const LocationDetector = () => {
  const { 
    selectedLocation,
    coordinates,
    locationLoading,
    locationError,
    refreshLocation
  } = useLocationStore();

  if (locationLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-600">🔍 Detecting your location...</span>
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-600 font-medium">Location Error</span>
          </div>
          <p className="text-red-500 text-sm mt-1">{locationError}</p>
          <p className="text-gray-600 text-xs mt-1">Using default location: {selectedLocation}</p>
        </div>
        <button
          onClick={refreshLocation}
          className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-4">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-green-700 font-medium">📍 Location: {selectedLocation}</span>
        </div>
        {coordinates.lat && coordinates.lng && (
          <p className="text-green-600 text-xs mt-1">
            GPS: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
          </p>
        )}
      </div>
      <button
        onClick={refreshLocation}
        className="ml-4 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
      >
        🔄 Update
      </button>
    </div>
  );
};

export default LocationDetector;
