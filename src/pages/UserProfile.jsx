import React, { useEffect, useState } from 'react';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const token = useAuthStore(s => s.token);
  const logout = useAuthStore(s => s.logout);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAppointments() {
      if (!token) { setLoading(false); return; }
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${API_BASE_URL}/api/appointments/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load appointments');
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    if (user) loadAppointments();
  }, [user, token]);

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
          <h1 className="text-white text-lg font-semibold">User Profile</h1>
          {user && user.role === 'patient' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/user/edit')}
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
            <div className="w-full h-full bg-[#7551B2] flex items-center justify-center text-white text-4xl font-semibold">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
          <h2 className="text-white text-xl font-semibold mb-1">{user.name || 'User'}</h2>
          <p className="text-white text-lg capitalize">{user.role || 'patient'}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Upcoming Appointments</h2>
            {loading ? (
              <p className="text-gray-600 text-sm">Loading…</p>
            ) : error ? (
              <p className="text-red-600 text-sm">{error}</p>
            ) : appointments.length === 0 ? (
              <p className="text-gray-600 text-sm">No upcoming appointments found.</p>
            ) : (
              <ul className="divide-y">
                {appointments.map(a => (
                  <li key={a._id} className="py-2 flex items-center justify-between text-sm">
                    <span>{a.doctor?.clinicName || a.doctor?.specialty || 'Doctor'} — {a.reason || 'Consultation'}</span>
                    <span className="text-gray-500">{a.appointmentDate?.slice(0,10)} {a.appointmentTime}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Account</h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center justify-between">
                <span>Email</span>
                <span className="text-gray-500">{user.email}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Phone</span>
                <span className="text-gray-500">{user.phone || 'Not set'}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Email Verified</span>
                <span className="text-gray-500">—</span>
              </li>
            </ul>
          </div>

          {user && user.role === 'patient' && (
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
      </div>
    </div>
  );
}

export default UserProfile;


