import React from 'react';
import { useNavigate } from 'react-router-dom';
import QueryItem from './QueryItem';

const queries = [
  {
    id: 1,
    label: "Allopathic",
    image: "/icons/allopathic.png",
    path: "/sub-departments?type=allopathic"
  },
  {
    id: 2,
    label: "Ayurveda",
    image: "/icons/ayurveda.png",
    path: "/sub-departments?type=ayurveda"
  },
  {
    id: 3,
    label: "Dentist",
    image: "/icons/dentist.png",
    path: "/sub-departments?type=dentist"
  },
  {
    id: 4,
    label: "Homeopathy",
    image: "/icons/homeopathic.png",
    path: "/sub-departments?type=homeopathy"
  }
];

export default function QueryGrid() {
  const navigate = useNavigate();

  const handleQueryClick = (query) => {
    navigate(query.path);
  };

  return (
    <section className="w-full max-w-full">
      {/* Section Header */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Query
          </h2>
          <button
            onClick={() => navigate('/specialists')}
            className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors"
          >
            All
          </button>
        </div>
      </div>

      {/* Query Items Grid */}
      <div className="px-4 w-full max-w-full">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
          {queries.map((query) => (
            <div key={query.id} className="flex justify-center">
              <QueryItem
                image={query.image}
                label={query.label}
                onClick={() => handleQueryClick(query)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar - using CSS classes in index.css */}
    </section>
  );
}
