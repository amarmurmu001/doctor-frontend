import { getPublishedBlogs } from '../services/publicBlogsAPI';
import { fetchDoctorsByLocation } from '../services/doctorAPI';

// Base URL for your website
const BASE_URL = import.meta.env.VITE_FRONTEND_URL || 'https://doctar.in';

// Static routes with their priority and change frequency
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/help', priority: '0.7', changefreq: 'monthly' },
  { path: '/careers', priority: '0.6', changefreq: 'monthly' },
  { path: '/press', priority: '0.6', changefreq: 'monthly' },
  { path: '/developers', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { path: '/terms', priority: '0.4', changefreq: 'yearly' },
  { path: '/pci-terms', priority: '0.4', changefreq: 'yearly' },
  { path: '/directory', priority: '0.8', changefreq: 'weekly' },
  { path: '/search-doctors', priority: '0.9', changefreq: 'daily' },
  { path: '/search-hospitals', priority: '0.8', changefreq: 'weekly' },
  { path: '/search-clinics', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/x', priority: '0.7', changefreq: 'weekly' },
  { path: '/categories', priority: '0.7', changefreq: 'weekly' },
  { path: '/doctor-mapped', priority: '0.7', changefreq: 'weekly' },
];

// Major cities/locations for doctor profiles
const MAJOR_LOCATIONS = [
  'mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'kolkata',
  'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
  'indore', 'thane', 'bhopal', 'visakhapatnam', 'patna', 'vadodara',
  'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut',
  'rajkot', 'kalyan', 'vasai', 'vashi', 'aurangabad', 'noida'
];

// Doctor specializations for category pages
const DOCTOR_SPECIALIZATIONS = [
  'cardiologist', 'dermatologist', 'orthopedist', 'neurologist',
  'psychiatrist', 'pediatrician', 'gynecologist', 'ophthalmologist',
  'dentist', 'ent-specialist', 'urologist', 'nephrologist',
  'endocrinologist', 'gastroenterologist', 'pulmonologist', 'oncologist',
  'rheumatologist', 'allergist', 'surgeon', 'general-physician'
];

/**
 * Generate XML sitemap content
 * @param {Array} urls - Array of URL objects with path, priority, changefreq, lastmod
 * @returns {string} - XML sitemap content
 */
function generateSitemapXML(urls) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';
  
  const urlEntries = urls.map(url => {
    const lastmod = url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : '';
    const priority = url.priority ? `<priority>${url.priority}</priority>` : '';
    const changefreq = url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : '';
    
    return `  <url>
    <loc>${BASE_URL}${url.path}</loc>
    ${lastmod}
    ${changefreq}
    ${priority}
  </url>`;
  }).join('\n');
  
  return `${xmlHeader}
${urlsetOpen}
${urlEntries}
${urlsetClose}`;
}

/**
 * Fetch all published blogs and generate blog URLs
 * @returns {Promise<Array>} - Array of blog URL objects
 */
