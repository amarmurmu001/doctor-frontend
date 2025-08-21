import { useEffect, useMemo, useState } from "react";

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

export default function MedicineCarousel() {
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
  );
}


