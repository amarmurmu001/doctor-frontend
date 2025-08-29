import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageSeo from '../components/seo/PageSeo';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { getBlogById } from '../services/publicBlogsAPI';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getBlogById(slug);
      
      if (response.success) {
        setBlog(response.data);
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      setError('Failed to load blog post. Please try again later.');
      console.error('Error loading blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBreadcrumbs = () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' }
    ];
    
    if (blog?.category) {
      items.push({
        label: blog.category.charAt(0).toUpperCase() + blog.category.slice(1),
        href: `/blog?category=${blog.category}`
      });
    }
    
    if (blog?.title) {
      items.push({
        label: blog.title.length > 50 ? blog.title.substring(0, 50) + '...' : blog.title,
        href: `/blog/${blog.slug || blog._id}`
      });
    }
    
    return items;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-700 mb-4">Blog Post Not Found</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={() => navigate('/blog')}
                className="px-6 py-3 bg-[#7551B2] text-white rounded-md hover:bg-[#6441a0] transition-colors"
              >
                Back to Blog
              </button>
              <button 
                onClick={loadBlog}
                className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageSeo
        title={`${blog.title} | DOCTAR Blog`}
        description={blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'}
        keywords={blog.tags ? blog.tags.join(', ') : 'health, medical, healthcare'}
        canonicalUrl={`https://www.doctar.in/blog/${blog.slug || blog._id}`}
        image={blog.featured_image?.url}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <Breadcrumbs items={getBreadcrumbs()} className="mb-6" />
            
            {/* Category Badge */}
            <div className="mb-4">
              <button
                onClick={() => navigate(`/blog?category=${blog.category}`)}
                className="inline-block bg-[#7551B2] text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-[#6441a0] transition-colors"
              >
                {blog.category}
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>By {blog.author}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <time dateTime={blog.created_at}>
                  {formatDate(blog.created_at)}
                </time>
              </div>

              {blog.updated_at && blog.updated_at !== blog.created_at && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  <span>Updated {formatDate(blog.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Featured Image */}
            {blog.featured_image?.url && (
              <div className="w-full h-64 md:h-80 lg:h-96">
                <img 
                  src={blog.featured_image.url} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8 lg:p-12">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-default"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </button>

            <button
              onClick={() => navigate(`/blog?category=${blog.category}`)}
              className="inline-flex items-center px-6 py-3 bg-[#7551B2] text-white rounded-md hover:bg-[#6441a0] transition-colors"
            >
              More in {blog.category}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
