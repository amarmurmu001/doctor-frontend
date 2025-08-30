#!/usr/bin/env node

/**
 * Command-line sitemap generator for the doctor website
 * Run with: node scripts/generate-sitemap.cjs [options]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.FRONTEND_URL || 'https://doctar.in';
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

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
 * Generate doctor profile URLs for major locations
 */
function generateDoctorProfileUrls() {
  const doctorUrls = [];
  
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
  
  return doctorUrls;
}

/**
 * Generate search result URLs for common queries
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
 * Generate complete sitemap
 */
function generateCompleteSitemap() {
  console.log('🚀 Starting sitemap generation...');
  
  // Generate static routes
  const staticUrls = STATIC_ROUTES.map(route => ({
    ...route,
    lastmod: new Date().toISOString()
  }));
  
  // Generate dynamic routes
  const doctorUrls = generateDoctorProfileUrls();
  const searchUrls = generateSearchUrls();
  const categoryUrls = generateCategoryUrls();
  
  // Combine all URLs
  const allUrls = [
    ...staticUrls,
    ...doctorUrls,
    ...searchUrls,
    ...categoryUrls
  ];
  
  console.log(`✅ Generated sitemap with ${allUrls.length} URLs`);
  console.log(`   - Static routes: ${staticUrls.length}`);
  console.log(`   - Doctor profiles: ${doctorUrls.length}`);
  console.log(`   - Search results: ${searchUrls.length}`);
  console.log(`   - Categories: ${categoryUrls.length}`);
  
  return allUrls;
}

/**
 * Save sitemap to file
 */
function saveSitemap(sitemapContent, filename = 'sitemap.xml') {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, sitemapContent, 'utf8');
  
  console.log(`💾 Sitemap saved to: ${filepath}`);
  return filepath;
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
        const urls = generateCompleteSitemap();
        const sitemapXML = generateSitemapXML(urls);
        saveSitemap(sitemapXML);
        break;
        
      case 'static':
      case '--static':
      case '-s':
        const staticUrls = STATIC_ROUTES.map(route => ({
          ...route,
          lastmod: new Date().toISOString()
        }));
        const staticSitemap = generateSitemapXML(staticUrls);
        saveSitemap(staticSitemap, 'sitemap-static.xml');
        break;
        
      case 'help':
      case '--help':
      case '-h':
        console.log(`
Sitemap Generator - Command Line Tool

Usage:
  node scripts/generate-sitemap.cjs [command]

Commands:
  generate, -g, --generate    Generate complete sitemap (default)
  static, -s, --static        Generate static routes only
  help, -h, --help           Show this help message

Examples:
  node scripts/generate-sitemap.cjs
  node scripts/generate-sitemap.cjs static
  node scripts/generate-sitemap.cjs --help

Environment Variables:
  FRONTEND_URL               Base URL for your website (default: https://doctar.in)

Output:
  Sitemap files are saved to the public/ directory
        `);
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('Run "node scripts/generate-sitemap.cjs help" for usage information');
        process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateCompleteSitemap,
  generateSitemapXML,
  saveSitemap
};
