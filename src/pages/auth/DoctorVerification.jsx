import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DoctorVerification = () => {
  const navigate = useNavigate();
  const onboarding = useSelector((state) => state.auth.onboarding);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-center">
          <img 
            src="/icons/logo.png" 
            alt="Doctar" 
            className="h-8 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for registering as a doctor on Doctar. Your application has been submitted for verification.
          </p>

          {/* Status Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-500 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Our medical verification team will review your documents</li>
                  <li>• You'll receive email updates about your application status</li>
                  <li>• Verification typically takes 3-5 business days</li>
                  <li>• Once approved, you can start accepting patient consultations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Only show fields that have actual data */}
              {(onboarding?.doctorDetails?.fullName || onboarding?.basicInfo?.fullName) && (
                <div className="text-left">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-gray-600 ml-2">
                    {onboarding?.doctorDetails?.fullName || onboarding?.basicInfo?.fullName}
                  </span>
                </div>
              )}
              
              {(onboarding?.doctorDetails?.email || onboarding?.basicInfo?.email || onboarding?.email) && (
                <div className="text-left">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-600 ml-2">
                    {onboarding?.doctorDetails?.email || onboarding?.basicInfo?.email || onboarding?.email}
                  </span>
                </div>
              )}
              
              {(onboarding?.doctorDetails?.phone || onboarding?.basicInfo?.phone) && (
                <div className="text-left">
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span className="text-gray-600 ml-2">
                    {onboarding?.doctorDetails?.phone || onboarding?.basicInfo?.phone}
                  </span>
                </div>
              )}
              
              {onboarding?.doctorDetails?.specialty && (
                <div className="text-left">
                  <span className="font-medium text-gray-700">Specialty:</span>
                  <span className="text-gray-600 ml-2 capitalize">{onboarding.doctorDetails.specialty}</span>
                </div>
              )}
              
              {onboarding?.doctorDetails?.clinicName && (
                <div className="text-left">
                  <span className="font-medium text-gray-700">Clinic:</span>
                  <span className="text-gray-600 ml-2">{onboarding.doctorDetails.clinicName}</span>
                </div>
              )}
              
              {onboarding?.doctorDetails?.city && (
                <div className="text-left">
                  <span className="font-medium text-gray-700">City:</span>
                  <span className="text-gray-600 ml-2">{onboarding.doctorDetails.city}</span>
                </div>
              )}
              
              {onboarding?.doctorDetails?.yearsOfExperience > 0 && (
                <div className="text-left">
                  <span className="font-medium text-gray-700">Experience:</span>
                  <span className="text-gray-600 ml-2">{onboarding.doctorDetails.yearsOfExperience} years</span>
                </div>
              )}
              
              {onboarding?.doctorDetails?.consultationFee > 0 && (
                <div className="text-left">
                  <span className="font-medium text-gray-700">Consultation Fee:</span>
                  <span className="text-gray-600 ml-2">₹{onboarding.doctorDetails.consultationFee}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-sm text-gray-600 mb-8">
            <p>If you have any questions about your application, please contact our support team:</p>
            <p className="font-medium text-[#7551B2] mt-2">support@doctar.com | +91 98765 43210</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-[#7551B2] text-white rounded-lg font-medium hover:bg-[#6441a0] transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorVerification;
