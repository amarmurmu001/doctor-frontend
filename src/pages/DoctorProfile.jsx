import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import ReviewTab from '../components/ReviewTab';
import SeoDoctorProfile from '../components/seo/SeoDoctorProfile';
import DoctorProfileFAQ from '../components/FAQ/DoctorProfileFAQ';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { doctorId, location, doctorSlug } = useParams(); // Add new SEO route params
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const [activeTab, setActiveTab] = useState('About');
  const [doctor, setDoctor] = useState(null);
  const [actualDoctorId, setActualDoctorId] = useState(doctorId || doctorSlug); // Handle both params
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDoctor() {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
        
        if (doctorId || doctorSlug) {
          // Viewing another doctor's profile - use provided doctorId or doctorSlug
          console.log('Loading other doctor profile:', doctorId || doctorSlug);
          
          let res;
          if (doctorSlug && !doctorId) {
            // Use slug endpoint for SEO URLs
            res = await fetch(`${API_BASE_URL}/api/doctors/slug/${doctorSlug}`);
          } else {
            // Use ID endpoint for legacy URLs
            res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId || doctorSlug}`);
          }
          
          if (!res.ok) throw new Error('Doctor not found');
          const response = await res.json();
          const doctorData = response.success ? response.data : response;
          setDoctor(doctorData);
          setActualDoctorId(doctorData._id || doctorId || doctorSlug);
          
          // Update URL to SEO-friendly format if needed
          const canonicalUrl = getCanonicalUrl(doctorData);
          if (canonicalUrl && window.location.pathname !== canonicalUrl.replace('https://www.doctar.in', '')) {
            window.history.replaceState({}, '', canonicalUrl.replace('https://www.doctar.in', ''));
          }
          
          // Use location from URL params if available
          if (location && doctorData.city !== location) {
            console.log('Location mismatch - URL:', location, 'Doctor city:', doctorData.city);
          }
        } else if (user && user.role === 'doctor') {
          // Viewing own profile - get doctor profile by user ID
          console.log('Loading own doctor profile for user:', user.id);
          
          // Get auth token
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_BASE_URL}/api/doctors/me/doctor-profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!res.ok) {
            if (res.status === 404) {
              setError('Doctor profile not found. Please create your profile.');
            } else {
              throw new Error('Failed to load doctor profile');
            }
          } else {
            const response = await res.json();
            const doctorData = response.success ? response.data : response;
            setDoctor(doctorData);
            setActualDoctorId(doctorData._id); // Set the actual doctor ID from the response
            console.log('Own doctor profile loaded:', doctorData);
          }
        } else {
          setError('No doctor profile to display');
        }
      } catch (e) {
        console.error('Error loading doctor:', e);
        setError(e.message || 'Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    }
    
    loadDoctor();
  }, [user, doctorId, doctorSlug, location]);

  // ✅ Generate disease-specific keywords based on specialization
  const generateDiseaseKeywords = (doctor) => {
    const specialtyKeywords = {
      'Cardiologist': 'heart disease, cardiac problems, hypertension, chest pain, heart attack prevention',
      'Dermatologist': 'skin problems, acne, eczema, hair fall, skin allergies, dermatitis',
      'Orthopedic': 'bone fractures, joint pain, arthritis, back pain, sports injuries, osteoporosis',
      'Pediatrician': 'child health, vaccination, fever in children, growth issues, pediatric care',
      'Neurologist': 'headache, migraine, seizures, nerve problems, stroke, neurological disorders',
      'General Physician': 'fever, cold, cough, diabetes, blood pressure, general health checkup',
      'Gynecologist': 'women health, pregnancy care, menstrual problems, gynecological issues',
      'Psychiatrist': 'mental health, depression, anxiety, stress management, psychiatric care',
      'ENT Specialist': 'ear problems, nose issues, throat infections, hearing loss, sinusitis',
      'Ophthalmologist': 'eye care, vision problems, cataract, glaucoma, eye infections'
    };
    
    return specialtyKeywords[doctor?.specialty] || `${doctor?.specialty?.toLowerCase()} treatment, consultation, medical care`;
  };

  // ✅ Generate canonical URL for SEO
  const getCanonicalUrl = (doctor) => {
    const doctorLocation = doctor.city || 'india';
    const slug = `${doctor.user?.name?.toLowerCase().replace(/\s+/g, '-')}-${doctor.specialty?.toLowerCase().replace(/\s+/g, '-')}`;
    return `https://www.doctar.in/${doctorLocation.toLowerCase().replace(/\s+/g, '-')}/doctor/${slug}`;
  };

  console.log('Doctor Profile State:', { 
    doctorId, 
    actualDoctorId, 
    user: user?.id, 
    userRole: user?.role 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading doctor profile...</p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Dynamic SEO Component */}
      {doctor && (
        <SeoDoctorProfile
          fullName={doctor.user?.name || 'Doctor'}
          specialization={doctor.specialty || 'General Physician'}
          location={doctor.city || 'India'}
          yearsExperience={doctor.yearsOfExperience || 5}
          diseaseKeywords={generateDiseaseKeywords(doctor)}
          doctorImage={doctor.profilePicture?.filename || ''}
          doctorSlug={doctor.slug || `${doctor.user?.name?.toLowerCase().replace(/\s+/g, '-')}-${doctor.specialty?.toLowerCase().replace(/\s+/g, '-')}`}
          ratingValue={(doctor.averageRating || 4.5).toString()}
          ratingCount={(doctor.totalReviews || 50).toString()}
          consultationFee={doctor.consultationFee}
          clinicName={doctor.clinicName}
          languages={doctor.languages || ['English', 'Hindi']}
          canonicalUrl={getCanonicalUrl(doctor)}
        />
      )}

      <div className="min-h-screen bg-white">
        {/* Purple Header Section */}
        <div className="bg-[#7551b3] relative h-96">
          {/* Top Navigation */}
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-xl font-bold"
              title="Back"
            >
              ←
            </button>
            <h1 className="text-white text-lg font-semibold">Doctor Profile</h1>
            {user && user.role === 'doctor' && !doctorId ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/doctor/edit')}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-sm font-semibold"
                  title="Edit Profile"
                >
                  ✎
                </button>
              </div>
            ) : (
              <span className="w-10 h-10" />
            )}
          </div>

          {/* Profile Information */}
          <div className="flex flex-col items-center pt-8">
            <div className="w-[182px] h-[182px] rounded-3xl bg-white overflow-hidden mb-6 shadow-[0_13.2px_13.2px_0_rgba(0,0,0,0.25)]">
              <img 
                src={doctor?.user?.image?.url || "/icons/doctor.png"} 
                alt="Doctor Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/icons/doctor.png";
                }}
              />
            </div>
            <h2 className="text-white text-xl font-semibold mb-1">
              {doctor?.user?.name || 'Doctor'}
            </h2>
            <p className="text-white text-lg">{doctor?.specialty || 'General'}</p>
          </div>
        </div>

        {/* Pill-shaped Tab Navigation */}
        <div className="bg-white">
          <div className="flex justify-center pt-5 pb-6">
            <div className="bg-gray-100 rounded-full p-1 flex relative">
              {['About', 'Review', 'Contact'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative z-10 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
              {/* Animated Pill Background */}
              <div 
                className={`absolute top-1 bottom-1 rounded-full bg-[#7551b3] transition-all duration-300 ease-in-out ${
                  activeTab === 'About' ? 'left-1 w-24' :
                  activeTab === 'Review' ? 'left-1 w-24 translate-x-24' :
                  'left-1 w-28 translate-x-48'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
              {error}
              {error.includes('create your profile') && (
                <button 
                  onClick={() => navigate('/doctor/create')}
                  className="ml-2 underline hover:no-underline"
                >
                  Create Profile
                </button>
              )}
            </div>
          )}
          
          {activeTab === 'About' && !loading && doctor && (
            <div className="space-y-6">
              {/* Hospital Images Gallery */}
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-2">
                  {doctor.gallery && doctor.gallery.length > 0 ? (
                    doctor.gallery.slice(0, 3).map((image, index) => (
                      <div key={index} className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0">
                        <img 
                          src={image.url} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/banner.png";
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    // Default images if no gallery
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0">
                        <img 
                          src="/banner.png" 
                          alt={`Default ${index + 1}`} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* About Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-600">
                  {doctor?.about || 'No description provided yet.'}
                </p>
              </div>

              {/* Key Specialization */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Specialization</h3>
                <div className="">
                  <div className="space-y-2">
                    {doctor?.keySpecialization && doctor.keySpecialization.length > 0 ? (
                      doctor.keySpecialization.map((spec, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="text-gray-600 text-base">{spec}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="text-gray-600 text-base">{doctor?.specialty || 'General'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="text-gray-600 text-base">
                            {doctor?.clinicName ? `Clinic: ${doctor.clinicName}` : '—'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Education</h3>
                <div className="space-y-2 text-gray-600">
                  {(doctor?.education && doctor.education.length) ? doctor.education.map((ed, i) => (
                    <div key={i}>
                      <p className="font-medium">{ed}</p>
                    </div>
                  )) : <p>No education details provided.</p>}
                </div>
              </div>

              {/* Awards */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Awards</h3>
                {doctor?.awards && doctor.awards.length > 0 ? (
                  doctor.awards.map((award, index) => (
                    <div key={index} className='bg-[#f6f6f6] shadow-[0_13.2px_13.2px_0_rgba(0,0,0,0.25)] rounded-lg p-4 mb-3'>
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-[#f6f6f6] rounded-lg flex-shrink-0">
                          <img 
                            src={award.image?.url || "/banner.png"} 
                            alt="Award Certificate" 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/banner.png";
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">{award.title}</p>
                          <p className="text-gray-600 text-sm">{award.year} - {award.institute}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='bg-[#f6f6f6] shadow-[0_13.2px_13.2px_0_rgba(0,0,0,0.25)] rounded-lg p-4'>
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-[#f6f6f6] rounded-lg flex-shrink-0">
                        <img 
                          src="/banner.png" 
                          alt="Award Certificate" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="text-gray-600">No awards added yet.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Languages</h3>
                <p className="text-gray-600">
                  {(doctor?.languages && doctor.languages.length) ? doctor.languages.join(', ') : '—'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Review' && (
            /* Pass the actualDoctorId to ReviewTab - this is the key fix! */
            <ReviewTab doctorId={actualDoctorId} />
          )}

          {activeTab === 'Contact' && (
            <div className="space-y-6">
              {/* Location Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Location</h3>
                
                
                {/* Map Placeholder */}
                <div className="bg-blue-900 rounded-lg h-48 flex items-center justify-center mb-4">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">📍</div>
                    <p className="text-sm">Map View</p>
                    <p className="text-xs opacity-75">Clinic Location</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-200 rounded-lg p-3 text-sm text-gray-600 mb-3">
                  <p>🏥 {doctor?.clinicName || 'Medical Clinic'}</p>
                  <p>📍 {doctor?.address?.line1 || 'Near Main Market'}, {doctor?.address?.city || doctor?.city || 'Deoghar'}, {doctor?.address?.state || 'Jharkhand'}</p>
                </div>

              {/* Hospitals Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Hospitals</h3>
                <div className="space-y-2">
                  <div className="bg-purple-200 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">📞 +91 98765 43210</p>
                      <p className="text-sm text-gray-600">Primary Contact</p>
                    </div>
                  </div>
                  <div className="bg-purple-200 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">📞 +91 98765 43211</p>
                      <p className="text-sm text-gray-600">Secondary Contact</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Online Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Online</h3>
                <div className="bg-purple-200 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">💬 {doctor?.user?.email || 'support@doctar.com'}</p>
                    <p className="text-sm text-gray-600">Email Support</p>
                  </div>
                </div>
              </div>

              {/* Timing Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Timing</h3>
                <div className="space-y-2">
                  {/* Generate time slots like in the image */}
                  {[
                    { date: '14', day: 'FRI', time: '7:00 AM to 10:00 PM' },
                    { date: '15', day: 'SAT', time: '8:00 PM to 10:00 PM' },
                    { date: '16', day: 'SUN', time: '7:00 AM to 8:30 PM' },
                    { date: '17', day: 'MON', time: '7:00 AM to 8:30 PM' },
                    { date: '18', day: 'TUE', time: '7:00 AM to 8:30 PM' },
                    { date: '19', day: 'WED', time: '7:00 AM to 8:30 PM' },
                    { date: '20', day: 'THU', time: '7:00 AM to 8:30 PM' }
                  ].map((slot, index) => (
                    <div key={index} className="bg-purple-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#7551B2] text-white rounded-lg p-2 text-center min-w-[40px]">
                          <div className="text-lg font-bold">{slot.date}</div>
                          <div className="text-xs">{slot.day}</div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{slot.time}</p>
                          <p className="text-sm text-gray-600">Available</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {user && user.role === 'doctor' && !doctorId && (
          <div className="p-4">
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full bg-red-500 text-white py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        )}

        {/* FAQ Section for Doctor */}
        {doctor && (
          <div className="bg-[#7551B2] py-8">
            <div className="max-w-4xl mx-auto px-4">
              <DoctorProfileFAQ
                doctor={doctor}
                className="bg-transparent border-none"
              />
            </div>
          </div>
        )}

        
      </div>
    </>
  );
};

export default DoctorProfile;
