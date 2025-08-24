const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Helper function to handle API response errors
 * @param {Response} response - Fetch API response
 * @param {string} defaultMessage - Default error message
 * @returns {Promise<any>} - JSON response if successful
 * @throws {Error} - Error with appropriate message if response is not ok
 */
async function handleResponse(response, defaultMessage) {
  if (!response.ok) {
    // Try to parse error response as JSON
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || defaultMessage;
    } catch (e) {
      // If parsing fails, use status text or default message
      errorMessage = `${defaultMessage}: ${response.status} ${response.statusText}`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  
  return response.json();
}

/**
 * Fetch reviews for a specific doctor
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise<Array>} - Array of reviews
 */
export async function fetchDoctorReviews(doctorId) {
  if (!doctorId) {
    throw new Error('Doctor ID is required to fetch reviews');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/reviews/doctor/${doctorId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    return await handleResponse(response, 'Failed to fetch reviews');
  } catch (error) {
    console.error('Error fetching doctor reviews:', error);
    
    // Network errors
    if (error.message === 'Failed to fetch' || !navigator.onLine) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw error;
  }
}

/**
 * Submit a new review for a doctor
 * @param {Object} reviewData - The review data
 * @param {string} reviewData.doctorId - The ID of the doctor being reviewed
 * @param {number} reviewData.rating - Rating from 1-5
 * @param {string} reviewData.comment - Review comment
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - The created review
 * @throws {Error} - Error with appropriate message if submission fails
 */
export async function submitReview(reviewData, token) {
  // Validate input parameters
  if (!reviewData) {
    throw new Error('Review data is required');
  }
  
  if (!reviewData.doctorId) {
    throw new Error('Doctor ID is required to submit a review');
  }
  
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  if (!reviewData.comment || reviewData.comment.trim().length < 5) {
    throw new Error('Comment is required and must be at least 5 characters');
  }
  
  if (!token) {
    throw new Error('Authentication required to submit a review');
  }
  
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    return await handleResponse(response, 'Failed to submit review');
  } catch (error) {
    console.error('Error submitting review:', error);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again later.');
    }
    
    if (error.message === 'Failed to fetch' || !navigator.onLine) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    if (error.status === 401 || error.status === 403) {
      throw new Error('Your session has expired. Please log in again.');
    }
    
    if (error.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    
    throw error;
  }
}