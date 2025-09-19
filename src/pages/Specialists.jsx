import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";

// Medical specialties data
const medicalSpecialties = [
  {
    id: 1,
    name: "Cardiologist",
    icon: "/icons/cardiologist.PNG",
    description: "Heart & cardiovascular health",
    color: "#ef4444"
  },
  {
    id: 2,
    name: "Dermatologist",
    icon: "/icons/dermatologist.PNG",
    description: "Skin, hair & nail care",
    color: "#8b5cf6"
  },
  {
    id: 3,
    name: "Pediatrician",
    icon: "/icons/pediatrician.PNG",
    description: "Child healthcare & development",
    color: "#06b6d4"
  },
  {
    id: 4,
    name: "Orthopedist",
    icon: "/icons/orthopaedist.PNG",
    description: "Bones, joints & musculoskeletal",
    color: "#f59e0b"
  },
  {
    id: 5,
    name: "Neurologist",
    icon: "/icons/neurologist.PNG",
    description: "Brain, spine & nervous system",
    color: "#10b981"
  },
  {
    id: 6,
    name: "Gynecologist",
    icon: "/icons/gynaecologist.PNG",
    description: "Women's health & reproductive care",
    color: "#ec4899"
  },
  {
    id: 7,
    name: "Dentist",
    icon: "/icons/dentist.png",
    description: "Oral health & dental care",
    color: "#06b6d4"
  },
  {
    id: 8,
    name: "ENT",
    icon: "/icons/ENT.PNG",
    description: "Ear, nose & throat specialist",
    color: "#84cc16"
  },
  {
    id: 9,
    name: "Ophthalmologist",
    icon: "/icons/ophthalmologist.PNG",
    description: "Eye care & vision health",
    color: "#3b82f6"
  },
  {
    id: 10,
    name: "Psychiatrist",
    icon: "/icons/psychiatrist.PNG",
    description: "Mental health & psychiatric care",
    color: "#8b5cf6"
  },
  {
    id: 11,
    name: "Endocrinologist",
    icon: "/icons/endocrinologist.PNG",
    description: "Hormone & metabolic disorders",
    color: "#f97316"
  },
  {
    id: 12,
    name: "Urologist",
    icon: "/icons/urology.PNG",
    description: "Urinary system & male reproductive health",
    color: "#6366f1"
  }
];

export default function Specialists() {
  const navigate = useNavigate();

  const handleSpecialtyClick = (specialty) => {
    // Navigate to the specialty-specific route
    navigate(`/specialists/${specialty.name.toLowerCase()}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f4ff] flex flex-col">
      {/* Header with search */}
      <PageHeader />

      {/* Main Content */}
      <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Medical Specialists
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Find doctors by their medical specialty. Browse through our comprehensive list of healthcare professionals.
            </p>
          </div>

          {/* Specialties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {medicalSpecialties.map((specialty) => (
              <div
                key={specialty.id}
                onClick={() => handleSpecialtyClick(specialty)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                role="button"
                tabIndex={0}
                aria-label={`Find ${specialty.name} doctors`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSpecialtyClick(specialty);
                  }
                }}
              >
                {/* Specialty Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-sm border-2"
                    style={{ borderColor: `${specialty.color}30` }}
                  >
                    <img
                      src={specialty.icon}
                      alt={specialty.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/icons/doctor.png";
                      }}
                    />
                  </div>
                </div>

                {/* Specialty Content */}
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                    {specialty.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                    {specialty.description}
                  </p>
                </div>

                {/* Hover Effect Indicator */}
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center text-xs sm:text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                    Find Doctors
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Can't Find Your Specialty?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              We're constantly adding new medical specialties. Contact us if you need help finding a specific type of doctor.
            </p>
            <div className="space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                onClick={() => navigate('/doctors')}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse All Doctors
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
