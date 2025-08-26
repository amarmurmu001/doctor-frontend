import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: "Allopathic",
    // description: "Modern medicine & general physicians",
    icon: "/icons/allopathic.png",
    color: "#744db8"
  },
  {
    id: 2,
    name: "Ayurveda",
    // description: "Traditional Indian medicine",
    icon: "/icons/ayurveda.png",
    color: "#22c55e"
  },
  {
    id: 3,
    name: "Homeopathic",
    // description: "Natural healing & remedies",
    icon: "/icons/homeopathic.png",
    color: "#f59e0b"
  },
  {
    id: 4,
    name: "Dentist",
    // description: "Oral health & dental care",
    icon: "/icons/dentist.png",
    color: "#06b6d4"
  }
];

export default function CategoryGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/search?q=${encodeURIComponent(category.name)}&type=specialty`);
  };

  return (
    <section className="w-full max-w-full ">
      {/* Section Header */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Medical Categories
        </h2>
        <p className="text-gray-600 text-sm">
          Find doctors by medical specialty and treatment type
        </p>
      </div>

      {/* Fixed Container to Prevent Horizontal Scroll */}
      <div className="px-4 w-full max-w-full">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full">
          {categories.map((category) => (
            <article
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group relative bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg hover:border-purple-300 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 aspect-square flex flex-col justify-center items-center w-full max-w-full box-border"
              role="button"
              tabIndex={0}
              aria-label={`Search for ${category.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick(category);
                }
              }}
            >
              {/* Category Icon */}
              <div className="flex justify-center mb-2 sm:mb-3">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 border border-gray-100"
                  style={{ borderColor: `${category.color}20` }}
                >
                  <img 
                    src={category.icon} 
                    alt="" 
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div style="color: ${category.color}">🏥</div>`;
                    }}
                  />
                </div>
              </div>

              {/* Category Content */}
              <div className="text-center flex-1 flex flex-col justify-center">
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base leading-tight group-hover:text-purple-700 transition-colors duration-300 px-1">
                  {category.name}
                </h3>
                {/* <p className="text-xs text-gray-500 leading-tight mt-1 hidden sm:block group-hover:text-gray-600 transition-colors duration-300 px-1">
                  {category.description}
                </p> */}
              </div>

              {/* Hover Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: category.color }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
