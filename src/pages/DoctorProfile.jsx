import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../stores/authSlice";
import ReviewTab from "../components/ReviewTab";
import ContactTab from "../components/ContactTab";
import SeoDoctorProfile from "../components/seo/SeoDoctorProfile";
import DoctorProfileFAQ from "../components/FAQ/DoctorProfileFAQ";

// Image Modal Component
const ImageModal = ({ isOpen, onClose, images, currentIndex, setCurrentIndex }) => {
  const currentImage = images[currentIndex];

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length, setCurrentIndex]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length, setCurrentIndex]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  }, [onClose, nextImage, prevImage]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-60"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-60"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="max-w-4xl max-h-full relative">
        <img
          src={currentImage?.url || currentImage}
          alt={currentImage?.alt || "Doctor image"}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/icons/doctor.png";
          }}
        />

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

const DoctorProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Handle both old format (/location/doctor/doctorSlug) and new format (/doctors/city/specialty/doctorName)
  const params = useParams();
  const { doctorId, location, doctorSlug, city, specialty, doctorName } = params;

  // Determine which route format is being used
  const isNewFormat = city && specialty && doctorName;
  const actualLocation = location || city;
  const actualDoctorSlug = doctorSlug || doctorName;

  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("About");
  const [doctor, setDoctor] = useState(null);
  const [actualDoctorId, setActualDoctorId] = useState(doctorId || actualDoctorSlug);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Image modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryExpanded, setGalleryExpanded] = useState(false);

  // Helper functions for image modal
  const openImageModal = (images, startIndex = 0) => {
    setModalImages(images);
    setCurrentImageIndex(startIndex);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImages([]);
    setCurrentImageIndex(0);
  };

  const handleSlotsUpdated = useCallback(async () => {
    // Reload doctor data after slots are updated
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      if (doctorId || actualDoctorSlug) {
        let res;
        if (actualDoctorSlug && !doctorId) {
          res = await fetch(`${API_BASE_URL}/api/doctors/slug/${actualDoctorSlug}`);
        } else {
          res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId || actualDoctorSlug}`);
        }

        if (!res.ok) throw new Error("Failed to reload doctor data");
        const response = await res.json();
        const doctorData = response.success ? response.data : response;
        setDoctor(doctorData);
      } else if (user && user.role === "doctor") {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/doctors/me/doctor-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to reload doctor profile");
        const response = await res.json();
        const doctorData = response.success ? response.data : response;
        setDoctor(doctorData);
      }
    } catch (error) {
      console.error('Error reloading doctor data:', error);
      // Fallback to page reload if API call fails
      window.location.reload();
    }
  }, [doctorId, actualDoctorSlug, user]);

  const getCanonicalUrl = useCallback((doctor) => {
    const doctorLocation = doctor.city || "india";
    const specialty = doctor.specialty || doctor.keySpecialization?.[0] || 'general-physician';
    const slug = `${doctor.user?.name
      ?.toLowerCase()
      .replace(/\s+/g, "-")}-${doctor.specialty
      ?.toLowerCase()
      .replace(/\s+/g, "-")}`;

    // Check if we're currently on a specialists URL - if so, maintain that format
    if (window.location.pathname.startsWith('/specialists/')) {
      const pathSegments = window.location.pathname.split('/').filter(segment => segment);
      if (pathSegments.length >= 3 && pathSegments[0] === 'specialists') {
        const currentSpecialty = pathSegments[1];
        const currentCity = pathSegments[2];
        return `https://www.doctar.in/specialists/${currentSpecialty}/${currentCity}/${slug}`;
      }
    }

    // Use new format for canonical URL if current route is new format
    if (isNewFormat) {
      return `https://www.doctar.in/doctors/${doctorLocation
        .toLowerCase()
        .replace(/\s+/g, "-")}/${specialty
        .toLowerCase()
        .replace(/\s+/g, "-")}/${slug}`;
    } else {
      // Keep legacy format for backward compatibility
      return `https://www.doctar.in/${doctorLocation
        .toLowerCase()
        .replace(/\s+/g, "-")}/doctor/${slug}`;
    }
  }, [isNewFormat]);

  useEffect(() => {
    async function loadDoctor() {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

        if (doctorId || actualDoctorSlug) {
          console.log("Loading doctor profile:", doctorId || actualDoctorSlug, "format:", isNewFormat ? "new (/doctors/city/specialty/doctor)" : "legacy (/location/doctor/slug)");

          let res;
          if (actualDoctorSlug && !doctorId) {
            res = await fetch(`${API_BASE_URL}/api/doctors/slug/${actualDoctorSlug}`);
          } else {
            res = await fetch(
              `${API_BASE_URL}/api/doctors/${doctorId || actualDoctorSlug}`
            );
          }

          if (!res.ok) throw new Error("Doctor not found");
          const response = await res.json();
          const doctorData = response.success ? response.data : response;
          setDoctor(doctorData);
          setActualDoctorId(doctorData._id || doctorId || actualDoctorSlug);

          const canonicalUrl = getCanonicalUrl(doctorData);
          if (
            canonicalUrl &&
            window.location.pathname !==
              canonicalUrl.replace("https://www.doctar.in", "")
          ) {
            window.history.replaceState(
              {},
              "",
              canonicalUrl.replace("https://www.doctar.in", "")
            );
          }

          if (actualLocation && doctorData.city !== actualLocation) {
            console.log(
              "Location mismatch - URL:",
              actualLocation,
              "Doctor city:",
              doctorData.city
            );
          }
        } else if (user && user.role === "doctor") {
          console.log("Loading own doctor profile for user:", user.id);

          const token = localStorage.getItem("token");
          const res = await fetch(
            `${API_BASE_URL}/api/doctors/me/doctor-profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!res.ok) {
            if (res.status === 404) {
              setError("Doctor profile not found. Please create your profile.");
            } else {
              throw new Error("Failed to load doctor profile");
            }
          } else {
            const response = await res.json();
            const doctorData = response.success ? response.data : response;
            setDoctor(doctorData);
            setActualDoctorId(doctorData._id);
            console.log("Own doctor profile loaded:", doctorData);
          }
        } else {
          setError("No doctor profile to display");
        }
      } catch (e) {
        console.error("Error loading doctor:", e);
        setError(e.message || "Failed to load doctor profile");
      } finally {
        setLoading(false);
      }
    }

    loadDoctor();
  }, [user, doctorId, actualDoctorSlug, actualLocation, doctorSlug, isNewFormat, location, getCanonicalUrl]);

  const generateDiseaseKeywords = (doctor) => {
    const specialtyKeywords = {
      Cardiologist:
        "heart disease, cardiac problems, hypertension, chest pain, heart attack prevention",
      Dermatologist:
        "skin problems, acne, eczema, hair fall, skin allergies, dermatitis",
      Orthopedic:
        "bone fractures, joint pain, arthritis, back pain, sports injuries, osteoporosis",
      Pediatrician:
        "child health, vaccination, fever in children, growth issues, pediatric care",
      Neurologist:
        "headache, migraine, seizures, nerve problems, stroke, neurological disorders",
      "General Physician":
        "fever, cold, cough, diabetes, blood pressure, general health checkup",
      Gynecologist:
        "women health, pregnancy care, menstrual problems, gynecological issues",
      Psychiatrist:
        "mental health, depression, anxiety, stress management, psychiatric care",
      "ENT Specialist":
        "ear problems, nose issues, throat infections, hearing loss, sinusitis",
      Ophthalmologist:
        "eye care, vision problems, cataract, glaucoma, eye infections",
    };

    return (
      specialtyKeywords[doctor?.specialty] ||
      `${doctor?.specialty?.toLowerCase()} treatment, consultation, medical care`
    );
  };

  console.log("Doctor Profile State:", {
    doctorId,
    actualDoctorId,
    user: user?.id,
    userRole: user?.role,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading doctor profile...</p>
      </div>
    );
  }

  return (
    <>
      {/* Dynamic SEO Component */}
      {doctor && (
        <SeoDoctorProfile
          fullName={doctor.user?.name || "Doctor"}
          specialization={doctor.specialty || "General Physician"}
          location={doctor.city || "India"}
          yearsExperience={doctor.yearsOfExperience || 5}
          diseaseKeywords={generateDiseaseKeywords(doctor)}
          doctorImage={doctor.profilePicture?.filename || ""}
          doctorSlug={
            doctor.slug ||
            `${doctor.user?.name
              ?.toLowerCase()
              .replace(/\s+/g, "-")}-${doctor.specialty
              ?.toLowerCase()
              .replace(/\s+/g, "-")}`
          }
          ratingValue={(doctor.averageRating || 4.5).toString()}
          ratingCount={(doctor.totalReviews || 50).toString()}
          consultationFee={doctor.consultationFee}
          clinicName={doctor.clinicName}
          languages={doctor.languages || ["English", "Hindi"]}
          canonicalUrl={getCanonicalUrl(doctor)}
        />
      )}

      {/* Mobile Layout (default - stacked vertically) */}
      <div className="min-h-screen bg-white md:hidden">
        {/* Purple Header Section */}
        <div className="bg-[#7551b3] relative h-96">
          {/* Top Navigation */}
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-xl font-bold"
              title="Back"
            >
              ←
            </button>
            <h1 className="text-white text-lg font-semibold">Doctor Profile</h1>
            {user && user.role === "doctor" && doctor && user.id === doctor.user?._id ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/doctor/edit")}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-sm font-semibold"
                  title="Edit Profile"
                >
                  ✎
                </button>
              </div>
            ) : user && user.role === "doctor" && doctor && user.id !== doctor.user?._id ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Dr. ${doctor?.user?.name}`,
                        text: `Check out Dr. ${doctor?.user?.name} - ${doctor?.specialty}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Profile link copied to clipboard!');
                    }
                  }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-sm font-semibold"
                  title="Share Profile"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            ) : (
              <span className="w-10 h-10" />
            )}
          </div>

          {/* Profile Information */}
          <div className="flex flex-col items-center pt-8">
            <div className="w-[182px] h-[182px] rounded-3xl bg-white overflow-hidden mb-6 shadow-[0_13.2px_13.2px_0_rgba(0,0,0,0.25)] cursor-pointer hover:shadow-[0_20px_20px_0_rgba(0,0,0,0.3)] transition-all duration-300"
                 onClick={() => openImageModal([doctor?.user?.image?.url || "/icons/doctor.png"], 0)}>
              <img
                src={doctor?.user?.image?.url || "/icons/doctor.png"}
                alt="Doctor Profile"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/icons/doctor.png";
                }}
              />
            </div>
            <h2 className="text-white text-xl font-semibold mb-1">
              {doctor?.user?.name || "Doctor"}
            </h2>
            <p className="text-white text-lg">
              {doctor?.specialty || "General"}
            </p>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="bg-white">
          <div className="flex justify-center pt-5 pb-6">
            <div className="bg-gray-100 rounded-full p-1 flex relative">
              {["About", "Review", "Contact"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative z-10 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <div
                className={`absolute top-1 bottom-1 rounded-full bg-[#7551b3] transition-all duration-300 ease-in-out ${
                  activeTab === "About"
                    ? "left-1 w-24"
                    : activeTab === "Review"
                    ? "left-1 w-24 translate-x-24"
                    : "left-1 w-28 translate-x-48"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Mobile Tab Content */}
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
              {error}
              {error.includes("create your profile") && (
                <button
                  onClick={() => navigate("/doctor/create")}
                  className="ml-2 underline hover:no-underline"
                >
                  Create Profile
                </button>
              )}
            </div>
          )}

          {activeTab === "About" && !loading && doctor && (
            <div className="space-y-6">
              {/* Hospital Images Gallery */}
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-2">
                  {doctor.gallery && doctor.gallery.length > 0
                    ? doctor.gallery.slice(0, 3).map((image, index) => (
                        <div
                          key={index}
                          className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0 cursor-pointer hover:shadow-lg transition-all duration-300"
                          onClick={() => openImageModal(doctor.gallery, index)}
                        >
                          <img
                            src={image.url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/banner.png";
                            }}
                          />
                        </div>
                      ))
                    : Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0"
                        >
                          <img
                            src="/banner.png"
                            alt={`Default ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                </div>
              </div>

              {/* About Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-600">
                  {doctor?.about || "No description provided yet."}
                </p>
              </div>

              {/* Key Specialization */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Key Specialization
                </h3>
                <div className="">
                  <div className="space-y-2">
                    {doctor?.keySpecialization &&
                    doctor.keySpecialization.length > 0 ? (
                      doctor.keySpecialization.map((spec, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="text-gray-600 text-base">
                            {spec}
                          </span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="text-gray-600 text-base">
                            {doctor?.specialty || "General"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="text-gray-600 text-base">
                            {doctor?.clinicName
                              ? `Clinic: ${doctor.clinicName}`
                              : "—"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Education</h3>
                <div className="space-y-2 text-gray-600">
                  {doctor?.education && doctor.education.length ? (
                    doctor.education.map((ed, i) => (
                      <div key={i}>
                        <p className="font-medium">{ed}</p>
                      </div>
                    ))
                  ) : (
                    <p>No education details provided.</p>
                  )}
                </div>
              </div>

              {/* Awards */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Awards</h3>
                {doctor?.awards && doctor.awards.length > 0 ? (
                  doctor.awards.map((award, index) => (
                    <div
                      key={index}
                      className="bg-[#f6f6f6] shadow-[0_13.2px_13.2px_0_rgba(0,0,0,0.25)] rounded-lg p-4 mb-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-[#f6f6f6] rounded-lg flex-shrink-0">
                          <img
                            src={award.image?.url || "/banner.png"}
                            alt="Award Certificate"
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/banner.png";
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">
                            {award.title}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {award.year} - {award.institute}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#f6f6f6] shadow-[0_13.2px_13.2px_0_rgba(0,0,0,0.25)] rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-[#f6f6f6] rounded-lg flex-shrink-0">
                        <img
                          src="/banner.png"
                          alt="Award Certificate"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="text-gray-600">No awards added yet.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Languages</h3>
                <p className="text-gray-600">
                  {doctor?.languages && doctor.languages.length
                    ? doctor.languages.join(", ")
                    : "—"}
                </p>
              </div>
            </div>
          )}

          {activeTab === "Review" && <ReviewTab doctorId={actualDoctorId} />}

          {activeTab === "Contact" && <ContactTab doctor={doctor} onSlotsUpdated={handleSlotsUpdated} />}
        </div>

        {user && user.role === "doctor" && doctor && user.id === doctor.user?._id && (
          <div className="p-4">
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
              className="w-full bg-red-500 text-white py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Desktop Layout (md and up) */}
      <div className="hidden md:block bg-purple-50 min-h-screen ">
        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-[#7551B2] rounded-2xl  p-6 sticky top-25">
            {user && user.role === "doctor" && doctor && user.id === doctor.user?._id ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/doctor/edit")}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-sm font-semibold"
                  title="Edit Profile"
                >
                  ✎
                </button>
              </div>
            ) : user && user.role === "doctor" && doctor && user.id !== doctor.user?._id ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Dr. ${doctor?.user?.name}`,
                        text: `Check out Dr. ${doctor?.user?.name} - ${doctor?.specialty}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Profile link copied to clipboard!');
                    }
                  }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-sm font-semibold"
                  title="Share Profile"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            ) : (
              <span className="w-10 h-10" />
            )}
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto rounded-2xl bg-white overflow-hidden mb-4 shadow-lg">
                  <img
                    src={doctor?.user?.image?.url || "/icons/doctor.png"}
                    alt="Doctor Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/icons/doctor.png";
                    }}
                  />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Dr. {doctor?.user?.name || "Doctor"}
                </h2>
                <p className=" text-white font-medium text-md">
                  {doctor?.specialty || "General"}
                </p>
              </div>

              {/* Brief About */}
              {doctor?.about && (
                <div className=" ">
                  <p className="text-xs text-white leading-relaxed">
                    {doctor.about.length > 150
                      ? doctor.about.slice(0, 150) + "..."
                      : doctor.about}
                  </p>
                </div>
              )}
              {/*Languages*/}
              <div className=" ">
                <h3 className="text-md font-semibold my-2 text-white">
                  Languages
                </h3>
                <p className="text-xs text-white leading-relaxed">
                  {doctor?.languages && doctor.languages.length > 0
                    ? doctor.languages.join(", ")
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-2xl">
            {/* Tab Navigation */}
            <div className=" p-4">
              <div className="flex justify-left">
                <div className="bg-gray-100 rounded-full p-1 flex relative">
                  {["About", "Review", "Contact"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative z-5 px-8 py-2 rounded-full font-small transition-all duration-300 ${
                        activeTab === tab
                          ? "text-white"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  <div
                    className={`absolute top-1 bottom-1 rounded-full bg-[#7551b3] transition-all duration-300 ease-in-out ${
                      activeTab === "About"
                        ? "left-1 w-28"
                        : activeTab === "Review"
                        ? "left-1 w-27 translate-x-28"
                        : "left-1 w-28 translate-x-56"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 min-h-96 ">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
                  {error}
                  {error.includes("create your profile") && (
                    <button
                      onClick={() => navigate("/doctor/create")}
                      className="ml-2 underline hover:no-underline font-medium"
                    >
                      Create Profile
                    </button>
                  )}
                </div>
              )}

              {activeTab === "About" && !loading && doctor && (
                <div className="space-y-8">
                  {/* Gallery */}
                  <div>
                    {galleryExpanded && (
                      <div className="mb-4 flex justify-end">
                        <button
                          onClick={() => setGalleryExpanded(false)}
                          className="text-sm text-gray-600 hover:text-gray-800 underline"
                        >
                          Show Less
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      {doctor.gallery && doctor.gallery.length > 0
                        ? (galleryExpanded ? doctor.gallery : doctor.gallery.slice(0, 3)).map((image, index) => {
                            const totalImages = doctor.gallery.length;
                            const hasMoreImages = totalImages > 3 && !galleryExpanded;
                            const isThirdImage = index === 2 && hasMoreImages;
                            const remainingImages = totalImages - 3;

                            return (
                              <div
                                key={index}
                                className="aspect-video bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 relative"
                                onClick={() => openImageModal(doctor.gallery, index)}
                              >
                                <img
                                  src={image.url}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/banner.png";
                                  }}
                                />

                                {/* Overlay for 3rd image when there are more images */}
                                {isThirdImage && (
                                  <div
                                    className="absolute inset-0 flex items-center justify-center"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setGalleryExpanded(true);
                                    }}
                                  >
                                    <div className="text-white text-center px-4 py-2 rounded-lg">
                                      <div className="text-2xl font-bold drop-shadow-lg">+{remainingImages}</div>
                                      <div className="text-sm font-medium drop-shadow-md">more</div>                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        : Array.from({ length: 3 }).map((_, index) => (
                            <div
                              key={index}
                              className="aspect-video bg-gray-100 rounded-xl overflow-hidden"
                            >
                              <img
                                src="/banner.png"
                                alt={`Default ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {/* left side box */}
                    <div className="w-1/2 ">
                      {/* About Section */}
                      <div>
                        <h3 className="text[16px] font-semibold mb-2 text-gray-800">
                          About
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-gray-700 text-[14px] leading-relaxed">
                            {doctor?.about || "No description provided yet."}
                          </p>
                        </div>
                      </div>
                      {/* Education */}
                      <div>
                        <h3 className="text[16px] font-semibold  mb-2 text-gray-800">
                          Education
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="space-y-3">
                            {doctor?.education && doctor.education.length ? (
                              doctor.education.map((ed, i) => (
                                <div
                                  key={i}
                                  className="flex items-start space-x-3"
                                >
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-gray-700 text-[14px] font-medium">
                                    {ed}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-600">
                                No education details provided.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* right side box */}
                    <div className="w-1/2">
                      {/* Key Specializations */}
                      <div>
                        <h3 className="text[16px] font-semibold mb-2 text-gray-800">
                          Key Specializations
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {doctor?.keySpecialization &&
                            doctor.keySpecialization.length > 0 ? (
                              doctor.keySpecialization.map((spec, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-3"
                                >
                                  <div className="w-2 h-2 bg-[#7551b3] rounded-full flex-shrink-0"></div>
                                  <span className="text-gray-700 text-[14px]">
                                    {spec}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <>
                                <div className="flex items-center space-x-3">
                                  <div className="w-2 h-2 bg-[#7551b3] rounded-full flex-shrink-0"></div>
                                  <span className="text-gray-700 text-[14px]">
                                    {doctor?.specialty || "General"}
                                  </span>
                                </div>
                                {doctor?.clinicName && (
                                  <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-[#7551b3] rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-700 text-[14px]">
                                      Clinic: {doctor.clinicName}
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Awards */}
                      <div>
                        <h3 className="text[16px] font-semibold mb-2 text-gray-800">
                          Awards & Recognition
                        </h3>
                        <div className="space-y-4 p-4">
                          {doctor?.awards && doctor.awards.length > 0 ? (
                            doctor.awards.map((award, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                              >
                                <div className="flex items-start space-x-4">
                                  <div className="w-20 h-20 bg-white rounded-xl flex-shrink-0 border shadow-sm">
                                    <img
                                      src={award.image?.url || "/banner.png"}
                                      alt="Award Certificate"
                                      className="w-full h-full object-cover rounded-xl"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/banner.png";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">
                                      {award.title}
                                    </h4>
                                    <p className="text-gray-600 text-[14px]">
                                      {award.year} - {award.institute}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                              <div className="flex items-start space-x-4">
                                <div className="w-20 h-20 bg-white rounded-xl flex-shrink-0 border shadow-sm">
                                  <img
                                    src="/banner.png"
                                    alt="Award Certificate"
                                    className="w-full h-full object-cover rounded-xl"
                                  />
                                </div>
                                <div>
                                  <p className="text-gray-600 text-[14px]">
                                    No awards added yet.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              

              {activeTab === "Review" && (
                <ReviewTab doctorId={actualDoctorId} />
              )}

              {activeTab === "Contact" && <ContactTab doctor={doctor} onSlotsUpdated={handleSlotsUpdated} />}
            </div>

            {user && user.role === "doctor" && doctor && user.id === doctor.user?._id && (
              <div className="mt-6 p-4">
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/login");
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3  rounded-xl font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeImageModal}
        images={modalImages}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      {/* FAQ Section - Full Width for Both Mobile and Desktop */}
      {doctor && (
        <div className="bg-[#7551B2] py-8">
          <div className="max-w-4xl mx-auto px-4">
            <DoctorProfileFAQ
              doctor={doctor}
              className="bg-transparent border-none"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorProfile;
