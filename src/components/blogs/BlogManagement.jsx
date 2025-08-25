import React from 'react';
import { useBlogManagement } from '../../hooks/useBlogManagement';
import { BlogList } from './BlogList';
import { BlogForm } from './BlogForm';
import { BLOG_STATUS } from '../../constants/blogConstants';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';

export const BlogManagement = () => {
  const {
    blogs,
    loading,
    error,
    selectedBlog,
    showForm,
    status,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleFormSubmit,
    handleFormClose,
    setStatus,
  } = useBlogManagement();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Management</h1>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setStatus(BLOG_STATUS.ALL)}
              className={`px-4 py-2 rounded-md ${
                status === BLOG_STATUS.ALL
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatus(BLOG_STATUS.PUBLISHED)}
              className={`px-4 py-2 rounded-md ${
                status === BLOG_STATUS.PUBLISHED
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatus(BLOG_STATUS.DRAFT)}
              className={`px-4 py-2 rounded-md ${
                status === BLOG_STATUS.DRAFT
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Drafts
            </button>
          </div>
          <button
            onClick={() => handleEdit(null)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            New Blog
          </button>
        </div>
      </div>

      <BlogList
        blogs={blogs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        status={status}
      />

      {showForm && (
        <BlogForm
          blog={selectedBlog}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};
