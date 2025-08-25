import { handleResponse } from './utils';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get all blog posts with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.search - Search term for title or content
 * @param {string} options.category - Filter by category
 * @param {string} options.status - Filter by status (published, draft)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Paginated blog data
 */
export async function getBlogs(options = {}, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const params = new URLSearchParams({
    page: options.page || 1,
    limit: options.limit || 10,
    ...(options.search && { search: options.search }),
    ...(options.category && { category: options.category }),
    ...(options.status && { status: options.status })
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/blogs?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await handleResponse(response, 'Failed to fetch blogs');
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

/**
 * Create or update blog post
 * @param {Object} blogData - Blog data
 * @param {string} blogData.id - Blog ID (optional, for updates)
 * @param {string} blogData.title - Blog title
 * @param {string} blogData.content - Blog content
 * @param {string} blogData.category - Blog category
 * @param {string} blogData.status - Blog status (published, draft)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Created/updated blog data
 */
export async function saveBlog(blogData, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const isUpdate = Boolean(blogData.id);
  const url = isUpdate 
    ? `${API_BASE_URL}/api/admin/blogs/${blogData.id}` 
    : `${API_BASE_URL}/api/admin/blogs`;
  
  try {
    const response = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blogData)
    });
    
    return await handleResponse(response, `Failed to ${isUpdate ? 'update' : 'create'} blog`);
  } catch (error) {
    console.error(`Error ${isUpdate ? 'updating' : 'creating'} blog:`, error);
    throw error;
  }
}

/**
 * Delete blog post
 * @param {string} blogId - Blog ID
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Response data
 */
export async function deleteBlog(blogId, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/blogs/${blogId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await handleResponse(response, 'Failed to delete blog');
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
}
