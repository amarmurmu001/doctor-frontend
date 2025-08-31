import React from "react";
import SearchBar from "../components/search/SearchBar";
import MedicineCarousel from "../components/content/MedicineCarousel";
import CategoryGrid from "../components/home/CategoryGrid";
import PageSeo from "../components/seo/PageSeo";

// SVG grid background (light grey grid) with 20px spacing
const gridSvg = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M20 0H0v20" fill="none"/><path d="M0.5 0H20M0 0.5V20" stroke="#E5E7EB" stroke-width="1"/></svg>'
);

export default function Departments() {
  return (
    <>
      <PageSeo
        title="Medical Specialties | Find Doctors by Category | Doctar"
        description="Browse doctors by medical specialties. Find cardiologists, dermatologists, pediatricians, and other specialists near you. Book appointments with verified doctors."
        keywords="medical specialties, doctor categories, cardiologist, dermatologist, pediatrician, orthopedic doctor, neurologist, gynecologist"
        canonicalUrl="https://www.doctar.in/categories"
      />

      <div className="w-full min-h-screen bg-[#f4f4ff] lg:flex lg:flex-col">
        {/* Mobile Layout */}
        <div className=" flex md:hidden  flex-col min-h-screen">
          {/* Header Section */}
          <div className="bg-[#7551b3] px-4 py-6 pb-8 flex-shrink-0">
            <SearchBar />
          </div>

          {/* Carousel Section */}
          <div className="bg-[#7551b3] px-4 pb-6 flex-shrink-0">
            <MedicineCarousel />
          </div>

          {/* Grid Section - Fill remaining space */}
          <div
            className="bg-white rounded-t-3xl px-4 py-6 flex-1"
            style={{
              backgroundImage: `url("data:image/svg+xml,${gridSvg}")`,
              backgroundSize: "20px 20px",
              backgroundRepeat: "repeat"
            }}
          >
            <CategoryGrid />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex min-h-screen">
          {/* Left Section - Carousels */}
          <div className="w-1/2 bg-[#f4f4ff] p-8 flex flex-col justify-center items-center gap-8">
            {/* First Carousel */}
            <div className="bg-[#7551b3] rounded-2xl p-6 w-full max-w-lg">
              <MedicineCarousel />
            </div>

            {/* Second Carousel */}
            <div className="bg-[#7551b3] rounded-2xl p-6 w-full max-w-lg">
              <MedicineCarousel />
            </div>
          </div>

          {/* Right Section - Grid */}
          <div className="w-1/2 bg-[#f4f4ff] p-8 flex justify-center items-center">
            <div
              className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl h-full max-h-[600px] flex items-center justify-center"
              style={{
                backgroundImage: `url("data:image/svg+xml,${gridSvg}")`,
                backgroundSize: "20px 20px",
                backgroundRepeat: "repeat"
              }}
            >
              <CategoryGrid />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
