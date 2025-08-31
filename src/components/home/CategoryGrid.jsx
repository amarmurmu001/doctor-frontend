import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaLeaf, FaPills, FaTooth } from 'react-icons/fa';

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
    <section className="w-full max-w-full">
      {/* Fixed Container to Prevent Horizontal Scroll */}
      <div className="px-4 w-full max-w-full">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl mx-auto">
          {categories.map((category) => (
            <article
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group relative bg-[#f1f2f9] rounded-2xl border border-gray-200 p-4 sm:p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 flex flex-col justify-center items-center w-full min-h-[160px] sm:min-h-[180px]"
              style={{
                boxShadow: '0 4px 4px 0 #7551b3'
              }}
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
              <div className="flex justify-center mb-3 sm:mb-4">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 border-2"
                  style={{ borderColor: `${category.color}30` }}
                >
                  <img
                    src={category.icon}
                    alt=""
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div style="color: ${category.color}; font-size: 24px;">🏥</div>`;
                    }}
                  />
                </div>
              </div>

              {/* Category Content */}
              <div className="text-center flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg leading-tight transition-colors duration-300 group-hover:text-purple-600">
                  {category.name}
                </h3>
                {/* <p className="text-xs text-gray-500 leading-tight mt-1 hidden sm:block group-hover:text-gray-600 transition-colors duration-300 px-1">
                  {category.description}
                </p> */}
              </div>


            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
