import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocationStore from "../../stores/locationStore";
import useAuthStore from "../../stores/useAuthStore";
import SearchBar from "../search/SearchBar";

function Nav() {
  const navigate = useNavigate();
  const {
    selectedLocation,
    availableLocations,
    updateLocation,
    refreshLocation,
    locationLoading,
  } = useLocationStore();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const panelRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const onClickAway = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

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

  return (
    <div className="sticky top-0 z-10  shadow-2xl flex items-center justify-between p-2 px-4 md:p-4 md:px-10 bg-[#7551B2] ">
      
      {/* LEFT CLUSTER: On desktop, show logo then location; on mobile, only location */}
      <div className="flex items-center gap-3">
        {/* Desktop logo at far-left */}
        <div className="hidden md:block">
          <img
            src="/icons/logo.png"
            alt="Doctar"
            className="w-32 h-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Location selector (mobile and desktop) */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex w-[120px] md:w-[140px] items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1 rounded-md transition"
            title="Select location"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="flex-shrink-0 w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.35a.75.75 0 0 0 .92 0c1.14-.87 2.67-2.2 4.04-3.78C18.92 16.82 21 14.2 21 11.25 21 6.7 17.52 3 12.75 3S4.5 6.7 4.5 11.25c0 2.95 2.08 5.57 4.5 7.32 1.37 1.58 2.9 2.9 4.04 3.78Zm1.21-9.6a3 3 0 1 0-4.5-3.9 3 3 0 0 0 4.5 3.9Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="overflow-hidden whitespace-nowrap truncate">
              {selectedLocation ||
                (locationLoading ? "Detecting..." : "Location")}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`flex-shrink-0 w-4 h-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            >
              <path
                fillRule="evenodd"
                d="M12 14.25a.75.75 0 0 1-.53-.22l-4.5-4.5a.75.75 0 0 1 1.06-1.06L12 12.44l3.97-3.97a.75.75 0 0 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-.53.22Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute transition-all duration-300 left-0 md:left-4 top-full mt-2 w-72 sm:w-80 max-h-[70vh] overflow-auto bg-white shadow-xl rounded-2xl z-50 p-3">
              <button
                onClick={() => {
                  if (!locationLoading) refreshLocation();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 text-[#7551B2] hover:bg-[#f4f4ff] px-3 py-2 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" fill="currentColor" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 1v2m0 18v2M1 12h2m18 0h2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
                </svg>
                Use current location
              </button>

              <div className="mt-3">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">
                  Popular Cities
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {popularCities.map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        updateLocation(name);
                        setOpen(false);
                      }}
                      className="rounded-lg overflow-hidden border hover:shadow-sm transition"
                    >
                      <div className="w-full h-12 bg-gray-100 flex items-center justify-center">
                        <img src="" alt="city" className="w-6 h-6 opacity-70" />
                      </div>
                      <div className="text-[10px] px-1 py-1 truncate">
                        {name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-500 mb-1">
                  All in India
                </h4>
                <div className="divide-y">
                  {(availableLocations && availableLocations.length
                    ? availableLocations
                    : popularCities
                  ).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        updateLocation(loc);
                        setOpen(false);
                      }}
                      className="w-full flex items-center justify-between text-left text-sm py-2 hover:bg-gray-50 px-2"
                    >
                      <span>{loc}</span>
                      <span className="text-gray-400">›</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Search bar for desktop only */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-full max-w-md">
        <SearchBar />
      </div>

      {/* Mobile: centered logo */}
      <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
        <img
          src="/icons/logo.png"
          alt="Doctar"
          className="w-24 h-auto cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* RIGHT: Profile / Auth */}
      <div className="flex items-center space-x-3">
        {token && user ? (
          <div className="flex items-center space-x-2">
            {/* Desktop: Show greeting */}
            <div className="hidden md:flex items-center space-x-1">
              <span className="text-white font-medium">Hi,</span>
              <span className="text-white font-medium">{user.name}</span>
            </div>
            <button
              onClick={() =>
                navigate(
                  user.role === "doctor" ? "/Doctor-profile" : "/user-profile"
                )
              }
              title={user.name || "Profile"}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-[#7551B2] flex items-center justify-center font-semibold"
            >
              {(user.name || "U").charAt(0).toUpperCase()}
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => navigate("/login")}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth/signup")}
                className="bg-white hover:bg-white/90 text-[#7551B2] px-4 py-2 rounded-md font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </>
        )}

        {/* Mobile menu button */}
        <div className="md:hidden relative" ref={mobileMenuRef}>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="ml-2 p-2 text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 18h16v-2H4v2zm0-5h16v-2H4v2zm0-7v2h16V6H4z"/>
            </svg>
          </button>

          {/* Mobile Menu Dropdown */}
          <div className={`absolute right-0 top-full mt-2 w-72 bg-white shadow-2xl rounded-xl z-50 overflow-hidden transform transition-all duration-300 ease-out ${
            mobileMenuOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}>
              {token && user ? (
                <>
                  {/* User Info Section */}
                  <div className="bg-gradient-to-r from-[#7551B2] to-[#6441a0] text-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold text-lg">
                        {(user.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">Hi, {user.name}!</p>
                        <p className="text-sm text-white/80 capitalize">{user.role || 'User'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate(user.role === "doctor" ? "/Doctor-profile" : "/user-profile");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-3"
                    >
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      My Profile
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Welcome Header */}
                  <div className="bg-gradient-to-r from-[#7551B2] to-[#6441a0] text-white p-4 text-center">
                    <h3 className="font-semibold text-lg">Welcome to Doctar</h3>
                    <p className="text-sm text-white/80">Join our healthcare community</p>
                  </div>

                  {/* Auth Buttons */}
                  <div className="p-4 space-y-3">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full p-3 bg-white border-2 border-[#7551B2] text-[#7551B2] rounded-lg font-medium hover:bg-[#7551B2] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v12z"/>
                      </svg>
                      Login
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate("/auth/signup");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full p-3 bg-[#7551B2] text-white rounded-lg font-medium hover:bg-[#6441a0] transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105"
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      Sign Up
                    </button>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
