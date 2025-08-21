import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/search/SearchBar";
import MedicineCarousel from "../components/content/MedicineCarousel";
import CategoryGrid from "../components/home/CategoryGrid";

// SVG grid background (light grey grid) with 20px spacing
const gridSvg = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M20 0H0v20" fill="none"/><path d="M0 0.5H20M0.5 0V20" stroke="#E5E7EB" stroke-width="1"/></svg>'
);

export default function Page3() {
  return (
    <div className="relative w-full min-h-screen bg-[#f4f4ff]">
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
        {/* Category Cards */}
        <CategoryGrid />
      </div>
    </div>
  );
}
