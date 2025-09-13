import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { CITIES } from '../src/data/cities.js';

// Load environment variables from .env file
function loadEnvFile() {
  try {
    // Use a more reliable way to get the script directory
    const currentFileUrl = new URL(import.meta.url);
    const currentDir = path.dirname(currentFileUrl.pathname);

    // Handle Windows path format (remove leading slash from drive letter)
    const normalizedDir = process.platform === 'win32' && currentDir.startsWith('/')
      ? currentDir.slice(1)
      : currentDir;

    const envPath = path.resolve(normalizedDir, '../.env');
    console.log('🔍 Looking for .env file at:', envPath);
    
    if (fs.existsSync(envPath)) {
      console.log('✅ Found .env file');
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars = {};

      envContent.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const equalIndex = trimmedLine.indexOf('=');
          if (equalIndex > 0) {
            const key = trimmedLine.substring(0, equalIndex).trim();
            const value = trimmedLine.substring(equalIndex + 1).trim();
            envVars[key] = value;
          }
        }
      });

      console.log('📋 Loaded environment variables:', Object.keys(envVars));
      return envVars;
    } else {
      console.log('⚠️ .env file not found at:', envPath);
    }
    return {};
  } catch (error) {
    console.warn('⚠️ Could not load .env file:', error.message);
    return {};
  }
}

// Load environment variables
const envVars = loadEnvFile();

// Configuration
const API_BASE_URL = envVars.VITE_BACKEND_URL || process.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const FRONTEND_URL = envVars.VITE_FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'http://localhost:3000';

console.log('🔧 Sitemap Configuration:');
console.log(`📡 API Base URL: ${API_BASE_URL}`);
console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);

// Run the main function if this script is executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.endsWith(process.argv[1]) ||
                     process.argv[1].endsWith('generate-sitemaps.js');

if (isMainModule) {
  main().catch(console.error);
}

// Get the correct script directory path
function getScriptDir() {
  const currentFileUrl = new URL(import.meta.url);
  const currentDir = path.dirname(currentFileUrl.pathname);
  return process.platform === 'win32' && currentDir.startsWith('/')
    ? currentDir.slice(1)
    : currentDir;
}

