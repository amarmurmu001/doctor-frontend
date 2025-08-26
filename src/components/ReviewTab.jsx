import React, { useState, useEffect } from 'react';
import { fetchDoctorReviews } from '../services/reviewAPI';
import ReviewForm from './reviews/ReviewForm';

const ReviewTab = ({ doctorId }) => {
  console.log('Rendering ReviewTab for doctorId:', doctorId);
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Get auth token from localStorage
  const getToken = () => {
    try {
      const authStore = JSON.parse(localStorage.getItem('auth-store'));
      return authStore?.state?.token;
    } catch {
      return null;
    }
  };
  
  // Check if user is logged in
  const isLoggedIn = () => {
    return !!getToken();
  };
  
  // Load reviews with enhanced debugging
  const loadReviews = async () => {
    
    if (!doctorId) {
      console.log('No doctorId, skipping fetch');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchDoctorReviews(doctorId);
      console.log('Fetched reviews - raw data:', data);
      console.log('Type of data:', typeof data);
      console.log('Is array:', Array.isArray(data));
      
      // Enhanced data parsing to handle different response formats
      let reviewsData = [];
      
      if (Array.isArray(data)) {
        reviewsData = data;
      } else if (data && data.success && Array.isArray(data.data)) {
        reviewsData = data.data;
      } else if (data && data.data && Array.isArray(data.data.reviews)) {
        reviewsData = data.data.reviews;
      } else if (data && Array.isArray(data.reviews)) {
        reviewsData = data.reviews;
      }
      
      console.log('Processed reviews data:', reviewsData);
      console.log('Reviews count:', reviewsData.length);
      
      setReviews(reviewsData);
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
    console.log('Rendering stars for rating:', rating);
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <img 
            key={star} 
            className="w-4 h-4" 
            src={star <= rating ? "/icons/star-filled.png" : "/icons/star-empty.png"} 
            alt="star" 
          />
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading reviews...</p>
          <p className="text-xs text-gray-400 mt-2">Doctor ID: {doctorId}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
          <button 
            onClick={loadReviews} 
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="space-y-6">
      
      
      {reviews && reviews.length > 0 ? (
        <>
          <div className="flex justify-between mb-4">
            <div className="text-sm text-gray-500">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </div>
            {reviews.length > 5 && (
              <div className="text-sm text-[#9B51E0] font-medium cursor-pointer">
                See all &gt;
              </div>
            )}
          </div>
          
          {/* Display reviews */}
          {reviews.slice(0, 5).map((review, index) => {
            console.log('Rendering review:', review);
            return (
              <div 
                key={review._id || review.id || `review-${index}`} 
                className="bg-[#F2F1F9] rounded-[20px] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
                    <img 
                      className="object-cover h-12 w-12" 
                      src={review.patient?.image?.url || "/icons/user-placeholder.png"} 
                      alt={review.patient?.name || 'Anonymous'} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/icons/user-placeholder.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {review.patient?.name || 'Anonymous User'}
                      </h3>
                      {renderStars(review.rating || 0)}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {review.comment || 'No comment provided.'}
                    </p>
                    {review.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
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
                alert('Please log in to submit a review');
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
