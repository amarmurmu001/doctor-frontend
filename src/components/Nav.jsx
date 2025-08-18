import React, { useEffect } from 'react';
import useLocationStore from '../stores/locationStore';

function Nav() {
  const {
    selectedLocation,
    availableLocations,
    updateLocation,
    setCoordinates,
    locationLoading,
  } = useLocationStore();

  // Prompt for GPS at component mount or when explicitly triggered
  useEffect(() => {
    if (!selectedLocation && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        pos => {
          setCoordinates({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          updateLocation('Current Location');
        },
        err => {
          // If denied, fallback to manual entry
        }
      );
    }
  }, [selectedLocation, setCoordinates, updateLocation]);

  const handleLocationChange = (e) => {
    updateLocation(e.target.value);
  };

  return (
    <div className="relative flex items-center justify-between p-2 px-4 md:p-4 md:px-10 bg-[#7551B2]">
      {/* Left: Location Dropdown */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={selectedLocation || ''}
            onChange={handleLocationChange}
            disabled={locationLoading}
            className="appearance-none bg-transparent text-white font-medium outline-none px-4 py-1 pr-8 rounded-md cursor-pointer transition-all duration-300 ease-in-out disabled:opacity-50"
          >
            <option value="" className='text-black'>Select Location</option>

            {availableLocations.map( (location) => (
              <option key={location} value={location} className="bg-white text-black">
                {location}
              </option>
            ))}
          </select>
          <svg
            className="w-4 h-4 text-white absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Center: Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src="icons/logo.png" alt="Doctar" className="w-24 h-auto" />
      </div>

      {/* Right: Profile Image */}
      <div className="w-8 h-10 rounded-full overflow-hidden">
        <img src="profile.png" alt="Profile" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default Nav;
