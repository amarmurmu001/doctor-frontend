import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { updateUserProfile, uploadProfileImage } from '../services/authAPI';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  location: '',
  appLanguage: 'English',
  sex: '',
  dateOfBirth: '',
};

function UserEdit() {
  const navigate = useNavigate();
  const token = useAuthStore(s => s.token);
  const user = useAuthStore(s => s.user);
  const setAuth = useAuthStore(s => s.setAuth);
  const updateUserImage = useAuthStore(s => s.updateUserImage);
  
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Language options
  const languageOptions = [
    'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 
    'Gujarati', 'Urdu', 'Kannada', 'Malayalam', 'Punjabi'
  ];

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
      location: user.location || '',
      appLanguage: user.appLanguage || 'English',
      sex: user.sex || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '', // Format for input[type="date"]
    });
    
    // Set current image preview
    setImagePreview(user.image?.url || '');
    setLoading(false);
  }, [user, navigate, token]);

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    // Clear errors when user starts typing
    if (error) setError('');
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleImageUpload() {
    if (!imageFile) return null;

    try {
      setUploadingImage(true);
      const result = await uploadProfileImage(imageFile, token);
      
      if (result.success) {
        updateUserImage(result.data.image);
        setSuccess('Profile image updated successfully!');
        return result.data.image;
      }
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Upload image first if there's a new one
      if (imageFile) {
        await handleImageUpload();
      }

      // Prepare form data with proper date formatting
      const profileData = {
        ...form,
        dateOfBirth: form.dateOfBirth || undefined, // Send undefined if empty
      };

      // Remove empty fields to avoid overwriting with empty strings
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === '') {
          delete profileData[key];
        }
      });

      // Update user profile using the API service
      const result = await updateUserProfile(profileData, token);
      console.log('Profile updated successfully:', result);
      
      // Update the auth store with new user data
      const updatedUser = { ...user, ...profileData };
      setAuth(updatedUser, token);
      
      setSuccess('Profile updated successfully!');
      
      // Navigate back to profile page after a short delay
      setTimeout(() => {
        navigate('/user-profile');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  }

  function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age > 0 ? `${age} years old` : '';
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
              onClick={() => navigate('/user-profile')} 
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Profile
            </button>
            <h1 className="text-xl md:text-2xl font-bold">Edit Profile</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Profile Picture</h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#7551B2] flex items-center justify-center text-white text-2xl font-semibold">
                        {(form.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    Choose Photo
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </section>

            {/* Basic Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.name}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.location}
                    onChange={e => updateField('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>
            </section>

            {/* Personal Details */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.appLanguage}
                    onChange={e => updateField('appLanguage', e.target.value)}
                  >
                    {languageOptions.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.sex}
                    onChange={e => updateField('sex', e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.dateOfBirth}
                    onChange={e => updateField('dateOfBirth', e.target.value)}
                    max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  />
                  {form.dateOfBirth && (
                    <p className="text-xs text-gray-500 mt-1">
                      Age: {calculateAge(form.dateOfBirth)}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <div className="text-sm text-gray-600">
                    <strong>Account Type:</strong> {user.role === 'doctor' ? 'Doctor' : 'Patient'}
                  </div>
                </div>
              </div>
            </section>

            {/* Account Status */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Account Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Email Verification</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <span className={`text-sm ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Phone Verification</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.phoneVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <span className={`text-sm ${user.phoneVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {user.phoneVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/user-profile')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className={`px-6 py-3 bg-[#7551B2] text-white rounded-lg font-medium hover:bg-[#5a3d8a] transition-colors flex-1 sm:flex-none ${(saving || uploadingImage) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserEdit;
