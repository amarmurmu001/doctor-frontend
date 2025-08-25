import React, { useState, useEffect } from 'react';
import { fetchDoctorReviews } from '../services/reviewAPI';
import ReviewForm from './reviews/ReviewForm';

const ReviewTab = ({ doctorId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Get auth token from localStorage
  const getToken = () => {
    const authStore = JSON.parse(localStorage.getItem('auth-store'));
    return authStore?.state?.token;
  };
  
  // Check if user is logged in
  const isLoggedIn = () => {
    return !!getToken();
  };
  
  // Load reviews
  const loadReviews = async () => {
    if (!doctorId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchDoctorReviews(doctorId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load reviews on component mount and when doctorId changes
  useEffect(() => {
    loadReviews();
  }, [doctorId]);
  
  // Handle review submission
  const handleReviewSubmitted = () => {
    setShowForm(false);
    loadReviews(); // Reload reviews after submission
  };
  
  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <img 
            key={star} 
            className="w-4 h-4" 
            src={star <= rating ? "/icons/icon.png" : "/icons/star-empty.png"} 
            alt="star" 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      ) : (
        <>
          {reviews.length > 0 ? (
            <>
              <div className="flex justify-between mb-4">
                <div className="text-sm text-gray-500">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</div>
                {reviews.length > 5 && (
                  <div className="text-sm text-[#9B51E0] font-medium cursor-pointer">See all &gt;</div>
                )}
              </div>
              
              {/* Display reviews */}
              {reviews.slice(0, 5).map((review, index) => (
                <div key={review._id || index} className="bg-[#F2F1F9] rounded-[20px] p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
                      <img 
                        className="object-cover h-12 w-12" 
                        src="/icons/shape.png" 
                        alt={review.patient?.name || 'Anonymous'} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/icons/user-placeholder.png';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{review.patient?.name || 'Anonymous'}</h3>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {review.comment || 'No comment provided.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </>
      )}
      
      {showForm ? (
        <ReviewForm 
          doctorId={doctorId} 
          onReviewSubmitted={handleReviewSubmitted} 
          onCancel={() => setShowForm(false)} 
        />
      ) : (
        <div className="flex justify-center mt-2 mb-1">
          <button 
            className="bg-black text-white text-xs py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors"
            onClick={() => {
              if (isLoggedIn()) {
                setShowForm(true);
              } else {
                // Redirect to login or show login prompt
                alert('Please log in to submit a review');
                // Optional: Save current page to redirect back after login
                localStorage.setItem('redirect_after_login', window.location.pathname);
                window.location.href = '/login';
              }
            }}
          >
            Post a review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewTab;
