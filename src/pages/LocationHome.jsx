import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { generateSEOUrl, SEO_ROUTES } from '../routes';

const LocationHome = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState(null);
  const [topDoctors, setTopDoctors] = useState([]);
  const [topSpecialties, setTopSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      if (!API_BASE_URL) {
        throw new Error('Backend URL not configured');
      }

      // Fetch location data and doctors
      const [locationResponse, doctorsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/locations/${location.toLowerCase()}`).catch(() => null),
        fetch(`${API_BASE_URL}/api/doctors?city=${encodeURIComponent(location.toLowerCase())}&limit=20&status=approved`)
      ]);

      // Set location data (fallback to mock if API fails)
      if (locationResponse && locationResponse.ok) {
        const locationResult = await locationResponse.json();
        setLocationData({
          name: locationResult.name || location.charAt(0).toUpperCase() + location.slice(1),
          doctorCount: locationResult.doctorCount || 1250,
          hospitalCount: locationResult.hospitalCount || 89,
          clinicCount: locationResult.clinicCount || 156,
          description: locationResult.description || `Find the best doctors, hospitals and clinics in ${location}. Book appointments online with verified healthcare professionals.`
        });
      } else {
        // Fallback to mock data
        setLocationData({
          name: location.charAt(0).toUpperCase() + location.slice(1),
          doctorCount: 1250,
          hospitalCount: 89,
          clinicCount: 156,
          description: `Find the best doctors, hospitals and clinics in ${location}. Book appointments online with verified healthcare professionals.`
        });
      }

      // Set doctors data
      if (doctorsResponse && doctorsResponse.ok) {
        const doctorsResult = await doctorsResponse.json();
        const doctorsArray = Array.isArray(doctorsResult) ? doctorsResult :
                           (doctorsResult.doctors || doctorsResult.data || doctorsResult.results || []);

        const validDoctors = doctorsArray.slice(0, 3).map(doctor => ({
          id: doctor._id || doctor.id,
          name: doctor.user?.name || doctor.name || 'Doctor',
          specialty: doctor.specialty || doctor.keySpecialization?.[0] || 'General',
          rating: 4.5, // Default rating since not in API
          experience: doctor.experience || 10
        }));

        setTopDoctors(validDoctors);
      } else {
        // Fallback to mock doctors
        setTopDoctors([
          { id: 1, name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist', rating: 4.8, experience: 15 },
          { id: 2, name: 'Dr. Priya Sharma', specialty: 'Dermatologist', rating: 4.9, experience: 12 },
          { id: 3, name: 'Dr. Amit Patel', specialty: 'Orthopedic', rating: 4.7, experience: 18 }
        ]);
      }

      setTopSpecialties(SEO_ROUTES.specialties.slice(0, 12));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching location data:', error);
      setError(error.message || 'Failed to load location data');
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (!location) {
      navigate('/404');
      return;
    }

    if (!SEO_ROUTES.locationPages.includes(location.toLowerCase())) {
      navigate('/404');
      return;
    }

    fetchLocationData();
  }, [location, navigate, fetchLocationData]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7551B2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading location data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center bg-red-50 rounded-lg p-8 border border-red-200 max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Location</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Not Found</h3>
          <p className="text-gray-600">The requested location could not be found.</p>
        </div>
      </div>
    );
  }

  const locationTitle = `Best Doctors in ${locationData.name} | Book Appointment Online | Doctar`;
  const locationDescription = `Find and book appointments with the best doctors in ${locationData.name}. ${locationData.doctorCount}+ verified doctors, ${locationData.hospitalCount}+ hospitals. Get instant confirmation.`;

  return (
    <>
      <Helmet>
        <title>{locationTitle}</title>
        <meta name="description" content={locationDescription} />
        <meta name="keywords" content={`doctors in ${location}, best doctors ${location}, book appointment ${location}, healthcare ${location}`} />
        <link rel="canonical" href={`${window.location.origin}/${location}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={locationTitle} />
        <meta property="og:description" content={locationDescription} />
        <meta property="og:url" content={`${window.location.origin}/${location}`} />
        <meta property="og:type" content="website" />
        
        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            "name": `Doctar - ${locationData.name}`,
            "description": locationDescription,
            "url": `${window.location.origin}/${location}`,
            "areaServed": {
              "@type": "City",
              "name": locationData.name
            },
            "availableService": [
              {
                "@type": "MedicalProcedure",
                "name": "Doctor Consultation"
              },
              {
                "@type": "MedicalProcedure", 
                "name": "Online Appointment Booking"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen relative">
        {/* Purple Header Background - Matching your design */}
        <div className="bg-[#7551B2] w-full h-32 md:h-[15vw]"></div>
        
        {/* Main Content Container - Matching your responsive width */}
        <div className="w-full md:w-[90vw] lg:w-[80vw] mx-auto">
          {/* Hero Banner - Overlapping the split like your home page */}
          <div className="px-2 sm:px-4 -mt-16 md:-mt-[12vw] z-10">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto w-full">
              <div className="p-6 md:p-8 text-center">
                <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-800">
                  Best Doctors in {locationData.name}
                </h1>
                <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                  Book appointments with {locationData.doctorCount}+ verified doctors across {locationData.hospitalCount}+ hospitals and clinics
                </p>
                
                {/* Quick Stats - Matching your QueryItem style */}
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="bg-[#7551B2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-xl font-bold">{locationData.doctorCount}+</span>
                    </div>
                    <div className="text-xs text-gray-600">Doctors</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-[#7551B2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-xl font-bold">{locationData.hospitalCount}+</span>
                    </div>
                    <div className="text-xs text-gray-600">Hospitals</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-[#7551B2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-xl font-bold">{locationData.clinicCount}+</span>
                    </div>
                    <div className="text-xs text-gray-600">Clinics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Specialties - Matching QueryGrid style */}
          <div className="mt-4 px-2 sm:px-0 my-10">
            <section className="w-full max-w-full">
              <div className="px-4 mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Popular Specialties in {locationData.name}
                  </h2>
                  <Link
                    to={`/${location}/doctors`}
                    className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors"
                  >
                    All Doctors
                  </Link>
                </div>
              </div>

              <div className="px-4 w-full max-w-full">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {topSpecialties.map((specialty, index) => (
                    <div key={index} className="flex-shrink-0">
                      <Link
                        to={`/${location}/${specialty}`}
                        className="flex flex-col items-center focus:outline-none group"
                      >
                        <div className="bg-[#7551B2] w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center hover:bg-[#6441a0] transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                          <span className="text-white text-2xl">🏥</span>
                        </div>
                        <span className="text-gray-700 text-xs sm:text-sm font-medium mt-2 group-hover:text-[#7551B2] transition-colors duration-300 text-center capitalize">
                          {specialty.replace('-', ' ')}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Top Doctors - Matching DoctorsList style */}
          <div className="mt-4 px-2 sm:px-0 mb-10">
            <section className="w-full max-w-full">
              <div className="px-4 mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Top Rated Doctors in {locationData.name}
                  </h2>
                  <Link
                    to={`/${location}/doctors`}
                    className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors"
                  >
                    All
                  </Link>
                </div>
              </div>

              <div className="px-4 w-full max-w-full">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {topDoctors.map((doctor) => (
                    <div key={doctor.id} className="flex-shrink-0">
                      <Link
                        to={generateSEOUrl.doctorProfile(location, doctor.name, doctor.specialty, doctor.id)}
                        className="min-w-[300px] flex items-center border-2 border-[#7551B2] rounded-xl bg-white overflow-hidden hover:shadow-lg transition cursor-pointer"
                      >
                        {/* Left: Text */}
                        <div className="flex-1 p-4">
                          <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                          <p className="text-sm text-gray-500">{doctor.specialty}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="ml-1 text-sm text-gray-600">{doctor.rating} • {doctor.experience} years</span>
                          </div>
                        </div>

                        {/* Right: Avatar */}
                        <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-[#7551B2]">
                          <span className="text-white font-bold text-lg">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Services Section - Matching QueryGrid style */}
          <div className="mt-4 px-2 sm:px-0 my-10">
            <section className="w-full max-w-full">
              <div className="px-4 mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Healthcare Services in {locationData.name}
                </h2>
              </div>

              <div className="px-4 w-full max-w-full">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  <div className="flex-shrink-0">
                    <Link
                      to={`/${location}/doctors`}
                      className="flex flex-col items-center focus:outline-none group"
                    >
                      <div className="bg-[#7551B2] w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center hover:bg-[#6441a0] transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                        <span className="text-white text-2xl">👨‍⚕️</span>
                      </div>
                      <span className="text-gray-700 text-xs sm:text-sm font-medium mt-2 group-hover:text-[#7551B2] transition-colors duration-300 text-center">
                        Find Doctors
                      </span>
                    </Link>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Link
                      to={`/${location}/hospitals`}
                      className="flex flex-col items-center focus:outline-none group"
                    >
                      <div className="bg-[#7551B2] w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center hover:bg-[#6441a0] transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                        <span className="text-white text-2xl">🏥</span>
                      </div>
                      <span className="text-gray-700 text-xs sm:text-sm font-medium mt-2 group-hover:text-[#7551B2] transition-colors duration-300 text-center">
                        Hospitals
                      </span>
                    </Link>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Link
                      to={`/${location}/clinics`}
                      className="flex flex-col items-center focus:outline-none group"
                    >
                      <div className="bg-[#7551B2] w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center hover:bg-[#6441a0] transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                        <span className="text-white text-2xl">🏪</span>
                      </div>
                      <span className="text-gray-700 text-xs sm:text-sm font-medium mt-2 group-hover:text-[#7551B2] transition-colors duration-300 text-center">
                        Clinics
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationHome;
