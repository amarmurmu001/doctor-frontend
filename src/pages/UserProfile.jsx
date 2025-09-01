import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setAuth } from '../stores/authSlice';
import { getCurrentUser } from '../services/authAPI';

function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storedUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState(storedUser);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(false);
  const [error, setError] = useState('');
  const [userError, setUserError] = useState('');
  const [hasLoadedUserData, setHasLoadedUserData] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      // Only fetch once per session unless explicitly retrying
      if (!token || hasLoadedUserData) {
        return;
      }

      try {
        setUserLoading(true);
        setUserError('');
        
        // Fetch fresh user data from backend
        const freshUserData = await getCurrentUser(token);
        console.log('Fresh user data:', freshUserData);
        
        // Update local state and auth store with fresh data
        setUser(freshUserData);
        dispatch(setAuth({ user: freshUserData, token }));
        setHasLoadedUserData(true);
        
      } catch (e) {
        console.error('Error loading user data:', e);
        setUserError(e.message || 'Failed to load user data');
        // Keep using stored user data if fetch fails
        if (storedUser) {
          setUser(storedUser);
        }
      } finally {
        setUserLoading(false);
      }
    }

    async function loadAppointments() {
      if (!token) { 
        setLoading(false); 
        return; 
      }
      
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${API_BASE_URL}/api/appointments/me`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) throw new Error('Failed to load appointments');
        
        const response = await res.json();
        const appointmentsData = response.success ? response.data.appointments : response.data || response;
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch (e) {
        console.error('Error loading appointments:', e);
        setError(e.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    }
    
    // Load user data and appointments in parallel
    if (token) {
      loadUserData();
      loadAppointments();
    }
  }, [token, hasLoadedUserData]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f4f4ff] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">You're not logged in</h1>
          <p className="text-gray-600 mb-4">Please login to view your profile.</p>
          <a href="/login" className="inline-block bg-black text-white px-4 py-2 rounded-md">Login</a>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

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
          <h1 className="text-white text-lg font-semibold">My Profile</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/user-edit')}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-sm font-semibold"
              title="Edit Profile"
            >
              ✎
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="flex flex-col items-center pt-8">
          {userLoading ? (
            <div className="w-[182px] h-[182px] rounded-3xl bg-white/20 mb-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            </div>
          ) : (
            <div className="w-[182px] h-[182px] rounded-3xl bg-white overflow-hidden mb-6 shadow-[0_13.2px_13.2px_0_rgba(0,0,0,0.25)]">
              {user.image?.url ? (
                <img 
                  src={user.image.url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#7551B2] flex items-center justify-center text-white text-4xl font-semibold">
                  {getInitials(user.name)}
                </div>
              )}
              {user.image?.url && (
                <div className="w-full h-full bg-[#7551B2] flex items-center justify-center text-white text-4xl font-semibold" style={{display: 'none'}}>
                  {getInitials(user.name)}
                </div>
              )}
            </div>
          )}
          <h2 className="text-white text-xl font-semibold mb-1">
            {userLoading ? 'Loading...' : (user.name || 'User')}
          </h2>
          <p className="text-white text-lg capitalize">
            {userLoading ? 'Loading...' : (user.role || 'patient')}
          </p>
          {userError && (
            <p className="text-red-200 text-sm mt-2">Failed to load profile data</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Appointments Section */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">My Appointments</h2>
            {loading ? (
              <p className="text-gray-600 text-sm">Loading appointments…</p>
            ) : error ? (
              <p className="text-red-600 text-sm">{error}</p>
            ) : appointments.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600 text-sm">No appointments found.</p>
                <button 
                  onClick={() => navigate('/search')}
                  className="mt-2 text-blue-600 text-sm underline hover:no-underline"
                >
                  Book an appointment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 5).map(appointment => (
                  <div key={appointment._id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {appointment.doctor?.user?.name || 'Doctor'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {appointment.doctor?.specialty || 'General'} • {appointment.doctor?.clinicName || 'Clinic'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {appointment.reason || 'Consultation'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(appointment.appointmentDate)}
                        </p>
                        <p className="text-xs text-gray-500">{appointment.appointmentTime}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status || 'booked'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {appointments.length > 5 && (
                  <button 
                    onClick={() => navigate('/appointments')}
                    className="w-full text-center py-2 text-blue-600 text-sm hover:underline"
                  >
                    View all {appointments.length} appointments
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Personal Information</h2>
            {userLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-[#7551b3]"></div>
                <span className="ml-3 text-gray-600">Loading profile data...</span>
              </div>
            ) : userError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-2">Failed to load profile data</p>
                <button 
                  onClick={() => {
                    setUserError('');
                    setHasLoadedUserData(false);
                    setUserLoading(true);
                  }} 
                  className="text-sm text-blue-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Full Name</span>
                  <span className="text-gray-900 font-medium">{user.name || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="text-gray-900">{user.phone || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className="text-gray-900 capitalize">{user.role || 'patient'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="text-gray-900">{user.location || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="text-gray-900">{user.appLanguage || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Gender</span>
                  <span className="text-gray-900 capitalize">{user.sex || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date of Birth</span>
                  <span className="text-gray-900">
                    {user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Age</span>
                  <span className="text-gray-900">
                    {user.age ? `${user.age} years` : 'Not set'}
                  </span>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Account Status</h2>
            {userLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-[#7551b3]"></div>
                <span className="ml-3 text-gray-600">Loading account status...</span>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email Verified</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={user.emailVerified ? 'text-green-600' : 'text-red-600'}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phone Verified</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${user.phoneVerified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={user.phoneVerified ? 'text-green-600' : 'text-red-600'}>
                    {user.phoneVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-900">
                  {user.createdAt ? formatDate(user.createdAt) : 'Recently'}
                </span>
              </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {user.role === 'doctor' && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Doctor Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/doctor-profile')}
                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Doctor Profile
                </button>
                <button 
                  onClick={() => navigate('/appointments')}
                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Manage Appointments
                </button>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div className="bg-white rounded-2xl shadow p-6">
            <button
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
