const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';

/**
 * Get all users with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.search - Search term for name or email
 * @param {string} options.role - Filter by role (patient, doctor, admin)
 * @param {string} options.status - Filter by status (verified, unverified)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Paginated users data
 */
export async function getUsers(options = {}, token) {
  if (!token) {
    throw new Error('Authentication required');
  }

  const params = new URLSearchParams({
    page: options.page || 1,
    limit: options.limit || 10,
    ...(options.search && { search: options.search }),
    ...(options.role && { role: options.role }),
    ...(options.status && { status: options.status })
  });

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await handleResponse(response, 'Failed to fetch users');
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

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
 * Get all doctors with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.search - Search term for name or email
 * @param {string} options.specialty - Filter by specialty
 * @param {string} options.status - Filter by status (active, inactive, pending)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Paginated doctors data
 */
export async function getDoctors(options = {}, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const params = new URLSearchParams({
    page: options.page || 1,
    limit: options.limit || 10,
    ...(options.search && { search: options.search }),
    ...(options.specialty && { specialty: options.specialty }),
    ...(options.status && { status: options.status })
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/doctors?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await handleResponse(response, 'Failed to fetch doctors');
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

/**
 * Get all appointments with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.search - Search term for patient or doctor name
 * @param {string} options.status - Filter by status (scheduled, completed, cancelled)
 * @param {string} options.date - Filter by date (YYYY-MM-DD)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Paginated appointments data
 */
export async function getAppointments(options = {}, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const params = new URLSearchParams({
    page: options.page || 1,
    limit: options.limit || 10,
    ...(options.search && { search: options.search }),
    ...(options.status && { status: options.status }),
    ...(options.date && { date: options.date })
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/appointments?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await handleResponse(response, 'Failed to fetch appointments');
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

/**
 * Get all content items (blogs/news) with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.search - Search term for title or content
 * @param {string} options.category - Filter by category
 * @param {string} options.status - Filter by status (published, draft)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Paginated content data
 */
export async function getContent(options = {}, token) {
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
    const response = await fetch(`${API_BASE_URL}/api/admin/content?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await handleResponse(response, 'Failed to fetch content');
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}

/**
 * Get dashboard statistics
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Dashboard statistics including user counts, appointments, news, and blogs
 */
export async function getDashboardStats(token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await handleResponse(response, 'Failed to fetch dashboard statistics');
    
    // If in development mode and no stats available, provide mock data
    if (import.meta.env.DEV && (!data || Object.keys(data).length === 0)) {
      return {
        users: 150,
        doctors: 45,
        appointments: 289,
        news: 24,
        blogs: 36,
        pendingApprovals: 8,
        recentActivity: [
          {
            type: 'user_registration',
            message: 'New user <strong>John Doe</strong> registered',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
          },
          {
            type: 'doctor_update',
            message: 'Doctor <strong>Dr. Sarah Smith</strong> updated their profile',
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
          },
          {
            type: 'appointment',
            message: 'New appointment booked with <strong>Dr. Mike Johnson</strong>',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
          },
          {
            type: 'news',
            message: 'New article published: <strong>Latest Medical Breakthroughs</strong>',
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
          },
          {
            type: 'blog',
            message: 'New blog post: <strong>10 Tips for Better Health</strong>',
            timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString()
          }
        ]
      };
    }

    return data;
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    throw error;
  }
}

/**
 * Delete a user
 * @param {string} userId - User ID
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Response data
 */
export async function deleteUser(userId, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await handleResponse(response, 'Failed to delete user');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Update user status (activate/deactivate)
 * @param {string} userId - User ID
 * @param {string} status - New status (active, inactive)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Updated user data
 */
export async function updateUserStatus(userId, status, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    
    return await handleResponse(response, 'Failed to update user status');
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
}

/**
 * Update doctor approval status
 * @param {string} doctorId - Doctor ID
 * @param {string} status - New status (approved, rejected)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Updated doctor data
 */
export async function updateDoctorApproval(doctorId, status, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}/approval`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    
    return await handleResponse(response, 'Failed to update doctor approval status');
  } catch (error) {
    console.error('Error updating doctor approval status:', error);
    throw error;
  }
}

export async function addDoctorAward(doctorId, awardData, imageFile, token) {
  const formData = new FormData();
  formData.append('title', awardData.title);
  formData.append('year', awardData.year.toString());
  formData.append('institute', awardData.institute);
  
  if (imageFile) {
    formData.append('awardImage', imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}/awards`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to add award');
  }

  return response.json();
}

// Update award with image
export async function updateDoctorAward(doctorId, awardIndex, awardData, imageFile, token) {
  const formData = new FormData();
  
  if (awardData.title) formData.append('title', awardData.title);
  if (awardData.year) formData.append('year', awardData.year.toString());
  if (awardData.institute) formData.append('institute', awardData.institute);
  
  if (imageFile) {
    formData.append('awardImage', imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}/awards/${awardIndex}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to update award');
  }

  return response.json();
}

// Delete award
export async function deleteDoctorAward(doctorId, awardIndex, token) {
  const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}/awards/${awardIndex}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to delete award');
  }

  return response.json();
}

/**
 * Create or update content item
 * @param {Object} contentData - Content data
 * @param {string} contentData.id - Content ID (optional, for updates)
 * @param {string} contentData.title - Content title
 * @param {string} contentData.content - Content body
 * @param {string} contentData.category - Content category
 * @param {string} contentData.status - Content status (published, draft)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Created/updated content data
 */
export async function saveContent(contentData, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const isUpdate = Boolean(contentData.id);
  const url = isUpdate 
    ? `${API_BASE_URL}/api/admin/content/${contentData.id}` 
    : `${API_BASE_URL}/api/admin/content`;
  
  try {
    const response = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(contentData)
    });
    
    return await handleResponse(response, `Failed to ${isUpdate ? 'update' : 'create'} content`);
  } catch (error) {
    console.error(`Error ${isUpdate ? 'updating' : 'creating'} content:`, error);
    throw error;
  }
}

/**
 * Delete content item
 * @param {string} contentId - Content ID
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Response data
 */
export async function deleteContent(contentId, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/content/${contentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await handleResponse(response, 'Failed to delete content');
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

/**
 * Get all news with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.search - Search term for title or content
 * @param {string} options.category - Filter by category
 * @param {string} options.status - Filter by status (published, draft)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Paginated news data
 */
export async function getAllNews(token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log('Fetching all news');
    const response = await fetch(`${API_BASE_URL}/api/news`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API Success Response:', result);
    
    // Handle both possible response formats
    return {
      success: true,
      data: {
        news: Array.isArray(result) ? result : (result.data?.news || result.news || []),
        total: result.total || result.data?.total || 0,
        totalPages: result.totalPages || result.data?.totalPages || 1,
        currentPage: result.currentPage || result.data?.currentPage || 1
      }
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

/**
 * Create a new news item
 * @param {Object} newsData - News data
 * @param {string} newsData.title - News title
 * @param {string} newsData.content - News content
 * @param {string} newsData.category - News category
 * @param {string} newsData.status - News status (published, draft)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Created news data
 */
export async function createNews(newsData, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log('Creating news with data:', newsData);
    const response = await fetch(`${API_BASE_URL}/api/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newsData)
    });
    
    const result = await handleResponse(response, 'Failed to create news');
    console.log('Create news response:', result);
    return result;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
}

/**
 * Update an existing news item
 * @param {string} newsId - News ID
 * @param {Object} newsData - News data
 * @param {string} newsData.title - News title
 * @param {string} newsData.content - News content
 * @param {string} newsData.category - News category
 * @param {string} newsData.status - News status (published, draft)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Updated news data
 */
export async function updateNews(newsId, newsData, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log('Updating news with data:', { newsId, ...newsData });
    const response = await fetch(`${API_BASE_URL}/api/news/${newsId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newsData)
    });
    
    const result = await handleResponse(response, 'Failed to update news');
    console.log('Update news response:', result);
    return result;
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
}

/**
 * Delete a news item
 * @param {string} newsId - News ID
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Response data
 */
export async function deleteNews(newsId, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log('Deleting news:', newsId);
    const response = await fetch(`${API_BASE_URL}/api/news/${newsId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await handleResponse(response, 'Failed to delete news');
    console.log('Delete news response:', result);
    return result;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
}

/**
 * Get all blogs with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.search - Search term for title or content
 * @param {string} options.category - Filter by category
 * @param {string} options.status - Filter by status (published, draft)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Paginated blogs data
 */
export async function getAllBlogs(token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log('Fetching all blogs');

    const response = await fetch(`${API_BASE_URL}/api/blogs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API Success Response:', result);
    
    // Handle both possible response formats
    return {
      success: true,
      data: {
        blogs: Array.isArray(result) ? result : (result.data?.blogs || result.blogs || []),
        total: result.total || result.data?.total || 0,
        totalPages: result.totalPages || result.data?.totalPages || 1,
        currentPage: result.currentPage || result.data?.currentPage || options.page || 1
      }
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

/**
 * Create a new blog post
 * @param {Object} blogData - Blog data
 * @param {string} blogData.title - Blog title
 * @param {string} blogData.content - Blog content
 * @param {string} blogData.category - Blog category
 * @param {string} blogData.status - Blog status (published, draft)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Created blog data
 */
export async function createBlog(blogData, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log('Creating blog with data:', blogData);
    const response = await fetch(`${API_BASE_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blogData)
    });
    
    const result = await handleResponse(response, 'Failed to create blog');
    console.log('Create blog response:', result);
    return result;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
}

/**
 * Update an existing blog post
 * @param {string} blogId - Blog ID
 * @param {Object} blogData - Blog data
 * @param {string} blogData.title - Blog title
 * @param {string} blogData.content - Blog content
 * @param {string} blogData.category - Blog category
 * @param {string} blogData.status - Blog status (published, draft)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Updated blog data
 */
export async function updateBlog(blogId, blogData, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log('Updating blog with data:', { blogId, ...blogData });
    const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blogData)
    });
    
    const result = await handleResponse(response, 'Failed to update blog');
    console.log('Update blog response:', result);
    return result;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
}

/**
 * Delete a blog post
 * @param {string} blogId - Blog ID
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - Response data
 */
export async function deleteBlog(blogId, token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log('Deleting blog:', blogId);
    const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await handleResponse(response, 'Failed to delete blog');
    console.log('Delete blog response:', result);
    return result;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
}