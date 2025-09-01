import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../components/layout/PageHeader";
import ResultCount from "../components/doctor/ResultCount";
import DoctorTypeGrid from "../components/doctor/DoctorTypeGrid";
import PageSeo from "../components/seo/PageSeo";
import { formatLocationName } from "../utils/locationUtils";
import { initializeLocation } from "../stores/locationSlice";
import { fetchDoctorCountsBySpecialty } from "../services/doctorAPI";

// Medical type configurations
const medicalTypeConfigs = {
  allopathic: {
    title: "Allopathic Doctors",
    description: "Find certified allopathic doctors and medical specialists near you.",
    keywords: "allopathic doctors, medical specialists, allopathy, western medicine",
    defaultCategories: [
      { category: "General Medicine", number: 45 },
      { category: "Cardiology", number: 32 },
      { category: "Neurology", number: 28 },
      { category: "Orthopedics", number: 35 },
      { category: "Dermatology", number: 29 },
      { category: "Pediatrics", number: 38 },
      { category: "Gynecology", number: 31 },
      { category: "ENT", number: 26 },
      { category: "Ophthalmology", number: 33 },
      { category: "Urology", number: 22 },
      { category: "Psychiatry", number: 27 },
      { category: "Nephrology", number: 19 },
      { category: "Endocrinology", number: 24 }
    ]
  },
  ayurveda: {
    title: "Ayurvedic Doctors",
    description: "Discover traditional Ayurvedic practitioners and holistic healers.",
    keywords: "ayurvedic doctors, ayurveda, traditional medicine, holistic healing",
    defaultCategories: [
      { category: "Ayurvedic Medicine", number: 28 },
      { category: "Panchakarma", number: 15 },
      { category: "Herbal Medicine", number: 22 },
      { category: "Yoga Therapy", number: 18 },
      { category: "Diet & Nutrition", number: 25 },
      { category: "Skin Care", number: 20 },
      { category: "Hair Care", number: 16 },
      { category: "Stress Management", number: 21 },
      { category: "Detox Therapy", number: 14 },
      { category: "Rejuvenation", number: 12 },
      { category: "Marma Therapy", number: 17 }
    ]
  },
  dentist: {
    title: "Dentists & Dental Specialists",
    description: "Find qualified dentists and dental care specialists in your area.",
    keywords: "dentists, dental specialists, dental care, oral health",
    defaultCategories: [
      { category: "General Dentistry", number: 42 },
      { category: "Orthodontics", number: 18 },
      { category: "Oral Surgery", number: 12 },
      { category: "Periodontics", number: 15 },
      { category: "Endodontics", number: 14 },
      { category: "Pediatric Dentistry", number: 16 },
      { category: "Cosmetic Dentistry", number: 21 },
      { category: "Dental Implants", number: 13 },
      { category: "Oral Pathology", number: 9 }
    ]
  },
  homeopathy: {
    title: "Homeopathic Doctors",
    description: "Connect with experienced homeopathic practitioners for natural healing.",
    keywords: "homeopathic doctors, homeopathy, natural medicine, alternative medicine",
    defaultCategories: [
      { category: "Classical Homeopathy", number: 24 },
      { category: "Clinical Homeopathy", number: 19 },
      { category: "Pediatric Homeopathy", number: 15 },
      { category: "Skin Disorders", number: 18 },
      { category: "Respiratory Issues", number: 16 },
      { category: "Digestive Problems", number: 14 },
      { category: "Mental Health", number: 12 },
      { category: "Allergy Treatment", number: 20 },
      { category: "Chronic Diseases", number: 17 },
      { category: "Women Health", number: 15 }
    ]
  }
};

export default function SubDepartments() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [totalDoctorCount, setTotalDoctorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Medical Specialists");
  const [pageDescription, setPageDescription] = useState("Find doctors by medical specialties and types.");
  const [pageKeywords, setPageKeywords] = useState("doctor types, medical specialties");

  // Use location from store instead of URL params
  const dispatch = useDispatch();
  const { selectedLocation, isInitialized } = useSelector((state) => state.location);

  const medicalType = searchParams.get('type') || 'allopathic';

  // Handle card click - navigate to search page with filters
  const handleCardClick = (category) => {
    const params = new URLSearchParams();

    // Add specialty/category filter
    params.set('q', category);

    // Add medical type as additional filter
    params.set('type', medicalType);

    // Navigate to search page with filters
    navigate(`/search?${params.toString()}`);
  };

  // Get user location from store
  const getUserLocation = useCallback(() => {
    // Use location from store, default to India if not set
    const locationName = selectedLocation || 'India';
    return locationName;
  }, [selectedLocation]);

  // Fetch doctor counts dynamically
  const fetchDoctorCounts = useCallback(async (location, type) => {
    try {
      setLoading(true);
      console.log(`Fetching doctor counts for ${type} in ${location}`);
      const result = await fetchDoctorCountsBySpecialty(location, type);
      console.log(`Results for ${type}:`, result);
      setDynamicCategories(result.categories);
      setTotalDoctorCount(result.totalCount); // This now contains only department doctors count
    } catch (error) {
      console.error('Error fetching doctor counts:', error);
      // Fallback to hardcoded categories if API fails
      const config = medicalTypeConfigs[type] || medicalTypeConfigs.allopathic;
      setDynamicCategories(config.defaultCategories);
      // Calculate only the sum of department categories, not all doctors
      setTotalDoctorCount(config.defaultCategories.reduce((total, cat) => total + cat.number, 0));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initialize location store if not already done
    if (!isInitialized) {
      dispatch(initializeLocation());
    }
  }, [isInitialized, dispatch]);

  useEffect(() => {
    const config = medicalTypeConfigs[medicalType] || medicalTypeConfigs.allopathic;

    // Set location first
    const userLocation = getUserLocation();

    // Fetch dynamic doctor counts
    fetchDoctorCounts(userLocation, medicalType);

    setPageTitle(`${config.title} in ${formatLocationName(userLocation)}`);
    setPageDescription(`${config.description} Find the best healthcare professionals in ${formatLocationName(userLocation)}.`);
    setPageKeywords(`${config.keywords}, ${formatLocationName(userLocation)} doctors, healthcare ${formatLocationName(userLocation)}`);
  }, [medicalType, getUserLocation, isInitialized, fetchDoctorCounts]);

  // Re-fetch data when location changes
  useEffect(() => {
    if (isInitialized && selectedLocation) {
      fetchDoctorCounts(selectedLocation, medicalType);
    }
  }, [selectedLocation, medicalType, isInitialized, fetchDoctorCounts]);
  return (
    <>
      <PageSeo
        title={`${pageTitle} | Doctar`}
        description={pageDescription}
        keywords={pageKeywords}
        canonicalUrl={`https://www.doctar.in/sub-departments?type=${medicalType}`}
      />

      <div className="w-full min-h-screen bg-[#f4f4ff]">
        {/* Header with search */}
        <PageHeader />

        {/* Result count */}
        <div className="px-4 pt-4">
          <ResultCount
            count={totalDoctorCount}
            department={medicalType}
            location={selectedLocation || 'India'}
          />
        </div>

        {/* Dynamic categories grid */}
        <div className="pt-4">
          {loading ? (
            <div className="px-4 py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7551B2] mx-auto mb-4"></div>
              <div className="text-gray-500">Loading {medicalType} specialists...</div>
            </div>
          ) : dynamicCategories.length > 0 ? (
            <DoctorTypeGrid
              categories={dynamicCategories}
              showTopRow={false}
              onCardClick={handleCardClick}
            />
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="text-gray-500">No specialists found in this location.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


