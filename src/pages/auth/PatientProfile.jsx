import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setOnboarding, setAuth, completeOnboarding } from '../../stores/authSlice';
import ProgressBar from '../../components/auth/ProgressBar';
import { completePatientProfile } from '../../services/authAPI';

const PatientProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onboarding = useSelector((state) => state.auth.onboarding);
  
  const [profileData, setProfileData] = useState({
    dateOfBirth: '',
    sex: '', // Changed from gender to sex to match User model
    location: '', // Changed from city to location to match User model
    appLanguage: 'English' // Default language
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Completing patient profile...');
      
      // Prepare profile data - only fields that exist in User model
      const profileUpdateData = {
        location: profileData.location,
        sex: profileData.sex,
        dateOfBirth: profileData.dateOfBirth,
        appLanguage: profileData.appLanguage
      };
      
      // Complete patient profile (login + update)
      const result = await completePatientProfile(
        profileUpdateData,
        onboarding.email,
        onboarding.basicInfo.password
      );
      
      // Set authentication state
      dispatch(setAuth({ user: result.user, token: result.token }));

      // Clear onboarding data
      dispatch(completeOnboarding());
      
      console.log('Patient profile completed successfully');
      
      // Navigate to home or dashboard
      navigate('/');
    } catch (err) {
      console.error('Error completing patient profile:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return profileData.dateOfBirth && profileData.sex && profileData.location;
  };

  const steps = ['Sign Up', 'Verify OTP', 'Role Selection', 'Complete Profile'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <ProgressBar 
        currentStep={4} 
        totalSteps={steps.length} 
        steps={steps} 
      />
      
      {/* Logo section */}
      <div className="px-6 py-6 bg-white">
        <div className="flex items-center justify-center">
          <img 
            src="/icons/logo.png" 
            alt="Doctar" 
            className="h-10 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      {/* Content section */}
      <div className="px-6">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
            <p className="text-sm text-gray-600">Help us provide you with better healthcare recommendations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Date of Birth*</label>
                <input 
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Gender*</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none"
                  value={profileData.sex}
                  onChange={(e) => handleInputChange('sex', e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Location*</label>
              <input 
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
                placeholder="e.g., Mumbai, Delhi, Dhanbad"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Preferred Language</label>
              <select 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none"
                value={profileData.appLanguage}
                onChange={(e) => handleInputChange('appLanguage', e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Marathi">Marathi</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Punjabi">Punjabi</option>
              </select>
            </div>

            {/* Error message */}
            {error && <div className="text-red-600 text-sm">{error}</div>}

            {/* Submit button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={!isFormValid() || loading}
                className="w-full bg-[#7551B2] text-white py-4 rounded-full font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6441a0] transition-colors"
              >
                {loading ? 'Saving Profile...' : 'Complete Registration'}
              </button>
            </div>
          </form>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Your personal information is encrypted and stored securely. We follow strict privacy protocols to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
