import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../stores/authSlice";
import SeoDoctorProfile from "../components/seo/SeoDoctorProfile";
import Nav from "../components/layout/Nav";

export default function SpecialtyDoctorProfile() {
  const { specialty, city, doctorName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format parameters
  const formattedCity = city ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() : '';
  const formattedSpecialty = specialty ? specialty.charAt(0).toUpperCase() + specialty.slice(1).toLowerCase() : '';
  const formattedDoctorName = doctorName ? doctorName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

  useEffect(() => {
    // If we have a doctor name, try to find the doctor by slug or redirect to the main doctor profile page
    if (formattedDoctorName) {
      // For now, redirect to the main doctor profile page
      // In a real implementation, you would fetch doctor by name, specialty, and city
      console.log('Specialty Doctor Profile:', {
        specialty: formattedSpecialty,
        city: formattedCity,
        doctorName: formattedDoctorName
      });

      // Redirect to the main doctor profile page
      // You can enhance this to fetch doctor by name and specialty
      navigate(`/Doctor-profile`, { replace: true });
    }
  }, [formattedDoctorName, formattedCity, formattedSpecialty, navigate]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#f4f4ff]">
        <Nav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#f4f4ff]">
        <Nav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-red-50 rounded-lg p-8 border border-red-200 max-w-md mx-4">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Doctor Not Found</h3>
            <p className="text-red-700 text-sm mb-4">{error}</p>
            <button
              onClick={() => navigate(`/specialists/${specialty}/${city}`)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Back to {formattedSpecialty} Doctors in {formattedCity}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If we don't have a doctor, show a placeholder or redirect
  return (
    <div className="w-full min-h-screen bg-[#f4f4ff]">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => navigate('/specialists')}
              className="hover:text-blue-600 transition-colors"
            >
              Specialists
            </button>
            <span>/</span>
            <button
              onClick={() => navigate(`/specialists/${specialty}`)}
              className="hover:text-blue-600 transition-colors"
            >
              {formattedSpecialty}
            </button>
            <span>/</span>
            <button
              onClick={() => navigate(`/specialists/${specialty}/${city}`)}
              className="hover:text-blue-600 transition-colors"
            >
              {formattedCity}
            </button>
            <span>/</span>
            <span className="font-medium text-gray-900">{formattedDoctorName}</span>
          </nav>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {formattedDoctorName}
          </h1>
          <p className="text-gray-600 mb-2">{formattedSpecialty} Specialist</p>
          <p className="text-gray-500 mb-6">Location: {formattedCity}</p>
          <p className="text-gray-500">
            This doctor profile is being loaded. Please check back soon or contact support if you need immediate assistance.
          </p>
          <div className="mt-6 space-x-4">
            <button
              onClick={() => navigate(`/specialists/${specialty}/${city}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Other {formattedSpecialty} Doctors in {formattedCity}
            </button>
            <button
              onClick={() => navigate('/specialists')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to All Specialists
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
