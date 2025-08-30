import React, { useState } from 'react';
import ReviewModal from './ReviewModal';
import StarRating from '../ui/StarRating';

export default function Patientreview() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Function to handle opening the modal with a specific doctor
  const handleOpenModal = (doctorId) => {
    try {
      if (!doctorId) {
        throw new Error('Doctor information is missing');
      }
      setError('');
      setSelectedDoctorId(doctorId);
      setShowModal(true);
    } catch (err) {
      showErrorMessage(err.message);
    }
  };
  
  // Function to handle review submission
  const handleReviewSubmitted = () => {
    setShowModal(false);
    // Show success notification
    showNotification('Review submitted successfully!', 'success');
    // Here you could add logic to refresh the reviews if needed
  };
  
  // Show error message
  const showErrorMessage = (message) => {
    setError(message);
    // Auto-hide error after 5 seconds
    setTimeout(() => setError(''), 5000);
  };
  
  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    // Auto-hide notification after 3 seconds
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };
  
  // Check if user is logged in
  const isLoggedIn = () => {
    try {
      const authStore = JSON.parse(localStorage.getItem('auth-store'));
      return !!authStore?.state?.token;
    } catch (err) {
      console.error('Error checking login status:', err);
      return false;
    }
  };
  
  return(
    <div className="bg-[#F2F1F9] rounded-[20px] p-3 sm:p-4 m-2 mt-4 h-full relative">
      {/* Error message */}
      {error && (
        <div className="absolute top-2 left-0 right-0 mx-auto w-11/12 bg-red-50 text-red-600 p-2 rounded-md text-sm text-center shadow-md z-10">
          {error}
        </div>
      )}
      
      {/* Success notification */}
      {notification.show && (
        <div className={`absolute top-2 left-0 right-0 mx-auto w-11/12 p-2 rounded-md text-sm text-center shadow-md z-10 ${notification.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
          {notification.message}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-[#9B51E0] text-center font-semibold text-base sm:text-lg">Patient Experience</h2>
        <div className="text-sm text-[#9B51E0] font-medium cursor-pointer hover:text-[#7C3AED] transition-colors">View All &gt;</div>
      </div>
    
      {[
        { id: "patient1", name: "Priya Sharma", image: "/icons/doctor.png", text: "Amazing experience! The doctor was very attentive and explained everything clearly. Highly recommended!", rating: 4 },
        { id: "patient2", name: "Rahul Verma", image: "/icons/doctor.png", text: "Professional service with great care. The consultation was thorough and the staff was very helpful.", rating: 5 },
        { id: "patient3", name: "Sneha Patel", image: "/icons/doctor.png", text: "Very satisfied with the treatment. Clean facility and friendly doctors. Will definitely visit again.", rating: 3 }
      ].map((doctor, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl w-full max-w-[310px] md:w-[348px] md:max-w-[348px] h-[70px] sm:h-[82px] md:h-[92px] flex flex-row gap-2 sm:gap-[12px] py-3 sm:py-[16px] px-2 sm:px-[12px] mb-2 sm:mb-3 ${i % 2 === 0 ? 'ml-0' : 'ml-auto'}`}
        >
          <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-10 md:w-10 rounded-full overflow-hidden flex-shrink-0">
            <img className="object-cover h-8 w-8 sm:h-10 sm:w-10 md:h-10 md:w-10" src={doctor.image} alt={doctor.name} />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h2 className="capitalize font-medium text-xs sm:text-sm truncate">{doctor.name}</h2>
              <div className="flex gap-1 flex-shrink-0">
                <StarRating rating={doctor.rating || 5} size="xs" />
              </div>
            </div>
            <p className="text-[7px] sm:text-[8.31px] text-gray-600 line-clamp-2 leading-tight">{doctor.text}</p>
          </div>
        </div>
      ))}
    
      <div className="flex justify-center mt-2 mb-1">
        <button 
          className="bg-black text-white text-xs py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors"
          onClick={() => {
            try {
              if (isLoggedIn()) {
                // For demo purposes, we'll use the first doctor ID
                handleOpenModal("doctor1");
              } else {
                // Show error message instead of alert
                showErrorMessage('Please log in to submit a review');
                // Optional: Save current page to redirect back after login
                try {
                  localStorage.setItem('redirect_after_login', window.location.pathname);
                  // Delay redirect to allow user to see the error message
                  setTimeout(() => {
                    window.location.href = '/login';
                  }, 1500);
                } catch (storageErr) {
                  console.error('Error saving redirect path:', storageErr);
                  // Still redirect even if storage fails
                  setTimeout(() => {
                    window.location.href = '/login';
                  }, 1500);
                }
              }
            } catch (err) {
              showErrorMessage('An error occurred. Please try again.');
              console.error('Error in review button click handler:', err);
            }
          }}
        >
          Post a review
        </button>
      </div>
      
      {/* Review Modal */}
      <ReviewModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        doctorId={selectedDoctorId}
        onReviewSubmitted={handleReviewSubmitted}
        onError={(errorMsg) => showErrorMessage(errorMsg)}
      />
    </div>
  );
}


