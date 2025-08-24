import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { updateUserProfile } from '../services/authAPI';

const initialForm = {
  name: '',
  email: '',
  phone: '',
};

function UserEdit() {
  const navigate = useNavigate();
  const token = useAuthStore(s => s.token);
  const user = useAuthStore(s => s.user);
  const setAuth = useAuthStore(s => s.setAuth);
  
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial user data
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    // Initialize form with current user data
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    setLoading(false);
  }, [user, navigate, token]);

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      // Update user profile using the API service
      const result = await updateUserProfile(form, token);
      console.log('Profile updated successfully:', result);
      
      // Update the auth store with new user data
      setAuth({ user: { ...user, ...form }, token });
      
      // Navigate back to profile page
      navigate('/user-profile');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4ff] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7551B2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4ff] py-4 md:py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#7551B2] text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl md:text-2xl font-bold">Edit Profile</h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.name}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="Your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 bg-[#7551B2] text-white rounded-lg font-medium hover:bg-[#5a3d8a] transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserEdit;