import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/ui/SearchBar";

// Dummy data for the carousel (5 slides)
const medicineCards = [
  {
    id: 1,
    name: "Ibuprofen Lysine",
    prescribedBy: "Dr. Mathew Roberts",
    frequency: "Everyday",
    image: "/icons/medicine-bottle.png"
  },
  {
    id: 2,
    name: "Paracetamol",
    prescribedBy: "Dr. Anita Verma",
    frequency: "Twice a day",
    image: "/icons/medicine-bottle.png"
  },
  {
    id: 3,
    name: "Amoxicillin",
    prescribedBy: "Dr. Rahul Singh",
    frequency: "Every 8 hours",
    image: "/icons/medicine-bottle.png"
  },
  {
    id: 4,
    name: "Cetirizine",
    prescribedBy: "Dr. Sana Mir",
    frequency: "At night",
    image: "/icons/medicine-bottle.png"
  },
  {
    id: 5,
    name: "Azithromycin",
    prescribedBy: "Dr. Mahesh Kumar",
    frequency: "Every Morning",
    image: "/icons/medicine-bottle.png"
  }
];

// SVG grid background (light grey grid) with 20px spacing
const gridSvg = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M20 0H0v20" fill="none"/><path d="M0 0.5H20M0.5 0V20" stroke="#E5E7EB" stroke-width="1"/></svg>'
);

// Category data for the grid cards
const categories = [
  {
    id: 1,
    name: "Allopathic",
    icon: "/icons/allopathic.png",
    color: "#744db8"
  },
  {
    id: 2,
    name: "Ayurveda",
    icon: "/icons/ayurveda.png",
    color: "#744db8"
  },
  {
    id: 3,
    name: "Homeopathic",
    icon: "/icons/homeopathic.png",
    color: "#744db8"
  },
  {
    id: 4,
    name: "Dentist",
    icon: "/icons/dentist.png",
    color: "#744db8"
  }
];

export default function Page3() {
  const slides = useMemo(
    () => medicineCards.filter((card) => card.name && card.prescribedBy),
    []
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full min-h-screen bg-[#f4f4ff]">
      {/* Purple header on top */}
      <div className="w-full bg-[#7551b3] px-4 pt-4 pb-6 relative z-10 min-h-[310px]">
        <SearchBar />

        {/* Top carousel card - directly under search, same container */}
        <div className="mt-4 mb-3 relative w-full rounded-2xl bg-[#8b6bcf] text-white shadow-md overflow-hidden">
          {/* Slide content */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-opacity duration-500 ease-in-out ${
                index === activeIndex ? "opacity-100" : "opacity-0 absolute inset-0"
              }`}
            >
              <div className="flex items-center gap-3 p-4 min-h-[170px]">
                <div className="w-[140px] h-[170px] -ml-3 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img
                    src={slide.image}
                    alt="medicine bottle"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 pr-[120px] flex flex-col justify-center">
                  <div className="text-xs text-white/80">Name</div>
                  <div className="text-[13px] font-semibold">{slide.name}</div>
                  <div className="mt-3 text-xs text-white/80">Prescribed by</div>
                  <div className="text-[13px] font-medium">{slide.prescribedBy}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Time with wall clock icon - right middle */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <img src="/icons/wall-clock 1.png" alt="time" className="w-5 h-5" />
            <span className="text-sm">{slides[activeIndex]?.frequency}</span>
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={`dot-${i}`}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === activeIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
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
        <div className="grid grid-cols-2 gap-10 px-4 pt-4 mt-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#f2f1f9] border border-[#eee7fb]"
              style={{ boxShadow: '0px 4px 4px 0px #7551b3' }}
            >
              <div 
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
                style={{ boxShadow: '0px 2px 4px 0px #7551b3' }}
              >
                <img src={category.icon} alt={category.name} className="w-8 h-8 object-contain" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
