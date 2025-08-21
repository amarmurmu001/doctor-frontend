import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocationStore from '../../stores/locationStore';
import useAuthStore from '../../stores/authStore';

function Nav() {
  const navigate = useNavigate();
  const {
    selectedLocation,
    availableLocations,
    updateLocation,
    setCoordinates,
    refreshLocation,
    locationLoading,
  } = useLocationStore();

  const user = useAuthStore(s => s.user);
  const token = useAuthStore(s => s.token);

  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

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
        }
        
      );
    }
  }, [selectedLocation, setCoordinates, updateLocation]);

  useEffect(() => {
    const onClickAway = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  const popularCities = ['Patna', 'Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Chennai', 'Pune'];

  return (
    <div className="relative flex items-center justify-between p-2 px-4 md:p-4 md:px-10 bg-[#7551B2]">
      {/* Left: Dynamic Location with dropdown */}
      <div className="flex items-center space-x-2" ref={panelRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1 rounded-md transition"
          title="Select location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M11.54 22.35a.75.75 0 0 0 .92 0c1.14-.87 2.67-2.2 4.04-3.78C18.92 16.82 21 14.2 21 11.25 21 6.7 17.52 3 12.75 3S4.5 6.7 4.5 11.25c0 2.95 2.08 5.57 4.5 7.32 1.37 1.58 2.9 2.9 4.04 3.78Zm1.21-9.6a3 3 0 1 0-4.5-3.9 3 3 0 0 0 4.5 3.9Z" clipRule="evenodd" />
          </svg>
          <span>{selectedLocation || (locationLoading ? 'Detecting location…' : 'Select location')}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}>
            <path fillRule="evenodd" d="M12 14.25a.75.75 0 0 1-.53-.22l-4.5-4.5a.75.75 0 0 1 1.06-1.06L12 12.44l3.97-3.97a.75.75 0 0 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-.53.22Z" clipRule="evenodd" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-4 top-full mt-2 w-72 sm:w-80 max-h-[70vh] overflow-auto bg-white shadow-xl rounded-2xl z-50 p-3">
            <button
              onClick={() => { if (!locationLoading) refreshLocation(); setOpen(false); }}
              className="w-full flex items-center gap-2 text-[#7551B2] hover:bg-[#f4f4ff] px-3 py-2 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
                <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v1.51a7.5 7.5 0 1 1-1.5 0V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
              Use current location
            </button>

            <div className="mt-3">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">Popular Cities</h4>
              <div className="grid grid-cols-4 gap-2">
                {popularCities.map((name) => (
                  <button key={name} onClick={() => { updateLocation(name); setOpen(false); }} className="rounded-lg overflow-hidden border hover:shadow-sm transition">
                    <div className="w-full h-12 bg-gray-100 flex items-center justify-center">
                      <img src="/icons/real-icon.png" alt="city" className="w-6 h-6 opacity-70" />
                    </div>
                    <div className="text-[10px] px-1 py-1 truncate">{name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-gray-500 mb-1">All in India</h4>
              <div className="divide-y">
                {(availableLocations && availableLocations.length ? availableLocations : popularCities).map((loc) => (
                  <button key={loc} onClick={() => { updateLocation(loc); setOpen(false); }} className="w-full flex items-center justify-between text-left text-sm py-2 hover:bg-gray-50 px-2">
                    <span>{loc}</span>
                    <span className="text-gray-400">›</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Center: Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src="/icons/logo.png" alt="Doctar" className="w-24 h-auto cursor-pointer" onClick={() => navigate('/')} />
      </div>

      {/* Right: Profile / Auth */}
      {token && user ? (
        <button
          onClick={() => navigate(user.role === 'doctor' ? '/Doctor-profile' : '/user-profile')}
          title={user.name || 'Profile'}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-[#7551B2] flex items-center justify-center font-semibold"
        >
          {(user.name || 'U').charAt(0).toUpperCase()}
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-md"
        >
          Login
        </button>
      )}
    </div>
  );
}

export default Nav;


