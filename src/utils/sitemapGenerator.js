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

// Comprehensive list of Indian cities organized by state/region
const INDIAN_CITIES = {
  // Major Metropolitan Cities (Tier 1)
  tier1: [
  'mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'kolkata',
  'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
    'indore', 'thane', 'bhopal', 'visakhapatnam', 'patna', 'vadodara'
  ],

  // Growing Cities (Tier 2)
  tier2: [
    'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot',
    'kalyan', 'vasai', 'vashi', 'aurangabad', 'noida', 'ghaziabad',
    'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur',
    'madurai', 'raipur', 'kota', 'guwahati', 'chandigarh', 'amritsar',
    'allahabad', 'jamshedpur', 'dhanbad', 'ranchi', 'meerut', 'gorakhpur'
  ],

  // Emerging Cities (Tier 3)
  tier3: [
    'dehradun', 'shimla', 'panaji', 'chandrapur', 'nanded', 'latur',
    'parbhani', 'jalna', 'akola', 'buldhana', 'washim', 'hingoli',
    'beed', 'osmanabad', 'solapur', 'satara', 'sangli', 'kolhapur',
    'ratnagiri', 'sindhudurg', 'raigad', 'palghar', 'nandurbar',
    'dhule', 'jalgaon', 'buldana', 'yavatmal', 'wardha', 'bhandara',
    'gadchiroli', 'chandrapur', 'gondia', 'balaghat', 'mandla',
    'dindori', 'seoni', 'chhindwara', 'betul', 'harda', 'narsinghpur',
    'katni', 'umaria', 'panna', 'sagar', 'damoh', 'satna', 'rewa',
    'sidhi', 'singrauli', 'shahdol', 'anuppur', 'durg', 'rajnandgaon',
    'kanker', 'bastar', 'narayanpur', 'dakshin-bastar', 'bijapur',
    'sukma', 'korea', 'surajpur', 'balrampur', 'jashpur', 'koriya',
    'korba', 'raigarh', 'janjgir-champa', 'kabirdham', 'dhamegarh',
    'bilaspur', 'raigarh', 'janjgir', 'korba', 'raigarh', 'surguja'
  ]
};

// Medical specializations organized by category
const MEDICAL_CATEGORIES = {
  cardiology: {
    name: 'Cardiology',
    specializations: [
      'cardiologist', 'cardiac-surgeon', 'interventional-cardiologist',
      'electrophysiologist', 'pediatric-cardiologist'
    ]
  },
  dermatology: {
    name: 'Dermatology',
    specializations: [
      'dermatologist', 'cosmetic-dermatologist', 'pediatric-dermatologist',
      'hair-transplant-surgeon', 'skin-specialist'
    ]
  },
  orthopedics: {
    name: 'Orthopedics',
    specializations: [
      'orthopedic-surgeon', 'sports-medicine-specialist', 'joint-replacement-surgeon',
      'spine-surgeon', 'pediatric-orthopedist', 'hand-surgeon'
    ]
  },
  neurology: {
    name: 'Neurology',
    specializations: [
      'neurologist', 'neurosurgeon', 'pediatric-neurologist',
      'stroke-specialist', 'epilepsy-specialist'
    ]
  },
  psychiatry: {
    name: 'Psychiatry',
    specializations: [
      'psychiatrist', 'child-psychiatrist', 'geriatric-psychiatrist',
      'addiction-psychiatrist', 'forensic-psychiatrist'
    ]
  },
  pediatrics: {
    name: 'Pediatrics',
    specializations: [
      'pediatrician', 'neonatologist', 'pediatric-surgeon',
      'pediatric-cardiologist', 'pediatric-dermatologist'
    ]
  },
  gynecology: {
    name: 'Gynecology & Obstetrics',
    specializations: [
      'gynecologist', 'obstetrician', 'infertility-specialist',
      'maternal-fetal-medicine', 'urogynecologist'
    ]
  },
  ophthalmology: {
    name: 'Ophthalmology',
    specializations: [
      'ophthalmologist', 'retina-specialist', 'cornea-specialist',
      'glaucoma-specialist', 'pediatric-ophthalmologist'
    ]
  },
  dentistry: {
    name: 'Dentistry',
    specializations: [
      'dentist', 'oral-surgeon', 'orthodontist', 'endodontist',
      'periodontist', 'prosthodontist'
    ]
  },
  ent: {
    name: 'ENT (Ear, Nose & Throat)',
    specializations: [
      'ent-specialist', 'otolaryngologist', 'audiologist',
      'speech-therapist', 'head-neck-surgeon'
    ]
  },
  urology: {
    name: 'Urology',
    specializations: [
      'urologist', 'andrologist', 'pediatric-urologist',
      'uro-oncologist', 'female-urologist'
    ]
  },
  nephrology: {
    name: 'Nephrology',
    specializations: [
      'nephrologist', 'renal-transplant-surgeon', 'pediatric-nephrologist'
    ]
  },
  endocrinology: {
    name: 'Endocrinology',
    specializations: [
      'endocrinologist', 'diabetologist', 'thyroid-specialist'
    ]
  },
  gastroenterology: {
    name: 'Gastroenterology',
    specializations: [
      'gastroenterologist', 'hepatologist', 'endoscopic-surgeon'
    ]
  },
  pulmonology: {
    name: 'Pulmonology',
    specializations: [
      'pulmonologist', 'chest-specialist', 'sleep-medicine-specialist'
    ]
  },
  oncology: {
    name: 'Oncology',
    specializations: [
      'oncologist', 'medical-oncologist', 'surgical-oncologist',
      'radiation-oncologist', 'pediatric-oncologist'
    ]
  },
  rheumatology: {
    name: 'Rheumatology',
    specializations: [
      'rheumatologist', 'arthritis-specialist'
    ]
  },
  allergy: {
    name: 'Allergy & Immunology',
    specializations: [
      'allergist', 'immunologist'
    ]
  },
  surgery: {
    name: 'General Surgery',
    specializations: [
      'general-surgeon', 'laparoscopic-surgeon', 'vascular-surgeon',
      'colorectal-surgeon', 'breast-surgeon'
    ]
  },
  'internal-medicine': {
    name: 'Internal Medicine',
    specializations: [
      'general-physician', 'internal-medicine-specialist'
    ]
  }
};

