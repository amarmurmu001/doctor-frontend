import React, { useState, useEffect } from 'react';

const GeolocationPicker = ({ 
  onLocationSelect, 
  initialLocation = null,
  address = '',
  className = '' 
}) => {
  const [selectedCoords, setSelectedCoords] = useState(initialLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [manualCoords, setManualCoords] = useState({
    lat: initialLocation?.lat || '',
    lng: initialLocation?.lng || ''
  });

  useEffect(() => {
    if (initialLocation) {
      setSelectedCoords(initialLocation);
      setManualCoords({
        lat: initialLocation.lat.toString(),
        lng: initialLocation.lng.toString()
      });
    }
  }, [initialLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError('');
    setLocationStatus('Getting your location...');

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000 // Cache for 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setSelectedCoords(coords);
        setManualCoords({
          lat: coords.lat.toString(),
          lng: coords.lng.toString()
        });
        setLocationStatus(`Location found! Accuracy: ${Math.round(position.coords.accuracy)}m`);
        setIsLoading(false);
        
        if (onLocationSelect) {
          onLocationSelect(coords);
        }
      },
      (error) => {
        setIsLoading(false);
        let errorMessage = 'Unable to get current location: ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'Unknown error occurred.';
            break;
        }
        
        setError(errorMessage);
        setLocationStatus('');
      },
      options
    );
  };

  const handleManualCoordinateChange = (field, value) => {
    setManualCoords(prev => ({ ...prev, [field]: value }));
  };

  const applyManualCoordinates = () => {
    const lat = parseFloat(manualCoords.lat);
    const lng = parseFloat(manualCoords.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid latitude and longitude values');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }
    
    const coords = { lat, lng };
    setSelectedCoords(coords);
    setError('');
    setLocationStatus('Manual coordinates applied');
    
    if (onLocationSelect) {
      onLocationSelect(coords);
    }
  };

  const clearLocation = () => {
    setSelectedCoords(null);
    setManualCoords({ lat: '', lng: '' });
    setLocationStatus('');
    setError('');
    
    if (onLocationSelect) {
      onLocationSelect(null);
    }
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Clinic Location
        </label>
        <p className="text-xs text-gray-600 mb-3">
          Use your current location or enter coordinates manually to pinpoint your clinic's exact location
        </p>
      </div>

      {/* Current Location Section */}
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Auto-detect Location</h4>
        
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="w-full bg-[#7551B2] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6441a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Getting Location...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use Current Location
            </>
          )}
        </button>

        {locationStatus && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            {locationStatus}
          </div>
        )}
      </div>

      {/* Manual Coordinates Section */}
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Manual Coordinates</h4>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              placeholder="e.g., 28.6139"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none"
              value={manualCoords.lat}
              onChange={(e) => handleManualCoordinateChange('lat', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              placeholder="e.g., 77.2090"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none"
              value={manualCoords.lng}
              onChange={(e) => handleManualCoordinateChange('lng', e.target.value)}
            />
          </div>
        </div>
        
        <button
          onClick={applyManualCoordinates}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded font-medium hover:bg-gray-700 transition-colors text-sm"
        >
          Apply Coordinates
        </button>
        
        <p className="text-xs text-gray-500 mt-2">
          You can find coordinates using Google Maps or other mapping services
        </p>
      </div>

      {/* Address Display */}
      {address && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">Address</h4>
          <p className="text-sm text-gray-600">{address}</p>
        </div>
      )}

      {/* Selected Coordinates Display */}
      {selectedCoords && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-semibold text-green-800 mb-1">Selected Location</h4>
              <p className="text-sm text-green-700">
                <span className="font-medium">Latitude:</span> {selectedCoords.lat.toFixed(6)}<br />
                <span className="font-medium">Longitude:</span> {selectedCoords.lng.toFixed(6)}
              </p>
            </div>
            <button
              onClick={clearLocation}
              className="text-green-600 hover:text-green-800 text-sm underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              {error.includes('denied') && (
                <p className="text-xs text-red-600 mt-1">
                  To use auto-location, please allow location access in your browser settings and refresh the page.
                </p>
              )}
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">How to get coordinates:</h4>
        <ol className="text-xs text-blue-700 space-y-1">
          <li>1. Use the "Use Current Location" button (recommended)</li>
          <li>2. Or open Google Maps, right-click your clinic location</li>
          <li>3. Click on the coordinates that appear</li>
          <li>4. Copy and paste the latitude and longitude values above</li>
        </ol>
      </div>
    </div>
  );
};

export default GeolocationPicker;
