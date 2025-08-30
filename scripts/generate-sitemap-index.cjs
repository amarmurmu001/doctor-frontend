#!/usr/bin/env node

/**
 * Sitemap Index Generator for Doctor Website
 * Creates a main sitemap index that points to multiple specialized sitemaps
 * Similar to Practo's structure: https://www.practo.com/sitemap.xml
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.FRONTEND_URL || 'https://doctar.in';
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

// Sitemap categories with their specific sitemaps
const SITEMAP_CATEGORIES = [
  {
    name: 'website',
    description: 'Main website pages',
    filename: 'sitemap-website.xml',
    priority: '1.0'
  },
  {
    name: 'doctors',
    description: 'Doctor listings and profiles',
    filename: 'sitemap-doctors.xml',
    priority: '0.9'
  },
  {
    name: 'locations',
    description: 'Location-based doctor listings',
    filename: 'sitemap-locations.xml',
    priority: '0.8'
  },
  {
    name: 'specializations',
    description: 'Specialization-based doctor listings',
    filename: 'sitemap-specializations.xml',
    priority: '0.8'
  },
  {
    name: 'blogs',
    description: 'Blog posts and articles',
    filename: 'sitemap-blogs.xml',
    priority: '0.7'
  },
  {
    name: 'categories',
    description: 'Medical categories and specialties',
    filename: 'sitemap-categories.xml',
    priority: '0.7'
  },
  {
    name: 'search',
    description: 'Search result pages',
    filename: 'sitemap-search.xml',
    priority: '0.6'
  },
  {
    name: 'hospitals',
    description: 'Hospital and clinic listings',
    filename: 'sitemap-hospitals.xml',
    priority: '0.8'
  }
];

/**
 * Generate sitemap index XML
 * @returns {string} - XML sitemap index content
 */
