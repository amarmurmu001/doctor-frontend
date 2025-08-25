import React, { useState, useEffect } from 'react';
import { submitReview } from '../../services/reviewAPI';

const ReviewModal = ({ isOpen, onClose, doctorId, onReviewSubmitted, onError }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  // Reset form state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setValidationErrors({});
    }
  }, [isOpen]);
  
  // Get auth token from localStorage
  const getToken = () => {
    try {
      const authStore = JSON.parse(localStorage.getItem('auth-store'));
      return authStore?.state?.token;
    } catch (err) {
      console.error('Error parsing auth data:', err);
      return null;
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    
    if (!comment.trim()) {
      errors.comment = 'Please provide a review comment';
    } else if (comment.trim().length < 5) {
      errors.comment = 'Comment must be at least 5 characters';
    }
    
    if (!rating || rating < 1 || rating > 5) {
      errors.rating = 'Please select a rating between 1 and 5';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required. Please log in to submit a review.');
      }
      
      if (!doctorId) {
        throw new Error('Doctor information is missing. Please try again.');
      }
      
      await submitReview({ doctorId, rating, comment }, token);
      setComment('');
      setRating(5);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      onClose();
    } catch (err) {
      // Prepare error message
      let errorMessage;
      if (err.message.includes('401') || err.message.includes('auth')) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.message.includes('404')) {
        errorMessage = 'Doctor not found. Please try again later.';
      } else if (err.message.includes('429')) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (err.message.includes('network') || err.message.includes('connection')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = err.message || 'Failed to submit review. Please try again later.';
      }
      
      // Set local error state
      setError(errorMessage);
      
      // If parent component provided onError callback, use it
      if (onError && typeof onError === 'function') {
        onError(errorMessage);
      }
      
      console.error('Review submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Write a Review</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <img 
                    className="w-6 h-6" 
                    src={star <= rating ? "/icons/icon.png" : "/icons/star-empty.png"} 
                    alt={`${star} star`} 
                  />
                </button>
              ))}
            </div>
            {validationErrors.rating && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.rating}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                // Clear validation error when user starts typing
                if (validationErrors.comment && e.target.value.trim().length >= 5) {
                  setValidationErrors(prev => ({ ...prev, comment: null }));
                }
              }}
              rows="4"
              className={`w-full border ${validationErrors.comment ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all`}
              placeholder="Share your experience with this doctor..."
            />
            {validationErrors.comment && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.comment}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              disabled={submitting}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="bg-black text-white text-sm py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;