import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/search/SearchBar";
import MedicineCarousel from "../components/content/MedicineCarousel";
import CategoryGrid from "../components/home/CategoryGrid";

// SVG grid background (light grey grid) with 20px spacing
const gridSvg = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M20 0H0v20" fill="none"/><path d="M0.5 0H20M0 0.5V20" stroke="#E5E7EB" stroke-width="1"/></svg>'
);

export default function Page3() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Purple header on top */}
        <div className="w-full bg-[#7551b3] px-4 pt-4 pb-0 relative z-10 min-h-[310px]">
          <SearchBar />

          {/* Top carousel card - directly under search, same container */}
          <MedicineCarousel />
        </div>

        {/* Full-height grid section, flush to edges, 12px below carousel, overlaps header */}
        <div
          className="-mt-3 rounded-3xl min-h-screen relative z-20 shadow-sm w-full overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,${gridSvg}")`,
            backgroundSize: "20px 20px",
            backgroundRepeat: "repeat",
            backgroundColor: "#ffffff"
          }}
        >
          {/* Category Cards with proper spacing */}
          <div className="px-4 py-6">
            <CategoryGrid />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Background color for desktop */}
        <div className="w-full min-h-screen bg-[#F3ebff]">
          {/* Left Section: Container for two purple divs */}
          <div className="absolute left-0 top-0 w-1/2 h-full p-8 mt-[60px]">
            <div className="flex flex-col gap-6 h-full">
              {/* First Purple Div with Carousel */}
              <div className="bg-[#7551b3] rounded-2xl p-6 max-w-[500px] max-h-[250px] flex justify-center items-center">
                
                  <MedicineCarousel />
                 
              </div>
              
              {/* Second Purple Div with Carousel */}
              <div className="bg-[#7551b3] rounded-2xl p-6 max-w-[500px] max-h-[250px] flex justify-center items-center">
                
                  <MedicineCarousel />
                 
              </div>
            </div>
          </div>

          {/* Right Section: Grid background with 4 category cards - Reduced size and rounded */}
          <div className="absolute right-0 top-0 w-1/2 h-full flex flex-1 p-8 mt-[60px]">
            <div
              className="w-[600px] h-[500px] rounded-2xl shadow-lg overflow-hidden flex justify-center items-center"
              style={{
                backgroundImage: `url("data:image/svg+xml,${gridSvg}")`,
                backgroundSize: "20px 20px",
                backgroundRepeat: "repeat",
                backgroundColor: "#ffffff"
              }}
            >
              {/* Category Cards with gap-8 spacing */}
              <div className="p-8">
                <CategoryGrid />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
