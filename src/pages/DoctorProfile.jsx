import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const [activeTab, setActiveTab] = useState('About');
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDoctor() {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
        
        if (doctorId) {
          // Viewing another doctor's profile
          const res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}`);
          if (!res.ok) throw new Error('Doctor not found');
          const doctorData = await res.json();
          setDoctor(doctorData);
        } else if (user && user.role === 'doctor') {
          // Viewing own profile
          const res = await fetch(`${API_BASE_URL}/api/doctors`);
          if (!res.ok) throw new Error('Failed to load doctor');
          const list = await res.json();
          const mine = Array.isArray(list) ? list.find(d => (d.user && (d.user._id === user?.id || d.user === user?.id))) : null;
          if (!mine) {
            setDoctor(null);
            setError('Profile not found. Please create your profile.');
          } else {
            const det = await fetch(`${API_BASE_URL}/api/doctors/${mine._id}`);
            const detData = det.ok ? await det.json() : mine;
            setDoctor(detData);
          }
        } else {
          setError('No doctor profile to display');
        }
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [user, doctorId]);

  return (
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
              src="/icons/doctor.png" 
              alt="Doctor Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-white text-xl font-semibold mb-1">{doctor?.user?.name || 'Doctor'}</h2>
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
          <div className="mb-4 text-sm text-red-600">{error}</div>
        )}
        {activeTab === 'About' && !loading && (
          <div className="space-y-6">
            {/* Hospital Images Gallery */}
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-2">
                <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0">
                  <img 
                    src="/banner.png" 
                    alt="Hospital Exterior" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0">
                  <img 
                    src="/banner.png" 
                    alt="Hospital Interior" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0">
                  <img 
                    src="/banner.png" 
                    alt="Patient Room" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-gray-600 text-base">{doctor?.specialty || 'General'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-gray-600 text-base">{doctor?.clinicName ? `Clinic: ${doctor.clinicName}` : '—'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-gray-600 text-base">{typeof doctor?.consultationFee === 'number' ? `Fee: ₹${doctor.consultationFee}` : 'Fee: —'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-gray-600 text-base">{doctor?.city || '—'}</span>
                  </div>
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
            <h3 className="text-lg font-semibold mb-2">Awards</h3>
            <div className='bg-[#f6f6f6] shadow-[0_13.2px_13.2px_0_rgba(0,0,0,0.25)] rounded-lg p-1'>
             
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-[#f6f6f6] rounded-lg flex-shrink-0">
                  <img 
                    src="/banner.png" 
                    alt="Award Certificate" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-gray-600">
                    Gairdner Foundation International Award 2017 Gairdner Institute
                  </p>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Languages</h3>
              <p className="text-gray-600">{(doctor?.languages && doctor.languages.length) ? doctor.languages.join(', ') : '—'}</p>
            </div>
          </div>
        )}

        {activeTab === 'Review' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <div className="text-sm text-[#9B51E0] font-medium cursor-pointer">See all &gt;</div>
            </div>
            
            {/* Combined Sunita's Review and Photo Gallery */}
            <div className="bg-[#F2F1F9] rounded-[20px] p-4">
              {/* Sunita Jain's Review */}
              <div className="flex items-start gap-3 mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <img className="object-cover h-12 w-12" src="/icons/shape.png" alt="Sunita Jain" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Sunita Jain</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <img key={index} className="w-4 h-4" src="/icons/icon.png" alt="star" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
                  </p>
                </div>
              </div>
              
              {/* Image Gallery */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <img 
                    src="/banner.png" 
                    alt="Hospital Building" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <img 
                    src="/banner.png" 
                    alt="Hospital Interior" 
                    className="w-full h-14 object-cover rounded-lg"
                  />
                  <img 
                    src="/banner.png" 
                    alt="Clinic Room" 
                    className="w-full h-14 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Aryan's Review */}
            <div className="bg-[#F2F1F9] rounded-[20px] p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <img className="object-cover h-12 w-12" src="/icons/shape.png" alt="Aryan" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Aryan</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <img key={index} className="w-4 h-4" src="/icons/icon.png" alt="star" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
                  </p>
                </div>
              </div>
            </div>

            {/* Abhishek Sharma's Review */}
            <div className="bg-[#F2F1F9] rounded-[20px] p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <img className="object-cover h-12 w-12" src="/icons/shape.png" alt="Abhishek Sharma" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Abhishek Sharma</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <img key={index} className="w-4 h-4" src="/icons/icon.png" alt="star" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
                  </p>
                </div>
              </div>
            </div>

            {/* Priya Patel's Review */}
            <div className="bg-[#F2F1F9] rounded-[20px] p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <img className="object-cover h-12 w-12" src="/icons/shape.png" alt="Priya Patel" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Priya Patel</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <img key={index} className="w-4 h-4" src="/icons/icon.png" alt="star" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
                  </p>
                </div>
              </div>
            </div>

            {/* Riya Jaiswal's Review */}
            <div className="bg-[#F2F1F9] rounded-[20px] p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <img className="object-cover h-12 w-12" src="/icons/shape.png" alt="Riya Jaiswal" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Riya Jaiswal</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <img key={index} className="w-4 h-4" src="/icons/icon.png" alt="star" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-2 mb-1">
              <button className="bg-black text-white text-xs py-2 px-4 rounded-xl">Post a review</button>
            </div>
          </div>
        )}

        {activeTab === 'Contact' && (
          <div className="text-center py-8">
            <p className="text-gray-500">Contact information will be displayed here</p>
          </div>
        )}
      </div>

      {user && user.role === 'doctor' && !doctorId && (
        <div className="p-4">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
