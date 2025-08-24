import { useState, useCallback, useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../services/adminAPI';
import { DEFAULT_PAGINATION } from '../constants/blogConstants';

export const useBlogManagement = () => {
  const { token } = useAuthStore();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchBlogs = useCallback(async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await getAllBlogs(token);
      
      if (response?.success && response?.data) {
        const blogsArray = Array.isArray(response.data) ? response.data : 
                          Array.isArray(response.data.blogs) ? response.data.blogs : [];
        
        setBlogs(blogsArray);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleCreate = useCallback(async (blogData) => {
    try {
      setLoading(true);
      setError('');
      await createBlog(blogData, token);
      await fetchBlogs();
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  }, [token, fetchBlogs]);

  const handleUpdate = useCallback(async (id, blogData) => {
    try {
      setLoading(true);
      setError('');
      await updateBlog(id, blogData, token);
      await fetchBlogs();
      setShowModal(false);
      setEditItem(null);
    } catch (err) {
      setError(err.message || 'Failed to update blog');
    } finally {
      setLoading(false);
    }
  }, [token, fetchBlogs]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await deleteBlog(id, token);
      await fetchBlogs();
    } catch (err) {
      setError(err.message || 'Failed to delete blog');
    } finally {
      setLoading(false);
    }
  }, [token, fetchBlogs]);

  const openCreateModal = useCallback(() => {
    setEditItem(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((blog) => {
    setEditItem(blog);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditItem(null);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    showModal,
    editItem,
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreateModal,
    openEditModal,
    closeModal
  };
};
