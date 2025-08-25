/**
 * Helper function to handle API response errors
 * @param {Response} response - Fetch API response
 * @param {string} defaultMessage - Default error message
 * @returns {Promise<any>} - JSON response if successful
 * @throws {Error} - Error with appropriate message if response is not ok
 */
export async function handleResponse(response, defaultMessage) {
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
