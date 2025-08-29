import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageSeo from '../components/seo/PageSeo';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import BlogCard from '../components/blogs/BlogCard';
import { getPublishedBlogs, getBlogsByCategory, getBlogCategories, searchBlogs } from '../services/publicBlogsAPI';

const Blog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  // Get URL parameters
  const currentCategory = searchParams.get('category');
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search');

  // Load blogs based on current filters
  useEffect(() => {
    loadBlogs();
  }, [currentCategory, currentPage, searchQuery]);

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    setError('');
    
    try {
      let response;
      
      if (searchQuery) {
        response = await searchBlogs(searchQuery, { 
          page: currentPage, 
          limit: 12,
          category: currentCategory 
        });
      } else if (currentCategory) {
        response = await getBlogsByCategory(currentCategory, { 
          page: currentPage, 
          limit: 12 
        });
      } else {
        response = await getPublishedBlogs({ 
          page: currentPage, 
          limit: 12 
        });
      }

      if (response.success) {
        setBlogs(response.data.blogs);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total
        });
      }
    } catch (err) {
      setError('Failed to load blogs. Please try again later.');
      console.error('Error loading blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await getBlogCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') {
      params.set('category', category);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    navigate(`/blog?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams();
    if (currentCategory) {
      params.set('category', currentCategory);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (page > 1) {
      params.set('page', page.toString());
    }
    navigate(`/blog?${params.toString()}`);
  };

  const handleSearch = (query) => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('search', query.trim());
    }
    if (currentCategory) {
      params.set('category', currentCategory);
    }
    navigate(`/blog?${params.toString()}`);
  };

  // Generate breadcrumbs
  const getBreadcrumbs = () => {
    const items = [{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }];
    
    if (currentCategory) {
      items.push({
        label: currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1),
        href: `/blog?category=${currentCategory}`
      });
    }
    
    return items;
  };

  // Get page title
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    if (currentCategory) {
      return `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Articles`;
    }
    return 'Latest Health Articles & Medical Insights';
  };

  const getPageDescription = () => {
    if (currentCategory) {
      return `Read the latest ${currentCategory} articles and insights from DOCTAR's verified healthcare professionals.`;
    }
    return 'Read the latest healthcare news, medical tips, and articles from DOCTAR. Stay informed about health trends, medical innovations, and wellness advice.';
  };

  return (
    <>
      <PageSeo
        title={`${getPageTitle()} | DOCTAR Blog`}
        description={getPageDescription()}
        keywords="health blog, medical articles, healthcare news, wellness tips, medical advice, health information"
        canonicalUrl="https://www.doctar.in/blog"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <Breadcrumbs items={getBreadcrumbs()} className="mb-4" />
            
            {/* Title and Description */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {getPageTitle()}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                {getPageDescription()}
              </p>
              {pagination.total > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing {blogs.length} of {pagination.total} articles
                </p>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  defaultValue={searchQuery || ''}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7551B2] focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e.target.value);
                    }
                  }}
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      !currentCategory 
                        ? 'bg-[#7551B2] text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All Articles ({pagination.total})
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors capitalize ${
                        currentCategory === category 
                          ? 'bg-[#7551B2] text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7551B2] border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                  <button 
                    onClick={loadBlogs}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : blogs.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">
                    {searchQuery 
                      ? `No articles match your search for "${searchQuery}"`
                      : currentCategory 
                        ? `No articles found in ${currentCategory} category`
                        : 'No articles have been published yet'
                    }
                  </p>
                  {(searchQuery || currentCategory) && (
                    <button 
                      onClick={() => navigate('/blog')}
                      className="mt-4 px-4 py-2 bg-[#7551B2] text-white rounded-md hover:bg-[#6441a0] transition-colors"
                    >
                      View All Articles
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Blog Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {blogs.map((blog) => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        {[...Array(pagination.totalPages)].map((_, index) => {
                          const page = index + 1;
                          const isCurrentPage = page === pagination.currentPage;
                          
                          // Show first page, last page, current page, and pages around current
                          const showPage = page === 1 || 
                            page === pagination.totalPages || 
                            Math.abs(page - pagination.currentPage) <= 1;
                          
                          if (!showPage) {
                            // Show ellipsis
                            if (page === 2 && pagination.currentPage > 4) {
                              return <span key={page} className="px-3 py-2 text-sm text-gray-500">...</span>;
                            }
                            if (page === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 3) {
                              return <span key={page} className="px-3 py-2 text-sm text-gray-500">...</span>;
                            }
                            return null;
                          }
                          
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                isCurrentPage
                                  ? 'bg-[#7551B2] text-white'
                                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;