// Fetch approved doctors from backend
async function fetchApprovedDoctors() {
  try {
    console.log('📡 Fetching doctors from backend...');
    const response = await axios.get(`${API_BASE_URL}/api/doctors`, {
      params: {
        status: 'approved',
        limit: 5000
      },
      timeout: 30000
    });

    if (response.data && response.data.doctors) {
      console.log(`✅ Fetched ${response.data.doctors.length} doctors`);
      return response.data.doctors;
    } else if (Array.isArray(response.data)) {
      console.log(`✅ Fetched ${response.data.length} doctors`);
      return response.data;
    } else {
      console.warn('⚠️ Unexpected response format, using empty array');
      console.log('Response data:', response.data);
      return [];
    }
  } catch (error) {
    console.error('❌ Failed to fetch doctors:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return [];
  }
}

// Extract unique cities from doctors data
function extractCitiesFromDoctors(doctors) {
  const cities = new Set();
    doctors.forEach(doctor => {
    if (doctor.city) {
      cities.add(doctor.city);
    }
  });
  return Array.from(cities);
}

// Extract unique specialties from doctors data
function extractSpecialtiesFromDoctors(doctors) {
  const specialties = new Set();
  doctors.forEach(doctor => {
    if (doctor.specialty) {
      specialties.add(doctor.specialty);
    }
    if (doctor.keySpecialization && Array.isArray(doctor.keySpecialization)) {
      doctor.keySpecialization.forEach(spec => specialties.add(spec));
    }
  });
  return Array.from(specialties);
}

// Generate static pages sitemap
function generateStaticPagesSitemap() {
  try {
    console.log('🏠 Generating static pages sitemap...');
    
    const scriptDir = getScriptDir();
    const frontendPublicPath = path.join(scriptDir, '../public');

    // Static pages and their metadata
    const STATIC_PAGES = [
      // Main pages
      { path: '/', priority: '1.0', changefreq: 'daily', title: 'Home' },
      { path: '/about', priority: '0.8', changefreq: 'monthly', title: 'About Us' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly', title: 'Contact Us' },
      { path: '/help', priority: '0.6', changefreq: 'monthly', title: 'Help Center' },
      { path: '/privacy', priority: '0.5', changefreq: 'yearly', title: 'Privacy Policy' },
      { path: '/terms', priority: '0.5', changefreq: 'yearly', title: 'Terms of Service' },
      
      // Doctor listing pages
      { path: '/doctors', priority: '0.9', changefreq: 'daily', title: 'Find Doctors' },
      { path: '/specialists', priority: '0.9', changefreq: 'daily', title: 'Medical Specialists' },
      
      // Auth pages
      { path: '/login', priority: '0.6', changefreq: 'monthly', title: 'Login' },
      { path: '/register', priority: '0.6', changefreq: 'monthly', title: 'Register' },
      
      // Search pages
      { path: '/search', priority: '0.8', changefreq: 'daily', title: 'Search Doctors' },
      { path: '/search/specialty', priority: '0.8', changefreq: 'daily', title: 'Search by Specialty' },
      { path: '/search/location', priority: '0.8', changefreq: 'daily', title: 'Search by Location' }
    ];

    const urls = STATIC_PAGES.map(page => `  <url>
    <loc>${FRONTEND_URL}${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    fs.writeFileSync(path.join(frontendPublicPath, 'sitemap-static.xml'), xmlContent, 'utf8');
    console.log(`✅ Static pages sitemap generated: sitemap-static.xml (${STATIC_PAGES.length} URLs)`);

  } catch (error) {
    console.error('❌ Error generating static pages sitemap:', error);
    throw error;
  }
}

// Generate doctors sitemap
async function generateDoctorsSitemap(doctors) {
  try {
    console.log('👨‍⚕️ Generating doctors sitemap...');
    
    const scriptDir = getScriptDir();
    const frontendPublicPath = path.join(scriptDir, '../public');

    const doctorUrls = doctors.map(doctor => {
      const doctorLocation = doctor.city || "india";
      const specialty = doctor.specialty || doctor.keySpecialization?.[0] || 'general-physician';
      const slug = `${doctor.user?.name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}-${specialty
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}`;

      return `  <url>
    <loc>${FRONTEND_URL}/doctors/${doctorLocation
      .toLowerCase()
      .replace(/\s+/g, "-")}/${specialty
      .toLowerCase()
      .replace(/\s+/g, "-")}/${slug}</loc>
    <lastmod>${new Date(doctor.updatedAt || doctor.createdAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('\n');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${doctorUrls}
</urlset>`;

    fs.writeFileSync(path.join(frontendPublicPath, 'sitemap-doctors.xml'), xmlContent, 'utf8');
    console.log(`✅ Doctors sitemap generated: sitemap-doctors.xml (${doctors.length} URLs)`);

  } catch (error) {
    console.error('❌ Error generating doctors sitemap:', error);
    throw error;
  }
}

// Generate city-based sitemaps
async function generateCitySitemaps(doctors, allCities) {
  try {
    console.log('🏙️ Generating city-based sitemaps...');
    
    const scriptDir = getScriptDir();
    const frontendPublicPath = path.join(scriptDir, '../public');

    // Group doctors by city
    const doctorsByCity = {};
    doctors.forEach(doctor => {
      const city = doctor.city || 'india';
      if (!doctorsByCity[city]) {
        doctorsByCity[city] = [];
      }
      doctorsByCity[city].push(doctor);
    });

    // Generate sitemap for each city
    const cityUrls = [];
    Object.keys(doctorsByCity).forEach(city => {
      const citySlug = city.toLowerCase().replace(/\s+/g, '-');
      const cityDoctors = doctorsByCity[city];
      
      // City main page
      cityUrls.push(`  <url>
    <loc>${FRONTEND_URL}/doctors/${citySlug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

      // Individual doctor pages for this city
      cityDoctors.forEach(doctor => {
        const specialty = doctor.specialty || doctor.keySpecialization?.[0] || 'general-physician';
        const slug = `${doctor.user?.name
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}-${specialty
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}`;

        cityUrls.push(`  <url>
    <loc>${FRONTEND_URL}/doctors/${citySlug}/${specialty
      .toLowerCase()
      .replace(/\s+/g, "-")}/${slug}</loc>
    <lastmod>${new Date(doctor.updatedAt || doctor.createdAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
        });
      });

    // Add cities without doctors (from static data)
    allCities.forEach(city => {
      const citySlug = city.toLowerCase().replace(/\s+/g, '-');
      if (!doctorsByCity[city]) {
        cityUrls.push(`  <url>
    <loc>${FRONTEND_URL}/doctors/${citySlug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
      }
    });

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cityUrls.join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(frontendPublicPath, 'sitemap-cities.xml'), xmlContent, 'utf8');
    console.log(`✅ City sitemap generated: sitemap-cities.xml (${cityUrls.length} URLs)`);

  } catch (error) {
    console.error('❌ Error generating city sitemaps:', error);
    throw error;
  }
}

// Generate specialty-based sitemaps
async function generateSpecialtySitemaps(doctors, specialties) {
  try {
    console.log('🏥 Generating specialty-based sitemaps...');
    
    const scriptDir = getScriptDir();
    const frontendPublicPath = path.join(scriptDir, '../public');

    // Group doctors by specialty
    const doctorsBySpecialty = {};
    doctors.forEach(doctor => {
      const specialty = doctor.specialty || doctor.keySpecialization?.[0] || 'general-physician';
      if (!doctorsBySpecialty[specialty]) {
        doctorsBySpecialty[specialty] = [];
      }
      doctorsBySpecialty[specialty].push(doctor);
    });

    // Generate sitemap for each specialty
    const specialtyUrls = [];
    Object.keys(doctorsBySpecialty).forEach(specialty => {
      const specialtySlug = specialty.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Specialty main page
      specialtyUrls.push(`  <url>
    <loc>${FRONTEND_URL}/specialists/${specialtySlug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

      // Individual doctor pages for this specialty
      doctorsBySpecialty[specialty].forEach(doctor => {
        const doctorLocation = doctor.city || "india";
        const slug = `${doctor.user?.name
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}-${specialty
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}`;

        specialtyUrls.push(`  <url>
    <loc>${FRONTEND_URL}/specialists/${specialtySlug}/${doctorLocation
      .toLowerCase()
      .replace(/\s+/g, "-")}/${slug}</loc>
    <lastmod>${new Date(doctor.updatedAt || doctor.createdAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      });
    });

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${specialtyUrls.join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(frontendPublicPath, 'sitemap-specialties.xml'), xmlContent, 'utf8');
    console.log(`✅ Specialty sitemap generated: sitemap-specialties.xml (${specialtyUrls.length} URLs)`);

  } catch (error) {
    console.error('❌ Error generating specialty sitemaps:', error);
    throw error;
  }
}

// Generate main sitemap index
function generateSitemapIndex() {
  try {
    console.log('📋 Generating main sitemap index...');
    
    const scriptDir = getScriptDir();
    const frontendPublicPath = path.join(scriptDir, '../public');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${FRONTEND_URL}/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${FRONTEND_URL}/sitemap-doctors.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${FRONTEND_URL}/sitemap-cities.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${FRONTEND_URL}/sitemap-specialties.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

    fs.writeFileSync(path.join(frontendPublicPath, 'sitemap.xml'), xmlContent, 'utf8');
    console.log(`✅ Main sitemap index generated: sitemap.xml`);

  } catch (error) {
    console.error('❌ Error generating sitemap index:', error);
    throw error;
  }
}

// Main execution function
async function main() {
  try {
    console.log('🚀 Starting comprehensive sitemap generation...');

    // Get the correct script directory path for debugging
    const scriptDir = getScriptDir();
    const publicPath = path.join(scriptDir, '../public');

    console.log('📁 Script location:', scriptDir);
    console.log('📂 Public directory:', publicPath);
    console.log('📂 Public directory exists:', fs.existsSync(publicPath));

    // Ensure public directory exists
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
      console.log('📂 Created public directory');
    }

    // Generate static pages sitemap
    console.log('🏠 Generating static pages sitemap...');
    generateStaticPagesSitemap();
    console.log('✅ Static pages sitemap completed');

    // Fetch doctors data
    console.log('📡 Fetching doctors data...');
    const doctors = await fetchApprovedDoctors();
    console.log(`✅ Fetched ${doctors.length} doctors`);

    // Extract cities and specialties
    const doctorCities = extractCitiesFromDoctors(doctors);
    const specialties = extractSpecialtiesFromDoctors(doctors);
    
    // Combine with static cities data
    const allCities = [...new Set([...CITIES, ...doctorCities])];
    
    console.log(`🏙️ Total cities: ${allCities.length} (${CITIES.length} static + ${doctorCities.length} from doctors)`);
    console.log(`🏥 Total specialties: ${specialties.length}`);

    // Generate doctors sitemap
    console.log('👨‍⚕️ Generating doctors sitemap...');
    await generateDoctorsSitemap(doctors);
    console.log('✅ Doctors sitemap completed');

    // Generate city-based sitemaps
    console.log('🏙️ Generating city-based sitemaps...');
    await generateCitySitemaps(doctors, allCities);
    console.log('✅ City sitemaps completed');

    // Generate specialty-based sitemaps
    console.log('🏥 Generating specialty-based sitemaps...');
    await generateSpecialtySitemaps(doctors, specialties);
    console.log('✅ Specialty sitemaps completed');

    // Generate main sitemap index
    console.log('📋 Generating sitemap index...');
    generateSitemapIndex();
    console.log('✅ Sitemap index completed');

    console.log('🎉 All sitemaps generated successfully!');
    console.log('\n📊 Summary:');
    console.log(`🏠 Static pages: sitemap-static.xml`);
    console.log(`👨‍⚕️ Doctors: sitemap-doctors.xml (${doctors.length} URLs)`);
    console.log(`🏙️ Cities: sitemap-cities.xml (${allCities.length} cities)`);
    console.log(`🏥 Specialties: sitemap-specialties.xml (${specialties.length} specialties)`);
    console.log(`📋 Main index: sitemap.xml`);

  } catch (error) {
    console.error('❌ Sitemap generation failed:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the main function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  generateStaticPagesSitemap,
  generateDoctorsSitemap,
  generateCitySitemaps,
  generateSpecialtySitemaps,
  generateSitemapIndex,
  main
};
