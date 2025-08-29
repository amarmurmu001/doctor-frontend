const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';

/**
 * Get published blogs with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.category - Filter by category
 * @returns {Promise<Object>} - Paginated blog data
 */
export async function getPublishedBlogs(options = {}) {
  const params = new URLSearchParams({
    page: options.page || 1,
    limit: options.limit || 12,
    status: 'published', // Only get published blogs
    ...(options.category && { category: options.category })
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    throw error;
  }
}

/**
 * Get blog by ID
 * @param {string} blogId - Blog ID
 * @returns {Promise<Object>} - Blog data
 */
export async function getBlogById(blogId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
}

/**
 * Get blogs by category
 * @param {string} category - Category name
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Paginated blog data
 */
export async function getBlogsByCategory(category, options = {}) {
  const params = new URLSearchParams({
    page: options.page || 1,
    limit: options.limit || 12
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/category/${category}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    throw error;
  }
}

/**
 * Search blogs
 * @param {string} query - Search query
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Search results
 */
export async function searchBlogs(query, options = {}) {
  const params = new URLSearchParams({
    q: query,
    page: options.page || 1,
    limit: options.limit || 12,
    ...(options.category && { category: options.category })
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/search?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching blogs:', error);
    throw error;
  }
}

/**
 * Get unique categories from published blogs
 * @returns {Promise<Array>} - List of categories
 */
export async function getBlogCategories() {
  try {
    // Get all published blogs and extract unique categories
    const response = await fetch(`${API_BASE_URL}/api/blogs?status=published&limit=1000`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch categories: HTTP ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data || !data.data.blogs) {
      console.warn('Invalid response structure for categories');
      return [];
    }
    
    const categories = [...new Set(data.data.blogs.map(blog => blog.category))];
    
    return categories.filter(cat => cat && cat.trim());
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}