async function generateBlogUrls() {
  try {
    const blogs = await getPublishedBlogs({ limit: 1000 });
    if (!blogs.success || !blogs.data || !blogs.data.blogs) {
      console.warn('Failed to fetch blogs for sitemap');
      return [];
    }
    
    return blogs.data.blogs.map(blog => ({
      path: `/blog/${blog.slug || blog._id}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
    return [];
  }
}

/**
 * Generate doctor profile URLs for major locations
 * @returns {Promise<Array>} - Array of doctor profile URL objects
 */
async function generateDoctorProfileUrls() {
  const doctorUrls = [];
  
  try {
    // Add location-based doctor profile routes
    for (const location of MAJOR_LOCATIONS) {
      doctorUrls.push({
        path: `/${location}/doctors`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: new Date().toISOString()
      });
      
      // Add specialization-based routes for each location
      for (const specialization of DOCTOR_SPECIALIZATIONS) {
        doctorUrls.push({
          path: `/${location}/${specialization}`,
          priority: '0.7',
          changefreq: 'weekly',
          lastmod: new Date().toISOString()
        });
      }
    }
    
    // Try to fetch actual doctors and create individual profile URLs
    try {
      const doctors = await fetchDoctorsByLocation('mumbai'); // Sample location
      if (Array.isArray(doctors) && doctors.length > 0) {
        // Add sample doctor profile URLs (limit to avoid overwhelming sitemap)
        const sampleDoctors = doctors.slice(0, 50);
        sampleDoctors.forEach(doctor => {
          if (doctor.slug || doctor._id) {
            doctorUrls.push({
              path: `/mumbai/doctor/${doctor.slug || doctor._id}`,
              priority: '0.6',
              changefreq: 'monthly',
              lastmod: doctor.updatedAt ? new Date(doctor.updatedAt).toISOString() : new Date().toISOString()
            });
          }
        });
      }
    } catch (error) {
      console.warn('Could not fetch actual doctors for sitemap:', error);
    }
    
  } catch (error) {
    console.error('Error generating doctor profile URLs:', error);
  }
  
  return doctorUrls;
}

/**
 * Generate search result URLs for common queries
 * @returns {Array} - Array of search URL objects
 */
function generateSearchUrls() {
  const searchUrls = [];
  
  // Common search queries
  const commonQueries = [
    'cardiology', 'dermatology', 'orthopedics', 'neurology',
    'pediatrics', 'gynecology', 'dental', 'eye-care',
    'emergency', '24x7', 'home-visit', 'online-consultation'
  ];
  
  commonQueries.forEach(query => {
    searchUrls.push({
      path: `/search?q=${encodeURIComponent(query)}`,
      priority: '0.5',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });
  });
  
  return searchUrls;
}

/**
 * Generate category-based URLs
 * @returns {Array} - Array of category URL objects
 */
function generateCategoryUrls() {
  const categoryUrls = [];
  
  // Blog categories
  const blogCategories = ['health', 'wellness', 'medical-advice', 'disease-prevention', 'treatment'];
  blogCategories.forEach(category => {
    categoryUrls.push({
      path: `/blog/category/${category}`,
      priority: '0.6',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });
  });
  
  // Doctor categories
  DOCTOR_SPECIALIZATIONS.forEach(specialization => {
    categoryUrls.push({
      path: `/doctors/${specialization}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });
  });
  
  return categoryUrls;
}

/**
 * Main function to generate complete sitemap
 * @returns {Promise<string>} - Complete XML sitemap
 */
export async function generateCompleteSitemap() {
  try {
    console.log('🚀 Starting sitemap generation...');
    
    // Generate static routes
    const staticUrls = STATIC_ROUTES.map(route => ({
      ...route,
      lastmod: new Date().toISOString()
    }));
    
    // Generate dynamic routes
    const [blogUrls, doctorUrls, searchUrls, categoryUrls] = await Promise.all([
      generateBlogUrls(),
      generateDoctorProfileUrls(),
      generateSearchUrls(),
      generateCategoryUrls()
    ]);
    
    // Combine all URLs
    const allUrls = [
      ...staticUrls,
      ...blogUrls,
      ...doctorUrls,
      ...searchUrls,
      ...categoryUrls
    ];
    
    console.log(`✅ Generated sitemap with ${allUrls.length} URLs`);
    console.log(`   - Static routes: ${staticUrls.length}`);
    console.log(`   - Blog posts: ${blogUrls.length}`);
    console.log(`   - Doctor profiles: ${doctorUrls.length}`);
    console.log(`   - Search results: ${searchUrls.length}`);
    console.log(`   - Categories: ${categoryUrls.length}`);
    
    // Generate XML
    const sitemapXML = generateSitemapXML(allUrls);
    
    return sitemapXML;
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    throw error;
  }
}

/**
 * Generate and save sitemap to public directory
 * @returns {Promise<void>}
 */
export async function generateAndSaveSitemap() {
  try {
    const sitemapXML = await generateCompleteSitemap();
    
    // Create a blob and download it
    const blob = new Blob([sitemapXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Cleanup
    URL.revokeObjectURL(url);
    
    console.log('✅ Sitemap downloaded successfully!');
    
  } catch (error) {
    console.error('❌ Error saving sitemap:', error);
    throw error;
  }
}

/**
 * Generate sitemap for specific content type
 * @param {string} type - 'blogs', 'doctors', 'categories', 'all'
 * @returns {Promise<string>} - XML sitemap for specified type
 */
export async function generateSitemapByType(type = 'all') {
  try {
    let urls = [];
    
    switch (type) {
      case 'blogs':
        urls = await generateBlogUrls();
        break;
      case 'doctors':
        urls = await generateDoctorProfileUrls();
        break;
      case 'categories':
        urls = generateCategoryUrls();
        break;
      case 'static':
        urls = STATIC_ROUTES.map(route => ({
          ...route,
          lastmod: new Date().toISOString()
        }));
        break;
      case 'all':
      default:
        return await generateCompleteSitemap();
    }
    
    return generateSitemapXML(urls);
    
  } catch (error) {
    console.error(`Error generating ${type} sitemap:`, error);
    throw error;
  }
}
