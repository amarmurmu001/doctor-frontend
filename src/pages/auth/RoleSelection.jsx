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
            <h1 className="text-2xl font-bold text-gray-900 mb-2"> About me</h1>
            <p className="text-sm text-gray-600">Please let us know your purpose of visit,
            select from the options below</p>
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
                  <div className="w-20 h-20 rounded-xl overflow-hidden">
                    <img 
                      src="/icons/patient .png" 
                      alt="Patient" 
                      className="w-full h-full object-cover"
                    />
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
                  <div className="w-20 h-20 rounded-xl overflow-hidden">
                    <img 
                      src="/icons/doctor-role.png" 
                      alt="Doctor" 
                      className="w-full h-full object-cover"
                    />
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
