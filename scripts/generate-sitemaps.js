#!/usr/bin/env node

/* eslint-disable no-undef */
/* eslint-env node */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { CITIES } = require('../src/data/cities.js');

// Load environment variables from .env file
function loadEnvFile() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars = {};

      envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim();
          }
        }
      });

      return envVars;
    }
  } catch (error) {
    console.warn('Could not load .env file:', error.message);
  }
  return {};
}

// Load environment variables
const envVars = loadEnvFile();

// Configuration
const API_BASE_URL = envVars.VITE_BACKEND_URL || process.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const FRONTEND_URL = envVars.VITE_FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'http://localhost:3000';

console.log('🔧 Sitemap Configuration:');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('FRONTEND_URL:', FRONTEND_URL);

// Utility functions (moved from backend)
function generateCitySlug(cityName) {
  if (!cityName) return '';

  return cityName.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

function generateSpecialtySlug(specialty) {
  if (!specialty) return '';

  return specialty.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

function generateDoctorSlug(doctorName, specialty) {
  const cleanName = doctorName.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();

  const cleanSpecialty = specialty.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  return `${cleanName}-${cleanSpecialty}`;
}

// API functions to get data from backend
async function fetchApprovedDoctors() {
  try {
    console.log('📡 Fetching approved doctors from backend...');
    console.log('🔗 API URL:', `${API_BASE_URL}/api/doctors?status=approved&limit=5000`);

    const response = await axios.get(`${API_BASE_URL}/api/doctors?status=approved&limit=5000`);

    // Handle different response structures
    let doctors = [];
    if (response.data && response.data.success && response.data.data) {
      doctors = response.data.data.doctors || response.data.data || [];
    } else if (response.data && Array.isArray(response.data)) {
      doctors = response.data;
    } else if (response.data && response.data.doctors) {
      doctors = response.data.doctors;
    }

    console.log(`✅ Fetched ${doctors.length} doctors from backend`);
    console.log('📋 Sample doctor data:', doctors.slice(0, 2).map(doc => ({
      name: doc.user?.name || doc.name,
      specialty: doc.specialty,
      city: doc.city || doc.address?.city,
      status: doc.status
    })));

    return doctors;
  } catch (error) {
    console.error('❌ Failed to fetch doctors:', error.message);
    console.error('❌ API URL used:', `${API_BASE_URL}/api/doctors?status=approved&limit=5000`);
    console.error('❌ Full error:', error.response?.data || error.message);
    return [];
  }
}

async function fetchCitiesFromDoctors(doctors) {
  try {
    console.log('🏙️ Extracting unique cities from doctors data and static cities list...');

    // Extract cities from doctors data
    const doctorCities = [...new Set(
      doctors
        .map(doctor => doctor.city || doctor.address?.city)
        .filter(city => city && typeof city === 'string' && city.trim() !== '')
    )];

    // Merge with static cities list
    const allCities = [...new Set([...doctorCities, ...CITIES])];

    console.log(`✅ Found ${doctorCities.length} cities from doctors data`);
    console.log(`✅ Found ${CITIES.length} cities from static list`);
    console.log(`✅ Total unique cities: ${allCities.length}`);
    console.log('📋 Sample cities from doctors:', doctorCities.slice(0, 3));
    console.log('📋 Sample cities from static list:', CITIES.slice(0, 3));

    return allCities;
  } catch (error) {
    console.error('❌ Failed to extract cities:', error.message);
    // Fallback to static cities if there's an error
    console.log('⚠️ Using static cities list as fallback');
    return CITIES;
  }
}

async function fetchSpecialtiesFromDoctors(doctors) {
  try {
    console.log('🔬 Extracting unique specialties from doctors data...');

    const specialties = [...new Set(
      doctors
        .map(doctor => doctor.specialty || doctor.keySpecialization?.[0])
        .filter(specialty => specialty && typeof specialty === 'string' && specialty.trim() !== '')
    )];

    console.log(`✅ Found ${specialties.length} unique specialties from doctors data`);
    console.log('📋 Sample specialties:', specialties.slice(0, 5));

    return specialties;
  } catch (error) {
    console.error('❌ Failed to extract specialties:', error.message);
    return [];
  }
}

// Generate hierarchical sitemaps
async function generateHierarchicalSitemaps() {
  try {
    console.log('🏗️  Starting hierarchical sitemap generation...');

    // Fetch doctors from backend
    const doctors = await fetchApprovedDoctors();

    if (doctors.length === 0) {
      console.error('❌ No doctors found! Cannot generate sitemaps.');
      return;
    }

    // Extract cities and specialties dynamically from doctors data
    const [cities, specialties] = await Promise.all([
      fetchCitiesFromDoctors(doctors),
      fetchSpecialtiesFromDoctors(doctors)
    ]);

    console.log(`✅ Found ${doctors.length} approved doctors`);
    console.log(`🏙️ Found ${cities.length} unique cities (from doctors + static list)`);
    console.log(`🔬 Found ${specialties.length} unique specialties`);

    const frontendPublicPath = path.join(__dirname, '../public');

    // Group doctors by city and specialty
    const citySpecialtyMap = new Map();

    doctors.forEach(doctor => {
      if (doctor.city && doctor.specialty && doctor.user?.name) {
        // Include ALL approved doctors, regardless of CSV
        const citySlug = generateCitySlug(doctor.city);
        const specialtySlug = generateSpecialtySlug(doctor.specialty);

        if (!citySpecialtyMap.has(citySlug)) {
          citySpecialtyMap.set(citySlug, {
            cityName: doctor.city,
            specialties: new Map()
          });
        }

        if (!citySpecialtyMap.get(citySlug).specialties.has(specialtySlug)) {
          citySpecialtyMap.get(citySlug).specialties.set(specialtySlug, {
            specialtyName: doctor.specialty,
            doctors: []
          });
        }

        citySpecialtyMap.get(citySlug).specialties.get(specialtySlug).doctors.push(doctor);
      }
    });

    console.log(`✅ Doctors processed: ${doctors.length} included`);
    console.log(`🏙️  Processing ${citySpecialtyMap.size} cities with doctors`);

    // Generate main doctors sitemap that points to city sitemaps
    const mainDoctorsUrls = [];

    // Base doctors page
    mainDoctorsUrls.push({
      loc: `${FRONTEND_URL}/doctors`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    });

    // Add city-level sitemaps
    Array.from(citySpecialtyMap.keys()).forEach(citySlug => {
      mainDoctorsUrls.push({
        loc: `${FRONTEND_URL}/sitemap-doctors-${citySlug}.xml`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      });
    });

    // Generate main doctors sitemap
    const mainDoctorsXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainDoctorsUrls.map(url => `  <sitemap>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    fs.writeFileSync(path.join(frontendPublicPath, 'sitemap-doctors.xml'), mainDoctorsXml);
    console.log(`✅ Main doctors sitemap generated: sitemap-doctors.xml`);

    let totalSpecialtySitemaps = 0;
    let totalDoctorUrls = 0;

    // Generate city-level sitemaps
    for (const [citySlug, cityData] of citySpecialtyMap) {
      const citySitemapUrls = [];

      // City doctors page
      citySitemapUrls.push({
        loc: `${FRONTEND_URL}/doctors/${citySlug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      });

      // Add specialty sitemaps for this city
      Array.from(cityData.specialties.keys()).forEach(specialtySlug => {
        citySitemapUrls.push({
          loc: `${FRONTEND_URL}/sitemap-${specialtySlug}.xml`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: '0.8'
        });
      });

      // Generate city sitemap
      const citySitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${citySitemapUrls.map(url => `  <sitemap>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

      fs.writeFileSync(path.join(frontendPublicPath, `sitemap-doctors-${citySlug}.xml`), citySitemapXml);
      console.log(`✅ City sitemap generated: sitemap-doctors-${citySlug}.xml (${cityData.specialties.size} specialties)`);

      // Generate specialty-level sitemaps for this city
      for (const [specialtySlug, specialtyData] of cityData.specialties) {
        const specialtyUrls = [];

        // City-specialty page
        specialtyUrls.push({
          loc: `${FRONTEND_URL}/doctors/${citySlug}/${specialtySlug}`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: '0.8'
        });

        // Individual doctor pages
        specialtyData.doctors.forEach(doctor => {
          const doctorSlug = generateDoctorSlug(doctor.user.name, doctor.specialty);
          specialtyUrls.push({
            loc: `${FRONTEND_URL}/doctors/${citySlug}/${specialtySlug}/${doctorSlug}`,
            lastmod: doctor.updatedAt ? doctor.updatedAt : new Date().toISOString(),
            changefreq: 'monthly',
            priority: '0.6'
          });
        });

        // Generate specialty sitemap
        const specialtySitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${specialtyUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        fs.writeFileSync(path.join(frontendPublicPath, `sitemap-${specialtySlug}.xml`), specialtySitemapXml);
        console.log(`✅ Specialty sitemap generated: sitemap-${specialtySlug}.xml (${specialtyData.doctors.length} doctors in ${cityData.cityName})`);

        totalSpecialtySitemaps++;
        totalDoctorUrls += specialtyUrls.length;
      }
    }

    console.log(`\n📊 Hierarchical Sitemap Generation Complete:`);
    console.log(`🏙️  Cities processed: ${citySpecialtyMap.size}`);
    console.log(`🏥 Specialties processed: ${totalSpecialtySitemaps}`);
    console.log(`👨‍⚕️ Total doctor URLs: ${totalDoctorUrls}`);

  } catch (error) {
    console.error('❌ Error generating hierarchical sitemaps:', error);
    process.exit(1);
  }
}

// Generate specialists hierarchical sitemaps
async function generateSpecialistsHierarchicalSitemaps() {
  try {
    console.log('🏥 Starting hierarchical specialists sitemap generation...');

    // Fetch doctors from backend
    const doctors = await fetchApprovedDoctors();

    if (doctors.length === 0) {
      console.error('❌ No doctors found! Cannot generate specialists sitemaps.');
      return;
    }

    // Extract cities and specialties dynamically from doctors data
    const [cities, specialties] = await Promise.all([
      fetchCitiesFromDoctors(doctors),
      fetchSpecialtiesFromDoctors(doctors)
    ]);

    console.log(`✅ Found ${doctors.length} approved doctors`);
    console.log(`🏙️ Found ${cities.length} unique cities`);
    console.log(`🔬 Found ${specialties.length} unique specialties`);

    const frontendPublicPath = path.join(__dirname, '../public');

    // Group doctors by specialty and city
    const specialtyMap = new Map();

    doctors.forEach(doctor => {
      if (doctor.specialty && doctor.city && doctor.user?.name) {
        // Include ALL approved doctors, regardless of CSV
        const specialtySlug = generateSpecialtySlug(doctor.specialty);
        const citySlug = generateCitySlug(doctor.city);

        if (!specialtyMap.has(specialtySlug)) {
          specialtyMap.set(specialtySlug, {
            specialtyName: doctor.specialty,
            cities: new Map()
          });
        }

        if (!specialtyMap.get(specialtySlug).cities.has(citySlug)) {
          specialtyMap.get(specialtySlug).cities.set(citySlug, {
            cityName: doctor.city,
            doctors: []
          });
        }

        specialtyMap.get(specialtySlug).cities.get(citySlug).doctors.push(doctor);
      }
    });

    console.log(`✅ Doctors processed: ${doctors.length} included`);
    console.log(`🏥 Processing ${specialtyMap.size} specialties with doctors`);

    // Generate main specialists sitemap that points to specialty sitemaps
    const mainSpecialistsUrls = [];

    // Base specialists page
    mainSpecialistsUrls.push({
      loc: `${FRONTEND_URL}/specialists`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    });

    // Add specialty-level sitemaps
    Array.from(specialtyMap.keys()).forEach(specialtySlug => {
      mainSpecialistsUrls.push({
        loc: `${FRONTEND_URL}/sitemap-specialists-${specialtySlug}.xml`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      });
    });

    // Generate main specialists sitemap
    const mainSpecialistsXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainSpecialistsUrls.map(url => `  <sitemap>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    fs.writeFileSync(path.join(frontendPublicPath, 'sitemap-specialists.xml'), mainSpecialistsXml);
    console.log(`✅ Main specialists sitemap generated: sitemap-specialists.xml`);

    let totalCitySitemaps = 0;
    let totalSpecialistUrls = 0;

    // Generate specialty-level sitemaps
    for (const [specialtySlug, specialtyData] of specialtyMap) {
      const specialtySitemapUrls = [];

      // Specialty page
      specialtySitemapUrls.push({
        loc: `${FRONTEND_URL}/specialists/${specialtySlug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      });

      // Add city sitemaps for this specialty
      Array.from(specialtyData.cities.keys()).forEach(citySlug => {
        specialtySitemapUrls.push({
          loc: `${FRONTEND_URL}/sitemap-specialists-${specialtySlug}-${citySlug}.xml`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: '0.8'
        });
      });

      // Generate specialty sitemap
      const specialtySitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${specialtySitemapUrls.map(url => `  <sitemap>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

      fs.writeFileSync(path.join(frontendPublicPath, `sitemap-specialists-${specialtySlug}.xml`), specialtySitemapXml);
      console.log(`✅ Specialty sitemap generated: sitemap-specialists-${specialtySlug}.xml (${specialtyData.cities.size} cities)`);

      // Generate city-specialty sitemaps for this specialty
      for (const [citySlug, cityData] of specialtyData.cities) {
        const citySpecialtyUrls = [];

        // Specialty-city page
        citySpecialtyUrls.push({
          loc: `${FRONTEND_URL}/specialists/${specialtySlug}/${citySlug}`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: '0.8'
        });

        // Individual doctor pages
        cityData.doctors.forEach(doctor => {
          const doctorSlug = generateDoctorSlug(doctor.user.name, doctor.specialty);
          citySpecialtyUrls.push({
            loc: `${FRONTEND_URL}/specialists/${specialtySlug}/${citySlug}/${doctorSlug}`,
            lastmod: doctor.updatedAt ? doctor.updatedAt : new Date().toISOString(),
            changefreq: 'monthly',
            priority: '0.6'
          });
        });

        // Generate city-specialty sitemap
        const citySpecialtySitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${citySpecialtyUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        fs.writeFileSync(path.join(frontendPublicPath, `sitemap-specialists-${specialtySlug}-${citySlug}.xml`), citySpecialtySitemapXml);
        console.log(`✅ City-specialty sitemap generated: sitemap-specialists-${specialtySlug}-${citySlug}.xml (${cityData.doctors.length} doctors)`);

        totalCitySitemaps++;
        totalSpecialistUrls += citySpecialtyUrls.length;
      }
    }

    console.log(`\n🏥 Hierarchical Specialists Sitemap Generation Complete:`);
    console.log(`🏥 Specialties processed: ${specialtyMap.size}`);
    console.log(`🏙️  City-specialty combinations: ${totalCitySitemaps}`);
    console.log(`👨‍⚕️ Total specialist URLs: ${totalSpecialistUrls}`);

  } catch (error) {
    console.error('❌ Error generating hierarchical specialists sitemaps:', error);
    process.exit(1);
  }
}

// Generate location hierarchical sitemaps
async function generateLocationHierarchicalSitemaps() {
  try {
    console.log('🗺️  Starting hierarchical location sitemap generation...');

    // Fetch doctors from backend
    const doctors = await fetchApprovedDoctors();

    if (doctors.length === 0) {
      console.error('❌ No doctors found! Cannot generate location sitemaps.');
      return;
    }

    // Extract cities and specialties dynamically from doctors data
    const [cities, specialties] = await Promise.all([
      fetchCitiesFromDoctors(doctors),
      fetchSpecialtiesFromDoctors(doctors)
    ]);

    console.log(`✅ Found ${doctors.length} approved doctors`);
    console.log(`🏙️ Found ${cities.length} unique cities`);
    console.log(`🔬 Found ${specialties.length} unique specialties`);

    const frontendPublicPath = path.join(__dirname, '../public');

    // Group doctors by city (for location-based sitemaps)
    const cityMap = new Map();

    doctors.forEach(doctor => {
      if (doctor.city && doctor.specialty && doctor.user?.name) {
        // Include ALL approved doctors, regardless of CSV
        const citySlug = generateCitySlug(doctor.city);

        if (!cityMap.has(citySlug)) {
          cityMap.set(citySlug, {
            cityName: doctor.city,
            doctors: []
          });
        }

        cityMap.get(citySlug).doctors.push(doctor);
      }
    });

    // Generate main location sitemap that points to city sitemaps
    const mainLocationUrls = [];

    // Base location/doctors page
    mainLocationUrls.push({
      loc: `${FRONTEND_URL}/doctors`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    });

    // Add all cities from CSV as location pages
    cities.forEach(city => {
      const citySlug = generateCitySlug(city);
      mainLocationUrls.push({
        loc: `${FRONTEND_URL}/sitemap-location-${citySlug}.xml`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      });
    });

    // Generate main location sitemap
    const mainLocationXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainLocationUrls.map(url => `  <sitemap>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    fs.writeFileSync(path.join(frontendPublicPath, 'sitemap-location.xml'), mainLocationXml);
    console.log(`✅ Main location sitemap generated: sitemap-location.xml`);

    let totalLocationUrls = 0;

    // Generate city-specific location sitemaps
    for (const [citySlug, cityData] of cityMap) {
      const cityLocationUrls = [];

      // City doctors page
      cityLocationUrls.push({
        loc: `${FRONTEND_URL}/doctors/${citySlug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      });

      // Add all doctors in this city (both doctors and specialists URLs)
      cityData.doctors.forEach(doctor => {
        const specialtySlug = generateSpecialtySlug(doctor.specialty);
        const doctorSlug = generateDoctorSlug(doctor.user.name, doctor.specialty);

        // Doctors URL
        cityLocationUrls.push({
          loc: `${FRONTEND_URL}/doctors/${citySlug}/${specialtySlug}/${doctorSlug}`,
          lastmod: doctor.updatedAt ? doctor.updatedAt : new Date().toISOString(),
          changefreq: 'monthly',
          priority: '0.7'
        });

        // Specialists URL (same doctor, different route)
        cityLocationUrls.push({
          loc: `${FRONTEND_URL}/specialists/${specialtySlug}/${citySlug}/${doctorSlug}`,
          lastmod: doctor.updatedAt ? doctor.updatedAt : new Date().toISOString(),
          changefreq: 'monthly',
          priority: '0.7'
        });
      });

      // Generate city location sitemap
      const cityLocationSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cityLocationUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      fs.writeFileSync(path.join(frontendPublicPath, `sitemap-location-${citySlug}.xml`), cityLocationSitemapXml);
      console.log(`✅ City location sitemap generated: sitemap-location-${citySlug}.xml (${cityData.doctors.length} doctors, ${cityLocationUrls.length} URLs)`);

      totalLocationUrls += cityLocationUrls.length;
    }

    // Also generate location sitemaps for cities that have no doctors yet (but are in CSV)
    const citiesWithDoctors = new Set(Array.from(cityMap.keys()));
    const citiesWithoutDoctors = cities.filter(city => {
      const citySlug = generateCitySlug(city);
      return !citiesWithDoctors.has(citySlug);
    });

    console.log(`🏙️  Cities without doctors: ${citiesWithoutDoctors.length}`);

    citiesWithoutDoctors.forEach(city => {
      const citySlug = generateCitySlug(city);
      const cityLocationUrls = [];

      // City doctors page (even if no doctors yet)
      cityLocationUrls.push({
        loc: `${FRONTEND_URL}/doctors/${citySlug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      });

      // Generate city location sitemap for cities without doctors
      const cityLocationSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cityLocationUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      fs.writeFileSync(path.join(frontendPublicPath, `sitemap-location-${citySlug}.xml`), cityLocationSitemapXml);
      console.log(`✅ City location sitemap generated: sitemap-location-${citySlug}.xml (0 doctors, ${cityLocationUrls.length} URLs)`);

      totalLocationUrls += cityLocationUrls.length;
    });

    console.log(`\n📍 Hierarchical Location Sitemap Generation Complete:`);
    console.log(`🏙️  Cities processed: ${cityMap.size}`);
    console.log(`🗺️  Cities without doctors: ${citiesWithoutDoctors.length}`);
    console.log(`📍 Total location URLs: ${totalLocationUrls}`);

  } catch (error) {
    console.error('❌ Error generating hierarchical location sitemaps:', error);
    process.exit(1);
  }
}

// Generate static pages sitemap
function generateStaticPagesSitemap() {
  try {
    console.log('🏠 Starting static pages sitemap generation...');

    const frontendPublicPath = path.join(__dirname, '../public');

    // Static pages and their metadata for sitemap generation
    const STATIC_PAGES = [
      // Main pages
      { path: '/', priority: '1.0', changefreq: 'daily', title: 'Home' },
      { path: '/about', priority: '0.8', changefreq: 'monthly', title: 'About Us' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly', title: 'Contact Us' },
      { path: '/help', priority: '0.6', changefreq: 'monthly', title: 'Help Center' },
      { path: '/privacy', priority: '0.5', changefreq: 'yearly', title: 'Privacy Policy' },
      { path: '/terms', priority: '0.5', changefreq: 'yearly', title: 'Terms and Conditions' },
      { path: '/pci-terms', priority: '0.5', changefreq: 'yearly', title: 'PCI Terms' },

      // Content pages
      { path: '/blog', priority: '0.8', changefreq: 'daily', title: 'Blog' },
      { path: '/careers', priority: '0.6', changefreq: 'weekly', title: 'Careers' },
      { path: '/press', priority: '0.6', changefreq: 'monthly', title: 'Press' },
      { path: '/developers', priority: '0.6', changefreq: 'monthly', title: 'Developers' },

      // Department/Specialty pages
      { path: '/departments', priority: '0.9', changefreq: 'weekly', title: 'Medical Departments' },
      { path: '/specialists', priority: '0.9', changefreq: 'weekly', title: 'Medical Specialists' },

      // Search pages
      { path: '/search-doctors', priority: '0.8', changefreq: 'daily', title: 'Search Doctors' },
      { path: '/search-hospitals', priority: '0.7', changefreq: 'weekly', title: 'Search Hospitals' },
      { path: '/search-clinics', priority: '0.7', changefreq: 'weekly', title: 'Search Clinics' },
      { path: '/directory', priority: '0.7', changefreq: 'weekly', title: 'Medical Directory' },

      // Authentication related (but public)
      { path: '/login', priority: '0.8', changefreq: 'monthly', title: 'Login' },

      // Admin pages (only include login, others are protected)
      { path: '/admin/login', priority: '0.5', changefreq: 'monthly', title: 'Admin Login' }
    ];

    // Generate sitemap XML
    const urlset = STATIC_PAGES.map(page => ({
      loc: `${FRONTEND_URL}${page.path}`,
      lastmod: new Date().toISOString(),
      changefreq: page.changefreq,
      priority: page.priority
    }));

    // Generate XML
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Save to frontend public directory
    const sitemapPath = path.join(frontendPublicPath, 'sitemap-static.xml');

    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
    console.log(`✅ Static pages sitemap generated successfully: sitemap-static.xml`);
    console.log(`📄 Total static pages in sitemap: ${urlset.length}`);

  } catch (error) {
    console.error('❌ Error generating static pages sitemap:', error);
    throw error;
  }
}

// Generate main sitemap index
function generateSitemapIndex() {
  try {
    const frontendPublicPath = path.join(__dirname, '../public');

    // Generate XML sitemap index
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
    <loc>${FRONTEND_URL}/sitemap-specialists.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${FRONTEND_URL}/sitemap-location.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

    // Save to frontend public directory
    const sitemapIndexPath = path.join(frontendPublicPath, 'sitemap.xml');

    fs.writeFileSync(sitemapIndexPath, xmlContent, 'utf8');
    console.log(`✅ Main sitemap index generated successfully: sitemap.xml`);
    console.log(`🔗 Points to: sitemap-static.xml, sitemap-doctors.xml (hierarchical), sitemap-specialists.xml (hierarchical), sitemap-location.xml (hierarchical)`);

  } catch (error) {
    console.error('❌ Error generating sitemap index:', error);
    throw error;
  }
}

// Main execution function
async function main() {
  try {
    console.log('🚀 Starting complete sitemap generation...');

    // Generate all sitemaps
    generateStaticPagesSitemap();
    await generateHierarchicalSitemaps();
    await generateSpecialistsHierarchicalSitemaps();
    await generateLocationHierarchicalSitemaps();
    generateSitemapIndex();

    console.log('✅ All sitemaps generated successfully!');

  } catch (error) {
    console.error('❌ Sitemap generation failed:', error);
    process.exit(1);
  }
}

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  generateStaticPagesSitemap,
  generateHierarchicalSitemaps,
  generateSpecialistsHierarchicalSitemaps,
  generateLocationHierarchicalSitemaps,
  generateSitemapIndex,
  main
};
