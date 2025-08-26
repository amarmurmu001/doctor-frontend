/**
 * SEO Utility Functions for Doctar Platform
 * Handles URL generation, slug creation, and SEO optimization
 */

/**
 * Generate SEO-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} SEO-friendly slug
 */
export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate doctor profile URL in SEO format
 * @param {Object} doctor - Doctor object
 * @param {string} doctor.user.name - Doctor's name
 * @param {string} doctor.specialty - Doctor's specialty
 * @param {string} doctor.city - Doctor's city
 * @returns {string} SEO-friendly URL
 */
export const generateDoctorProfileUrl = (doctor) => {
  if (!doctor) return '/';
  
  const name = doctor.user?.name || 'doctor';
  const specialty = doctor.specialty || 'general-physician';
  const city = doctor.city || 'india';
  
  const nameSlug = generateSlug(name);
  const specialtySlug = generateSlug(specialty);
  const citySlug = generateSlug(city);
  
  return `/${citySlug}/doctor/${nameSlug}-${specialtySlug}`;
};

/**
 * Generate canonical URL for doctor profile
 * @param {Object} doctor - Doctor object
 * @returns {string} Full canonical URL
 */
export const generateCanonicalUrl = (doctor) => {
  const relativeUrl = generateDoctorProfileUrl(doctor);
  return `https://www.doctar.in${relativeUrl}`;
};

/**
 * Generate disease-specific keywords for SEO
 * @param {string} specialty - Doctor's specialty
 * @returns {string} Comma-separated disease keywords
 */
export const generateDiseaseKeywords = (specialty) => {
  const specialtyKeywords = {
    'Cardiologist': 'heart disease, cardiac problems, hypertension, chest pain, heart attack prevention, arrhythmia, heart failure',
    'Dermatologist': 'skin problems, acne, eczema, hair fall, skin allergies, dermatitis, psoriasis, skin cancer',
    'Orthopedic': 'bone fractures, joint pain, arthritis, back pain, sports injuries, osteoporosis, spine problems',
    'Pediatrician': 'child health, vaccination, fever in children, growth issues, pediatric care, child development',
    'Neurologist': 'headache, migraine, seizures, nerve problems, stroke, neurological disorders, brain health',
    'General Physician': 'fever, cold, cough, diabetes, blood pressure, general health checkup, preventive care',
    'Gynecologist': 'women health, pregnancy care, menstrual problems, gynecological issues, fertility, menopause',
    'Psychiatrist': 'mental health, depression, anxiety, stress management, psychiatric care, therapy, counseling',
    'ENT Specialist': 'ear problems, nose issues, throat infections, hearing loss, sinusitis, tonsillitis',
    'Ophthalmologist': 'eye care, vision problems, cataract, glaucoma, eye infections, retinal diseases',
    'Dentist': 'dental care, tooth problems, gum disease, oral health, dental implants, root canal',
    'Urologist': 'urinary problems, kidney stones, prostate issues, bladder problems, male health',
    'Gastroenterologist': 'stomach problems, digestive issues, liver disease, acid reflux, IBS, colon health',
    'Endocrinologist': 'diabetes, thyroid problems, hormone disorders, metabolic issues, weight management',
    'Oncologist': 'cancer treatment, chemotherapy, radiation therapy, cancer screening, oncology care'
  };
  
  return specialtyKeywords[specialty] || `${specialty?.toLowerCase()} treatment, consultation, medical care, healthcare`;
};

/**
 * Generate SEO-optimized title for doctor profile
 * @param {string} fullName - Doctor's full name
 * @param {string} specialization - Doctor's specialization
 * @param {string} location - Doctor's location
 * @returns {string} SEO-optimized title
 */
export const generateSeoTitle = (fullName, specialization, location) => {
  return `Dr. ${fullName} – Best ${specialization} in ${location} | Book Appointment Online | Doctar`;
};

/**
 * Generate SEO-optimized meta description
 * @param {string} fullName - Doctor's full name
 * @param {string} specialization - Doctor's specialization
 * @param {string} location - Doctor's location
 * @param {number} yearsExperience - Years of experience
 * @param {string} diseaseKeywords - Disease-specific keywords
 * @returns {string} SEO-optimized meta description
 */
export const generateSeoDescription = (fullName, specialization, location, yearsExperience, diseaseKeywords) => {
  return `Consult Dr. ${fullName}, top-rated ${specialization} in ${location} with ${yearsExperience}+ years of experience. Specializes in ${diseaseKeywords}. Book appointments online, check consultation fees, clinic timings, contact details & read verified patient reviews. 100% Free booking on Doctar.`;
};

/**
 * Generate SEO-optimized keywords
 * @param {string} fullName - Doctor's full name
 * @param {string} specialization - Doctor's specialization
 * @param {string} location - Doctor's location
 * @returns {string} Comma-separated SEO keywords
 */
export const generateSeoKeywords = (fullName, specialization, location) => {
  return `Dr ${fullName} ${specialization} in ${location}, Best ${specialization} in ${location}, Top ${specialization} near me, Experienced ${specialization} ${location}, ${specialization} doctor online booking, Trusted ${specialization} in ${location}, Affordable ${specialization} consultation ${location}, Verified ${specialization} reviews ${location}, Doctar ${specialization} appointment booking`;
};

/**
 * Clean and validate location for URL usage
 * @param {string} location - Location string
 * @returns {string} Cleaned location string
 */
export const cleanLocationForUrl = (location) => {
  if (!location) return 'india';
  return location
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Validate if current URL matches SEO format
 * @param {string} currentPath - Current URL path
 * @param {Object} doctor - Doctor object
 * @returns {boolean} True if URL matches SEO format
 */
export const isSeoUrlFormat = (currentPath, doctor) => {
  if (!doctor || !currentPath) return false;
  
  const expectedPath = generateDoctorProfileUrl(doctor);
  return currentPath === expectedPath;
};
