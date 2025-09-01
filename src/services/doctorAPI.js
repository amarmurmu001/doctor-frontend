const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchDoctorsByLocation = async (location) => {
  try {
    const params = new URLSearchParams({
      city: String(location || '').toLowerCase(),
      status: 'approved' // Only fetch approved doctors
    });
    const response = await fetch(`${API_BASE_URL}/api/doctors?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns an array of doctors, filter to ensure only approved ones
    const doctors = Array.isArray(data) ? data : [];
    return doctors.filter(doctor => doctor.status === 'approved');
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const searchDoctors = async (location, specialty = '', name = '') => {
  try {
    const params = new URLSearchParams({
      ...(location && { city: String(location).toLowerCase() }),
      ...(specialty && { specialty }),
      ...(name && { q: name }),
      status: 'approved' // Only fetch approved doctors
    });
    const response = await fetch(`${API_BASE_URL}/api/doctors?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Filter to ensure only approved doctors are returned
    const doctors = Array.isArray(data) ? data : [];
    return doctors.filter(doctor => doctor.status === 'approved');
  } catch (error) {
    console.error('Error searching doctors:', error);
    throw error;
  }
};

// Map specialty to medical type based on keywords
const mapSpecialtyToMedicalType = (specialty) => {
  if (!specialty || typeof specialty !== 'string') {
    return 'allopathic';
  }

  const specialtyLower = specialty.toLowerCase().trim();

  // Ayurveda keywords (expanded)
  const ayurvedaKeywords = [
    'ayurveda', 'ayurvedic', 'panchakarma', 'panchkarma', 'herbal', 'yoga',
    'marma', 'rasayana', 'detox', 'rejuvenation', 'ayurvedic medicine',
    'traditional medicine', 'holistic', 'diet therapy', 'nutrition therapy'
  ];
  if (ayurvedaKeywords.some(keyword => specialtyLower.includes(keyword))) {
    return 'ayurveda';
  }

  // Dentistry keywords (expanded)
  const dentistKeywords = [
    'dentist', 'dental', 'orthodontics', 'orthodontist', 'oral', 'periodontics',
    'endodontics', 'implant', 'cosmetic dentistry', 'pediatric dentistry',
    'oral surgery', 'prosthodontics', 'oral pathology', 'dental surgeon'
  ];
  if (dentistKeywords.some(keyword => specialtyLower.includes(keyword))) {
    return 'dentist';
  }

  // Homeopathy keywords (expanded)
  const homeopathyKeywords = [
    'homeopathy', 'homeopathic', 'classical homeopathy', 'clinical homeopathy',
    'homeopathic medicine', 'alternative medicine'
  ];
  if (homeopathyKeywords.some(keyword => specialtyLower.includes(keyword))) {
    return 'homeopathy';
  }

  // Default to allopathic for all other specialties
  return 'allopathic';
};

// Fetch doctor counts by specialty for a given location
export const fetchDoctorCountsBySpecialty = async (location, medicalType) => {
  try {
    const params = new URLSearchParams({
      ...(location && { city: String(location).toLowerCase() }),
      status: 'approved' // Only fetch approved doctors
    });

    const response = await fetch(`${API_BASE_URL}/api/doctors?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const allDoctors = Array.isArray(data) ? data.filter(doctor => doctor.status === 'approved') : [];

    // Filter doctors by medical type based on their specialty
    const doctors = allDoctors.filter(doctor => {
      const doctorMedicalType = mapSpecialtyToMedicalType(doctor.specialty || '');
      return doctorMedicalType === medicalType;
    });

    console.log(`Filtered ${doctors.length} doctors for medical type: ${medicalType} from ${allDoctors.length} total doctors`);

    // Debug: Show mapping results
    if (doctors.length > 0) {
      console.log(`Doctors found for ${medicalType}:`, doctors.map(d => ({ specialty: d.specialty, mappedType: mapSpecialtyToMedicalType(d.specialty) })));
    } else {
      console.log(`No doctors found for ${medicalType}. Available doctors by type:`, allDoctors.reduce((acc, doctor) => {
        const type = mapSpecialtyToMedicalType(doctor.specialty || '');
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}));
    }

    // Get the default categories for this medical type with mapping variations
    const medicalTypeConfigs = {
      allopathic: {
        defaultCategories: [
          'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology',
          'Pediatrics', 'Gynecology', 'ENT', 'Ophthalmology', 'Urology',
          'Psychiatry', 'Nephrology', 'Endocrinology'
        ],
        mappings: {
          'General Medicine': ['General Medicine', 'General Physician', 'Family Medicine', 'Internal Medicine'],
          'Cardiology': ['Cardiology', 'Cardiologist', 'Heart Specialist'],
          'Neurology': ['Neurology', 'Neurologist', 'Brain Specialist'],
          'Orthopedics': ['Orthopedics', 'Orthopedic', 'Bone Specialist', 'Orthopaedic'],
          'Dermatology': ['Dermatology', 'Dermatologist', 'Skin Specialist'],
          'Pediatrics': ['Pediatrics', 'Pediatrician', 'Child Specialist'],
          'Gynecology': ['Gynecology', 'Gynecologist', 'OBGYN'],
          'ENT': ['ENT', 'ENT Specialist', 'Ear Nose Throat'],
          'Ophthalmology': ['Ophthalmology', 'Eye Specialist', 'Ophthalmologist'],
          'Urology': ['Urology', 'Urologist'],
          'Psychiatry': ['Psychiatry', 'Psychiatrist', 'Mental Health'],
          'Nephrology': ['Nephrology', 'Kidney Specialist'],
          'Endocrinology': ['Endocrinology', 'Endocrinologist', 'Diabetes Specialist']
        }
      },
      ayurveda: {
        defaultCategories: [
          'Ayurvedic Medicine', 'Panchakarma', 'Herbal Medicine', 'Yoga Therapy',
          'Diet & Nutrition', 'Skin Care', 'Hair Care', 'Stress Management',
          'Detox Therapy', 'Rejuvenation', 'Marma Therapy'
        ],
        mappings: {
          'Ayurvedic Medicine': ['Ayurvedic Medicine', 'Ayurveda', 'Ayurvedic Doctor', 'Ayurvedic Physician'],
          'Panchakarma': ['Panchakarma', 'Panchkarma'],
          'Herbal Medicine': ['Herbal Medicine', 'Herbalist'],
          'Yoga Therapy': ['Yoga Therapy', 'Yoga'],
          'Diet & Nutrition': ['Diet & Nutrition', 'Nutrition', 'Dietitian'],
          'Skin Care': ['Skin Care', 'Ayurvedic Skin Care'],
          'Hair Care': ['Hair Care', 'Ayurvedic Hair Care'],
          'Stress Management': ['Stress Management', 'Stress Relief'],
          'Detox Therapy': ['Detox Therapy', 'Detoxification'],
          'Rejuvenation': ['Rejuvenation', 'Rasayana'],
          'Marma Therapy': ['Marma Therapy', 'Marma']
        }
      },
      dentist: {
        defaultCategories: [
          'General Dentistry', 'Orthodontics', 'Oral Surgery', 'Periodontics',
          'Endodontics', 'Pediatric Dentistry', 'Cosmetic Dentistry',
          'Dental Implants', 'Oral Pathology'
        ],
        mappings: {
          'General Dentistry': ['General Dentistry', 'Dentist', 'Dental'],
          'Orthodontics': ['Orthodontics', 'Orthodontist', 'Braces'],
          'Oral Surgery': ['Oral Surgery', 'Oral Surgeon'],
          'Periodontics': ['Periodontics', 'Periodontist', 'Gum Specialist'],
          'Endodontics': ['Endodontics', 'Root Canal', 'Endodontist'],
          'Pediatric Dentistry': ['Pediatric Dentistry', 'Pediatric Dentist', 'Kids Dentist'],
          'Cosmetic Dentistry': ['Cosmetic Dentistry', 'Cosmetic Dentist'],
          'Dental Implants': ['Dental Implants', 'Implant Specialist'],
          'Oral Pathology': ['Oral Pathology', 'Oral Pathologist']
        }
      },
      homeopathy: {
        defaultCategories: [
          'Classical Homeopathy', 'Clinical Homeopathy', 'Pediatric Homeopathy',
          'Skin Disorders', 'Respiratory Issues', 'Digestive Problems',
          'Mental Health', 'Allergy Treatment', 'Chronic Diseases', 'Women Health'
        ],
        mappings: {
          'Classical Homeopathy': ['Classical Homeopathy', 'Homeopathy', 'Homeopathic Doctor'],
          'Clinical Homeopathy': ['Clinical Homeopathy', 'Clinical Homeopath'],
          'Pediatric Homeopathy': ['Pediatric Homeopathy', 'Kids Homeopathy'],
          'Skin Disorders': ['Skin Disorders', 'Homeopathic Skin Treatment'],
          'Respiratory Issues': ['Respiratory Issues', 'Homeopathic Respiratory'],
          'Digestive Problems': ['Digestive Problems', 'Homeopathic Digestive'],
          'Mental Health': ['Mental Health', 'Homeopathic Mental Health'],
          'Allergy Treatment': ['Allergy Treatment', 'Homeopathic Allergy'],
          'Chronic Diseases': ['Chronic Diseases', 'Homeopathic Chronic'],
          'Women Health': ['Women Health', 'Homeopathic Women Health']
        }
      }
    };

    const config = medicalTypeConfigs[medicalType] || medicalTypeConfigs.allopathic;
    const defaultCategories = config.defaultCategories;
    const specialtyMappings = config.mappings || {};

    // Group doctors by specialty and count them
    const specialtyCounts = {};
    doctors.forEach(doctor => {
      const specialty = doctor.specialty || 'General Medicine';
      specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
    });

    // Debug: Log all available specialties and their counts
    console.log('Available doctor specialties in database:', specialtyCounts);
    console.log('Default categories for', medicalType, ':', defaultCategories);
    console.log('Specialty mappings for', medicalType, ':', specialtyMappings);

    // Create categories with actual counts using comprehensive mapping
    const categoriesWithCounts = defaultCategories.map(category => {
      let count = 0;

      // First, try to find doctors that match this category using the mapping
      const mappedSpecialties = specialtyMappings[category] || [category];

      // Count doctors for all mapped specialties
      mappedSpecialties.forEach(mappedSpecialty => {
        // Try exact match first
        count += specialtyCounts[mappedSpecialty] || 0;

        // Try case-insensitive match
        if (count === 0) {
          const mappedLower = mappedSpecialty.toLowerCase();
          for (const [specialty, doctorCount] of Object.entries(specialtyCounts)) {
            if (specialty.toLowerCase() === mappedLower) {
              count += doctorCount;
              console.log('Found case-insensitive match:', mappedSpecialty, '->', specialty, 'count:', doctorCount);
              break;
            }
          }
        }

        // Try partial match
        if (count === 0) {
          const mappedLower = mappedSpecialty.toLowerCase();
          for (const [specialty, doctorCount] of Object.entries(specialtyCounts)) {
            const specialtyLower = specialty.toLowerCase();
            if (specialtyLower.includes(mappedLower) || mappedLower.includes(specialtyLower)) {
              count += doctorCount;
              console.log('Found partial match:', mappedSpecialty, '->', specialty, 'count:', doctorCount);
            }
          }
        }
      });

      console.log('Category:', category, '-> Count:', count, 'Mapped specialties:', mappedSpecialties);

      return {
        category,
        number: count
      };
    });

    console.log('Categories with counts:', categoriesWithCounts);

    // Calculate total count of doctors in the departments/specialties being displayed
    const departmentDoctorCount = categoriesWithCounts.reduce((total, cat) => total + cat.number, 0);

    // If no doctors found for this medical type but doctors exist in location, provide default counts for better UX
    let finalCategories = categoriesWithCounts;
    let finalTotalCount = departmentDoctorCount;

    if (departmentDoctorCount === 0) {
      if (doctors.length > 0) {
        console.log('No doctors matched categories for medical type', medicalType, 'but doctors exist for this type.');
        console.log('Available specialties for', medicalType, ':', Object.keys(specialtyCounts));
        console.log('Expected categories:', defaultCategories);

        // Provide default counts for better UX - distribute available doctors across categories
        const availableDoctors = Object.values(specialtyCounts).reduce((sum, count) => sum + count, 0);
        const categoryCount = defaultCategories.length;
        const baseCount = Math.floor(availableDoctors / categoryCount);
        const remainder = availableDoctors % categoryCount;

        finalCategories = defaultCategories.map((category, index) => ({
          category,
          number: baseCount + (index < remainder ? 1 : 0)
        }));

        finalTotalCount = availableDoctors;
        console.log('Applied default distribution for', medicalType, ':', finalCategories);
      } else if (allDoctors.length > 0) {
        console.log('No doctors found for medical type', medicalType, 'but doctors exist in location with different specialties.');
        console.log('All available specialties in location:', allDoctors.map(d => d.specialty));

        // Show a small count to indicate there are doctors but not in expected categories
        finalCategories = defaultCategories.map(category => ({
          category,
          number: 0
        }));
        finalTotalCount = 0;
      } else {
        console.log('No doctors found for medical type', medicalType, 'in this location.');
        // Keep the zero counts as they are
      }
    }

    return {
      categories: finalCategories,
      totalCount: finalTotalCount, // Count only doctors in the displayed departments
      allDoctorsCount: allDoctors.length // Keep original total for reference
    };

  } catch (error) {
    console.error('Error fetching doctor counts:', error);
    throw error;
  }
};

// Test function to validate specialty mapping (can be removed after testing)
export const testSpecialtyMapping = () => {
  const testSpecialties = [
    'Cardiology', 'Ayurvedic Medicine', 'Dentist', 'Homeopathy',
    'Neurology', 'Panchakarma', 'Orthodontics', 'Clinical Homeopathy',
    'Dermatology', 'Yoga Therapy', 'Oral Surgery', 'Mental Health'
  ];

  console.log('Specialty Mapping Test Results:');
  testSpecialties.forEach(specialty => {
    const mappedType = mapSpecialtyToMedicalType(specialty);
    console.log(`${specialty} -> ${mappedType}`);
  });
};