function generateSitemapIndexXML() {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const sitemapIndexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const sitemapIndexClose = '</sitemapindex>';
  
  const sitemapEntries = SITEMAP_CATEGORIES.map(category => {
    const lastmod = new Date().toISOString();
    
    return `  <sitemap>
    <loc>${BASE_URL}/${category.filename}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
  }).join('\n');
  
  return `${xmlHeader}
${sitemapIndexOpen}
${sitemapEntries}
${sitemapIndexClose}`;
}

/**
 * Generate main website sitemap (static pages)
 * @returns {string} - XML sitemap content
 */
function generateWebsiteSitemap() {
  const staticRoutes = [
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
    { path: '/directory', priority: '0.8', changefreq: 'weekly' }
  ];
  
  return generateSitemapXML(staticRoutes, 'Main Website Pages');
}

/**
 * Generate doctors sitemap
 * @returns {string} - XML sitemap content
 */
function generateDoctorsSitemap() {
  const doctorRoutes = [
    { path: '/search-doctors', priority: '0.9', changefreq: 'daily' },
    { path: '/search-hospitals', priority: '0.8', changefreq: 'weekly' },
    { path: '/search-clinics', priority: '0.8', changefreq: 'weekly' },
    { path: '/doctor-mapped', priority: '0.7', changefreq: 'weekly' },
    { path: '/x', priority: '0.7', changefreq: 'weekly' },
    { path: '/categories', priority: '0.7', changefreq: 'weekly' }
  ];
  
  return generateSitemapXML(doctorRoutes, 'Doctor Listings and Search');
}

/**
 * Generate locations sitemap
 * @returns {string} - XML sitemap content
 */
function generateLocationsSitemap() {
  const majorLocations = [
    'mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'kolkata',
    'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
    'indore', 'thane', 'bhopal', 'visakhapatnam', 'patna', 'vadodara',
    'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut',
    'rajkot', 'kalyan', 'vasai', 'vashi', 'aurangabad', 'noida'
  ];
  
  const locationRoutes = majorLocations.map(location => ({
    path: `/${location}/doctors`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: new Date().toISOString()
  }));
  
  return generateSitemapXML(locationRoutes, 'Location-based Doctor Listings');
}

/**
 * Generate specializations sitemap
 * @returns {string} - XML sitemap content
 */
function generateSpecializationsSitemap() {
  const specializations = [
    'cardiologist', 'dermatologist', 'orthopedist', 'neurologist',
    'psychiatrist', 'pediatrician', 'gynecologist', 'ophthalmologist',
    'dentist', 'ent-specialist', 'urologist', 'nephrologist',
    'endocrinologist', 'gastroenterologist', 'pulmonologist', 'oncologist',
    'rheumatologist', 'allergist', 'surgeon', 'general-physician'
  ];
  
  const specializationRoutes = specializations.map(spec => ({
    path: `/doctors/${spec}`,
    priority: '0.7',
    changefreq: 'weekly',
    lastmod: new Date().toISOString()
  }));
  
  return generateSitemapXML(specializationRoutes, 'Medical Specializations');
}

/**
 * Generate blogs sitemap
 * @returns {string} - XML sitemap content
 */
function generateBlogsSitemap() {
  const blogRoutes = [
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/blog/category/health', priority: '0.6', changefreq: 'weekly' },
    { path: '/blog/category/wellness', priority: '0.6', changefreq: 'weekly' },
    { path: '/blog/category/medical-advice', priority: '0.6', changefreq: 'weekly' },
    { path: '/blog/category/disease-prevention', priority: '0.6', changefreq: 'weekly' },
    { path: '/blog/category/treatment', priority: '0.6', changefreq: 'weekly' }
  ];
  
  return generateSitemapXML(blogRoutes, 'Blog Content and Categories');
}

/**
 * Generate categories sitemap
 * @returns {string} - XML sitemap content
 */
function generateCategoriesSitemap() {
  const categoryRoutes = [
    { path: '/categories', priority: '0.7', changefreq: 'weekly' },
    { path: '/x', priority: '0.7', changefreq: 'weekly' },
    { path: '/doctor-mapped', priority: '0.7', changefreq: 'weekly' }
  ];
  
  return generateSitemapXML(categoryRoutes, 'Medical Categories and Specialties');
}

/**
 * Generate search sitemap
 * @returns {string} - XML sitemap content
 */
function generateSearchSitemap() {
  const commonQueries = [
    'cardiology', 'dermatology', 'orthopedics', 'neurology',
    'pediatrics', 'gynecology', 'dental', 'eye-care',
    'emergency', '24x7', 'home-visit', 'online-consultation'
  ];
  
  const searchRoutes = commonQueries.map(query => ({
    path: `/search?q=${encodeURIComponent(query)}`,
    priority: '0.5',
    changefreq: 'weekly',
    lastmod: new Date().toISOString()
  }));
  
  return generateSitemapXML(searchRoutes, 'Search Result Pages');
}

/**
 * Generate hospitals sitemap
 * @returns {string} - XML sitemap content
 */
function generateHospitalsSitemap() {
  const hospitalRoutes = [
    { path: '/search-hospitals', priority: '0.8', changefreq: 'weekly' },
    { path: '/search-clinics', priority: '0.8', changefreq: 'weekly' },
    { path: '/directory', priority: '0.8', changefreq: 'weekly' }
  ];
  
  return generateSitemapXML(hospitalRoutes, 'Hospital and Clinic Listings');
}

/**
 * Generate XML sitemap content
 * @param {Array} urls - Array of URL objects
 * @param {string} description - Description for the sitemap
 * @returns {string} - XML sitemap content
 */
function generateSitemapXML(urls, description = '') {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';
  
  // Add comment if description provided
  const comment = description ? `<!-- ${description} -->\n` : '';
  
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
${comment}${urlsetOpen}
${urlEntries}
${urlsetClose}`;
}

/**
 * Save sitemap to file
 * @param {string} sitemapContent - XML content
 * @param {string} filename - Filename to save
 * @returns {string} - File path
 */
function saveSitemap(sitemapContent, filename) {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, sitemapContent, 'utf8');
  
  console.log(`💾 ${filename} saved to: ${filepath}`);
  return filepath;
}

/**
 * Generate all sitemaps
 */
function generateAllSitemaps() {
  console.log('🚀 Starting hierarchical sitemap generation...\n');
  
  try {
    // Generate main sitemap index
    const indexXML = generateSitemapIndexXML();
    saveSitemap(indexXML, 'sitemap.xml');
    
    // Generate individual sitemaps
    const websiteXML = generateWebsiteSitemap();
    saveSitemap(websiteXML, 'sitemap-website.xml');
    
    const doctorsXML = generateDoctorsSitemap();
    saveSitemap(doctorsXML, 'sitemap-doctors.xml');
    
    const locationsXML = generateLocationsSitemap();
    saveSitemap(locationsXML, 'sitemap-locations.xml');
    
    const specializationsXML = generateSpecializationsSitemap();
    saveSitemap(specializationsXML, 'sitemap-specializations.xml');
    
    const blogsXML = generateBlogsSitemap();
    saveSitemap(blogsXML, 'sitemap-blogs.xml');
    
    const categoriesXML = generateCategoriesSitemap();
    saveSitemap(categoriesXML, 'sitemap-categories.xml');
    
    const searchXML = generateSearchSitemap();
    saveSitemap(searchXML, 'sitemap-search.xml');
    
    const hospitalsXML = generateHospitalsSitemap();
    saveSitemap(hospitalsXML, 'sitemap-hospitals.xml');
    
    console.log('\n✅ All sitemaps generated successfully!');
    console.log('\n📊 Sitemap Structure:');
    console.log('   📁 sitemap.xml (Main Index)');
    console.log('   ├── sitemap-website.xml (Static Pages)');
    console.log('   ├── sitemap-doctors.xml (Doctor Listings)');
    console.log('   ├── sitemap-locations.xml (Location-based)');
    console.log('   ├── sitemap-specializations.xml (Medical Specialties)');
    console.log('   ├── sitemap-blogs.xml (Blog Content)');
    console.log('   ├── sitemap-categories.xml (Categories)');
    console.log('   ├── sitemap-search.xml (Search Results)');
    console.log('   └── sitemap-hospitals.xml (Hospitals & Clinics)');
    
    console.log(`\n🌐 Main sitemap index: ${BASE_URL}/sitemap.xml`);
    console.log(`📁 Files saved to: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error.message);
    process.exit(1);
  }
}

/**
 * Main function
 */
function main() {
  try {
    const args = process.argv.slice(2);
    const command = args[0] || 'generate';
    
    switch (command) {
      case 'generate':
      case '--generate':
      case '-g':
        generateAllSitemaps();
        break;
        
      case 'help':
      case '--help':
      case '-h':
        console.log(`
Sitemap Index Generator - Command Line Tool

Usage:
  node scripts/generate-sitemap-index.cjs [command]

Commands:
  generate, -g, --generate    Generate all sitemaps (default)
  help, -h, --help           Show this help message

Examples:
  node scripts/generate-sitemap-index.cjs
  node scripts/generate-sitemap-index.cjs --help

Environment Variables:
  FRONTEND_URL               Base URL for your website (default: https://doctar.in)

Output:
  Creates a main sitemap index and multiple specialized sitemaps
  Main file: sitemap.xml (index)
  Specialized files: sitemap-website.xml, sitemap-doctors.xml, etc.
        `);
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('Run "node scripts/generate-sitemap-index.cjs help" for usage information');
        process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateAllSitemaps,
  generateSitemapIndexXML
};
