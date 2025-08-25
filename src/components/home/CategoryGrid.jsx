import React from 'react';

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

export default function CategoryGrid() {
  return (
    <div className="w-full">
      {/* Responsive Grid: 2 columns for tablet, 3 for desktop */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="w-[180px] h-[140px] flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-[#f2f1f9] border border-[#eee7fb] cursor-pointer mx-auto"
            style={{ boxShadow: '0px 4px 4px 0px #7551b3' }}
          >
            <div 
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: '0px 2px 4px 0px #7551b3' }}
            >
              <img src={category.icon} alt={category.name} className="w-6 h-6 object-contain" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-gray-800">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


