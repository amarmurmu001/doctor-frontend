/**
 * Sitemap Generator for Doctor Profiles
 * Helps search engines discover and index doctor profile pages
 */

/**
 * Generate sitemap XML for doctor profiles
 * @param {Array} doctors - Array of doctor objects
 * @returns {string} XML sitemap content
 */
export const generateDoctorSitemap = (doctors) => {
  if (!doctors || !Array.isArray(doctors)) {
    return '';
  }

  const baseUrl = 'https://www.doctar.in';
  const currentDate = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  // Add doctor profile URLs
  doctors.forEach(doctor => {
    if (doctor.user?.name && doctor.specialty && doctor.city) {
      const location = doctor.city.toLowerCase().replace(/\s+/g, '-');
      const nameSlug = doctor.user.name.toLowerCase().replace(/\s+/g, '-');
      const specialtySlug = doctor.specialty.toLowerCase().replace(/\s+/g, '-');
      const doctorUrl = `${baseUrl}/${location}/doctor/${nameSlug}-${specialtySlug}`;
      
      sitemap += `
  <url>
    <loc>${doctorUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

/**
 * Generate robots.txt content
 * @returns {string} robots.txt content
 */
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.doctar.in/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /auth/
Disallow: /api/

# Allow doctor profiles
Allow: /*/doctor/*
Allow: /search

# Crawl delay (optional)
Crawl-delay: 1`;
};

/**
 * Generate structured data for multiple doctors
 * @param {Array} doctors - Array of doctor objects
 * @returns {Array} Array of JSON-LD structured data
 */
export const generateDoctorsStructuredData = (doctors) => {
  if (!doctors || !Array.isArray(doctors)) {
    return [];
  }

  return doctors.map(doctor => {
    if (!doctor.user?.name || !doctor.specialty || !doctor.city) {
      return null;
    }

    const location = doctor.city.toLowerCase().replace(/\s+/g, '-');
    const nameSlug = doctor.user.name.toLowerCase().replace(/\s+/g, '-');
    const specialtySlug = doctor.specialty.toLowerCase().replace(/\s+/g, '-');
    const doctorUrl = `https://www.doctar.in/${location}/doctor/${nameSlug}-${specialtySlug}`;

    return {
      "@context": "https://schema.org",
      "@type": "Physician",
      "name": `Dr. ${doctor.user.name}`,
      "medicalSpecialty": doctor.specialty,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": doctor.city,
        "addressCountry": "India"
      },
      "url": doctorUrl,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": doctor.ratingAverage || 4.5,
        "reviewCount": doctor.ratingCount || 0
      }
    };
  }).filter(Boolean);
};