// Common medical conditions and treatments for search optimization
const MEDICAL_CONDITIONS = [
  'heart-disease', 'diabetes', 'hypertension', 'asthma', 'arthritis',
  'migraine', 'thyroid', 'obesity', 'anxiety', 'depression',
  'back-pain', 'knee-pain', 'skin-allergy', 'hair-loss',
  'eye-infection', 'dental-cavity', 'pregnancy-care', 'child-care'
];

// Flatten all cities for easier processing
const ALL_INDIAN_CITIES = [
  ...INDIAN_CITIES.tier1,
  ...INDIAN_CITIES.tier2,
  ...INDIAN_CITIES.tier3
];

// Flatten all specializations for easier processing
const ALL_SPECIALIZATIONS = Object.values(MEDICAL_CATEGORIES)
  .flatMap(category => category.specializations);

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
 * Generate doctor profile URLs for all Indian cities and specializations
 * @returns {Promise<Array>} - Array of doctor profile URL objects
 */
async function generateDoctorProfileUrls() {
  const doctorUrls = [];
  
  try {
    // Generate URLs with different priorities based on city tier
    const generateUrlsForCityTier = (cities, basePriority) => {
      cities.forEach(city => {
        // City landing page for doctors
      doctorUrls.push({
          path: `/${city}/doctors`,
          priority: basePriority,
        changefreq: 'weekly',
        lastmod: new Date().toISOString()
      });
      
        // Specialization-based routes for each city
        ALL_SPECIALIZATIONS.forEach(specialization => {
          doctorUrls.push({
            path: `/${city}/${specialization}`,
            priority: Math.max(0.5, basePriority - 0.1),
            changefreq: 'weekly',
            lastmod: new Date().toISOString()
          });
        });

        // Medical condition-based routes for major cities
        if (basePriority >= 0.8) {
          MEDICAL_CONDITIONS.forEach(condition => {
        doctorUrls.push({
              path: `/${city}/treatment/${condition}`,
              priority: '0.6',
          changefreq: 'weekly',
          lastmod: new Date().toISOString()
            });
          });
        }
      });
    };

    // Generate URLs for different city tiers
    generateUrlsForCityTier(INDIAN_CITIES.tier1, 0.9);
    generateUrlsForCityTier(INDIAN_CITIES.tier2, 0.8);
    generateUrlsForCityTier(INDIAN_CITIES.tier3, 0.7);
    
    // Try to fetch actual doctors and create individual profile URLs
    try {
      const majorCities = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai'];

      for (const city of majorCities) {
        try {
          const doctors = await fetchDoctorsByLocation(city);
      if (Array.isArray(doctors) && doctors.length > 0) {
            // Add doctor profile URLs (limit to avoid overwhelming sitemap)
            const cityDoctors = doctors.slice(0, 25);
            cityDoctors.forEach(doctor => {
          if (doctor.slug || doctor._id) {
            doctorUrls.push({
                  path: `/${city}/doctor/${doctor.slug || doctor._id}`,
              priority: '0.6',
              changefreq: 'monthly',
              lastmod: doctor.updatedAt ? new Date(doctor.updatedAt).toISOString() : new Date().toISOString()
            });
          }
        });
          }
        } catch (error) {
          console.warn(`Could not fetch doctors for ${city}:`, error);
        }
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
 * Generate comprehensive search result URLs for medical conditions and services
 * @returns {Array} - Array of search URL objects
 */
function generateSearchUrls() {
  const searchUrls = [];
  
  // Medical specializations
  ALL_SPECIALIZATIONS.forEach(specialization => {
    searchUrls.push({
      path: `/search?q=${encodeURIComponent(specialization)}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });
  });

  // Medical conditions and treatments
  MEDICAL_CONDITIONS.forEach(condition => {
    searchUrls.push({
      path: `/search?q=${encodeURIComponent(condition)}`,
      priority: '0.6',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });

    // Treatment-specific pages
    searchUrls.push({
      path: `/treatment/${condition}`,
      priority: '0.6',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });
  });

  // Healthcare services
  const healthcareServices = [
    'emergency', 'urgent-care', '24x7', 'home-visit', 'online-consultation',
    'telemedicine', 'second-opinion', 'health-checkup', 'vaccination',
    'preventive-care', 'wellness-program', 'corporate-health'
  ];

  healthcareServices.forEach(service => {
    searchUrls.push({
      path: `/search?q=${encodeURIComponent(service)}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });
  });

  // Symptom-based searches
  const symptoms = [
    'fever', 'headache', 'chest-pain', 'abdominal-pain', 'back-pain',
    'joint-pain', 'skin-problem', 'eye-problem', 'dental-problem',
    'mental-health-issue', 'digestive-problem', 'respiratory-problem'
  ];

  symptoms.forEach(symptom => {
    searchUrls.push({
      path: `/search?q=${encodeURIComponent(symptom)}`,
      priority: '0.5',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });
  });
  
  return searchUrls;
}

/**
 * Generate comprehensive category and subcategory URLs
 * @returns {Array} - Array of category URL objects
 */
function generateCategoryUrls() {
  const categoryUrls = [];
  
  // Blog categories
  const blogCategories = [
    'health', 'wellness', 'medical-advice', 'disease-prevention', 'treatment',
    'lifestyle', 'nutrition', 'fitness', 'mental-health', 'womens-health',
    'mens-health', 'child-health', 'senior-health', 'alternative-medicine'
  ];
  blogCategories.forEach(category => {
    categoryUrls.push({
      path: `/blog/category/${category}`,
      priority: '0.6',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });
  });
  
  // Medical category landing pages
  Object.entries(MEDICAL_CATEGORIES).forEach(([categoryKey, categoryData]) => {
    // Main category page
    categoryUrls.push({
      path: `/doctors/${categoryKey}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });

    // Subspecialization pages
    categoryData.specializations.forEach(specialization => {
    categoryUrls.push({
      path: `/doctors/${specialization}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
      });

      // Treatment pages for major specializations
      if (['cardiologist', 'dermatologist', 'orthopedic-surgeon', 'neurologist'].includes(specialization)) {
        MEDICAL_CONDITIONS.slice(0, 10).forEach(condition => {
          categoryUrls.push({
            path: `/treatment/${condition}/${specialization}`,
            priority: '0.6',
            changefreq: 'weekly',
            lastmod: new Date().toISOString()
          });
        });
      }
    });
  });

  // Emergency and urgent care pages
  const emergencyServices = ['emergency', 'urgent-care', '24x7', 'ambulance', 'home-visit'];
  emergencyServices.forEach(service => {
    categoryUrls.push({
      path: `/services/${service}`,
      priority: '0.9',
      changefreq: 'daily',
      lastmod: new Date().toISOString()
    });
  });

  // Healthcare facility types
  const facilityTypes = ['hospitals', 'clinics', 'diagnostic-centers', 'pharmacies', 'labs'];
  facilityTypes.forEach(facility => {
    categoryUrls.push({
      path: `/search-${facility}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    });

    // Add city-specific facility pages for major cities
    INDIAN_CITIES.tier1.slice(0, 10).forEach(city => {
      categoryUrls.push({
        path: `/${city}/search-${facility}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: new Date().toISOString()
      });
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
 * Generate and save multiple sitemaps to public directory
 * @returns {Promise<void>}
 */
export async function generateAndSaveAllSitemaps() {
  try {
    console.log('🚀 Starting comprehensive sitemap generation...');

    const sitemaps = [
      { name: 'sitemap-main.xml', type: 'all', description: 'Main sitemap' },
      { name: 'sitemap-locations.xml', type: 'locations', description: 'Location sitemaps' },
      { name: 'sitemap-tier1-locations.xml', type: 'tier1-locations', description: 'Tier 1 cities' },
      { name: 'sitemap-tier2-locations.xml', type: 'tier2-locations', description: 'Tier 2 cities' },
      { name: 'sitemap-tier3-locations.xml', type: 'tier3-locations', description: 'Tier 3 cities' },
      { name: 'sitemap-doctors.xml', type: 'doctors', description: 'Doctor profiles' },
      { name: 'sitemap-categories.xml', type: 'categories', description: 'Medical categories' },
      { name: 'sitemap-conditions.xml', type: 'conditions', description: 'Medical conditions' },
      { name: 'sitemap-blogs.xml', type: 'blogs', description: 'Blog posts' },
      { name: 'sitemap-search.xml', type: 'search', description: 'Search pages' }
    ];

    const generatedSitemaps = [];

    for (const sitemap of sitemaps) {
      try {
        console.log(`📄 Generating ${sitemap.description}...`);
        const xml = await generateSitemapByType(sitemap.type);

        // Create blob and download
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = sitemap.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        generatedSitemaps.push(sitemap.name);

        console.log(`✅ Generated ${sitemap.name}`);
      } catch (error) {
        console.error(`❌ Error generating ${sitemap.name}:`, error);
      }
    }

    // Generate sitemap index
    const sitemapIndex = generateSitemapIndex(generatedSitemaps);
    const indexBlob = new Blob([sitemapIndex], { type: 'application/xml' });
    const indexUrl = URL.createObjectURL(indexBlob);

    const indexLink = document.createElement('a');
    indexLink.href = indexUrl;
    indexLink.download = 'sitemap-index.xml';
    document.body.appendChild(indexLink);
    indexLink.click();
    document.body.removeChild(indexLink);

    URL.revokeObjectURL(indexUrl);

    console.log('🎉 All sitemaps generated successfully!');
    console.log(`📋 Generated ${generatedSitemaps.length + 1} sitemap files`);

  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    throw error;
  }
}

/**
 * Generate sitemap index file
 * @param {Array<string>} sitemapNames - Array of sitemap filenames
 * @returns {string} - XML sitemap index
 */
function generateSitemapIndex(sitemapNames) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const sitemapIndexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const sitemapIndexClose = '</sitemapindex>';

  const sitemapEntries = sitemapNames.map(name => {
    return `  <sitemap>
    <loc>${BASE_URL}/${name}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`;
  }).join('\n');

  return `${xmlHeader}
${sitemapIndexOpen}
${sitemapEntries}
${sitemapIndexClose}`;
}

/**
 * Generate and save sitemap to public directory (legacy function)
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
 * Generate location-specific sitemap
 * @param {string} tier - 'tier1', 'tier2', 'tier3', 'all'
 * @returns {Promise<string>} - XML sitemap for locations
 */
export async function generateLocationSitemap(tier = 'all') {
  try {
    const locationUrls = [];

    const generateUrlsForTier = async (cities, basePriority) => {
      for (const city of cities) {
        // City landing page
        locationUrls.push({
          path: `/${city}`,
          priority: basePriority,
          changefreq: 'weekly',
          lastmod: new Date().toISOString()
        });

        // City doctors page
        locationUrls.push({
          path: `/${city}/doctors`,
          priority: basePriority - 0.1,
          changefreq: 'weekly',
          lastmod: new Date().toISOString()
        });

        // Major specializations for this city
        ALL_SPECIALIZATIONS.slice(0, 20).forEach(specialization => {
          locationUrls.push({
            path: `/${city}/${specialization}`,
            priority: Math.max(0.5, basePriority - 0.2),
            changefreq: 'weekly',
            lastmod: new Date().toISOString()
          });
        });
      }
    };

    switch (tier) {
      case 'tier1':
        await generateUrlsForTier(INDIAN_CITIES.tier1, 0.9);
        break;
      case 'tier2':
        await generateUrlsForTier(INDIAN_CITIES.tier2, 0.8);
        break;
      case 'tier3':
        await generateUrlsForTier(INDIAN_CITIES.tier3, 0.7);
        break;
      case 'all':
      default:
        await generateUrlsForTier(INDIAN_CITIES.tier1, 0.9);
        await generateUrlsForTier(INDIAN_CITIES.tier2, 0.8);
        await generateUrlsForTier(INDIAN_CITIES.tier3, 0.7);
        break;
    }

    return generateSitemapXML(locationUrls);

  } catch (error) {
    console.error(`Error generating location sitemap:`, error);
    throw error;
  }
}

/**
 * Generate category-specific sitemap
 * @param {string} category - Medical category name or 'all'
 * @returns {string} - XML sitemap for categories
 */
export function generateCategorySitemap(category = 'all') {
  try {
    const categoryUrls = [];

    if (category === 'all') {
      // Generate all category URLs
      Object.entries(MEDICAL_CATEGORIES).forEach(([categoryKey, categoryData]) => {
        // Main category page
        categoryUrls.push({
          path: `/doctors/${categoryKey}`,
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: new Date().toISOString()
        });

        // Subspecializations
        categoryData.specializations.forEach(specialization => {
          categoryUrls.push({
            path: `/doctors/${specialization}`,
            priority: '0.7',
            changefreq: 'weekly',
            lastmod: new Date().toISOString()
          });
        });
      });
    } else if (MEDICAL_CATEGORIES[category]) {
      // Generate specific category URLs
      const categoryData = MEDICAL_CATEGORIES[category];

      categoryUrls.push({
        path: `/doctors/${category}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: new Date().toISOString()
      });

      categoryData.specializations.forEach(specialization => {
        categoryUrls.push({
          path: `/doctors/${specialization}`,
          priority: '0.7',
          changefreq: 'weekly',
          lastmod: new Date().toISOString()
        });
      });
    }

    return generateSitemapXML(categoryUrls);

  } catch (error) {
    console.error(`Error generating category sitemap:`, error);
    throw error;
  }
}

/**
 * Generate condition-specific sitemap
 * @returns {string} - XML sitemap for medical conditions
 */
export function generateConditionSitemap() {
  try {
    const conditionUrls = [];

    MEDICAL_CONDITIONS.forEach(condition => {
      // General condition page
      conditionUrls.push({
        path: `/condition/${condition}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: new Date().toISOString()
      });

      // Treatment pages for major conditions
      const majorConditions = ['heart-disease', 'diabetes', 'hypertension', 'asthma', 'arthritis'];
      if (majorConditions.includes(condition)) {
        ALL_SPECIALIZATIONS.slice(0, 10).forEach(specialization => {
          conditionUrls.push({
            path: `/treatment/${condition}/${specialization}`,
            priority: '0.6',
            changefreq: 'weekly',
            lastmod: new Date().toISOString()
          });
        });
      }
    });

    return generateSitemapXML(conditionUrls);

  } catch (error) {
    console.error('Error generating condition sitemap:', error);
    throw error;
  }
}

/**
 * Generate sitemap for specific content type
 * @param {string} type - 'blogs', 'doctors', 'categories', 'locations', 'conditions', 'all'
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
      case 'locations':
        return await generateLocationSitemap('all');
      case 'tier1-locations':
        return await generateLocationSitemap('tier1');
      case 'tier2-locations':
        return await generateLocationSitemap('tier2');
      case 'tier3-locations':
        return await generateLocationSitemap('tier3');
      case 'conditions':
        return generateConditionSitemap();
      case 'search':
        urls = generateSearchUrls();
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
