import React, { useState } from 'react';
import { submitReview } from '../../services/reviewAPI';

const ReviewForm = ({ doctorId, onReviewSubmitted, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Get auth token from localStorage
  const getToken = () => {
    const authStore = JSON.parse(localStorage.getItem('auth-store'));
    return authStore?.state?.token;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Please log in to submit a review');
      }
      
      await submitReview({ doctorId, rating, comment }, token);
      setComment('');
      setRating(5);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
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
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
            placeholder="Share your experience with this doctor..."
            required
          />
        </div>
        
        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              disabled={submitting}
            >
              Cancel
            </button>
          )}
          
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
  );
};

export default ReviewForm;