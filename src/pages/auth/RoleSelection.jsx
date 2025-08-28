import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import ProgressBar from '../../components/auth/ProgressBar';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { persona } = useAuthStore(s => s.onboarding);
  const setOnboarding = useAuthStore(s => s.setOnboarding);

  const handleRoleSelection = (selectedRole) => {
    setOnboarding({ persona: selectedRole });
    
    if (selectedRole === 'doctor') {
      // Redirect to comprehensive doctor onboarding
      navigate('/auth/doctor-onboarding');
    } else {
      // Redirect to simple patient profile completion
      navigate('/auth/patient-profile');
    }
  };

  const steps = ['Sign Up', 'Verify OTP', 'Role Selection', 'Complete Profile'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <ProgressBar 
        currentStep={3} 
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Doctar!</h1>
            <p className="text-sm text-gray-600">Tell us how you'd like to use Doctar</p>
          </div>
          
          {/* Role Selection Cards */}
          <div className="space-y-4 mb-8">
            {/* Patient Card */}
            <button 
              onClick={() => handleRoleSelection('patient')} 
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all hover:border-[#7551B2] hover:bg-[#7551B2]/5 ${
                persona === 'patient' 
                  ? 'border-[#7551B2] bg-[#7551B2]/10' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">I'm a Patient</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Book appointments, consult with doctors,<br />
                    manage your health records
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </button>

            {/* Doctor Card */}
            <button 
              onClick={() => handleRoleSelection('doctor')} 
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all hover:border-[#7551B2] hover:bg-[#7551B2]/5 ${
                persona === 'doctor' 
                  ? 'border-[#7551B2] bg-[#7551B2]/10' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">I'm a Doctor</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Provide consultations, manage appointments,<br />
                    grow your practice online
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              You can always change this later in your account settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
