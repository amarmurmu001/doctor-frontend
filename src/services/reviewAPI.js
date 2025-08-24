const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetch reviews for a specific doctor
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise<Array>} - Array of reviews
 */
export async function fetchDoctorReviews(doctorId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reviews/doctor/${doctorId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching doctor reviews:', error);
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
 */
export async function submitReview(reviewData, token) {
  try {
    if (!token) {
      throw new Error('Authentication required to submit a review');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to submit review');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
}