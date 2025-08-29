import React, { useState, useEffect, useRef } from 'react';

const MapLocationPicker = ({ 
  onLocationSelect, 
  initialLocation = null,
  address = '',
  className = '' 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [selectedCoords, setSelectedCoords] = useState(initialLocation);

  // Default location (India center)
  const defaultCenter = { lat: 20.5937, lng: 78.9629 };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      initializeMap();
    }
  }, [isLoaded, address]);

  const loadGoogleMapsScript = () => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps');
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!window.google || mapInstanceRef.current) return;

    const center = selectedCoords || defaultCenter;
    
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: selectedCoords ? 15 : 5,
      center: center,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;

    // Add click listener to map
    map.addListener('click', (event) => {
      const coords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setSelectedCoords(coords);
      updateMarker(coords);
      
      // Reverse geocode to get address
      reverseGeocode(coords);
      
      if (onLocationSelect) {
        onLocationSelect(coords);
      }
    });

    // If we have an address, geocode it
    if (address) {
      geocodeAddress(address);
    } else if (selectedCoords) {
      updateMarker(selectedCoords);
    }

    // Add current location button
    addCurrentLocationButton(map);
  };

  const updateMarker = (coords) => {
    if (!mapInstanceRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Add new marker
    markerRef.current = new window.google.maps.Marker({
      position: coords,
      map: mapInstanceRef.current,
      draggable: true,
      title: 'Clinic Location'
    });

    // Center map on marker
    mapInstanceRef.current.setCenter(coords);
    mapInstanceRef.current.setZoom(15);

    // Add drag listener to marker
    markerRef.current.addListener('dragend', (event) => {
      const newCoords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setSelectedCoords(newCoords);
      reverseGeocode(newCoords);
      
      if (onLocationSelect) {
        onLocationSelect(newCoords);
      }
    });
  };

  const geocodeAddress = (address) => {
    if (!window.google || !address) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const coords = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        setSelectedCoords(coords);
        updateMarker(coords);
        
        if (onLocationSelect) {
          onLocationSelect(coords);
        }
      }
    });
  };

  const reverseGeocode = (coords) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      if (status === 'OK' && results[0]) {
        console.log('Address found:', results[0].formatted_address);
      }
    });
  };

  const addCurrentLocationButton = (map) => {
    const locationButton = document.createElement('button');
    locationButton.textContent = '📍';
    locationButton.className = 'bg-white border-2 border-gray-300 rounded-lg w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-50 text-lg';
    locationButton.title = 'Get current location';
    locationButton.type = 'button';

    locationButton.addEventListener('click', () => {
      getCurrentLocation();
    });

    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setSelectedCoords(coords);
        updateMarker(coords);
        reverseGeocode(coords);
        
        if (onLocationSelect) {
          onLocationSelect(coords);
        }
      },
      (error) => {
        setError('Unable to get current location: ' + error.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  if (error) {
    return (
      <div className={`border border-red-300 rounded-lg p-4 bg-red-50 ${className}`}>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Clinic Location on Map
        </label>
        <p className="text-xs text-gray-600 mb-3">
          Click on the map to select your clinic's exact location, or use the 📍 button for current location
        </p>
      </div>
      
      <div className="relative">
        <div 
          ref={mapRef}
          className="w-full h-64 rounded-lg border border-gray-300"
          style={{ minHeight: '256px' }}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#7551B2] border-t-transparent mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {selectedCoords && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <span className="font-medium">Selected coordinates:</span><br />
            Latitude: {selectedCoords.lat.toFixed(6)}<br />
            Longitude: {selectedCoords.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapLocationPicker;
