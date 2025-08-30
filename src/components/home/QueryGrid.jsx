import React from 'react';
import { useNavigate } from 'react-router-dom';
import QueryItem from './QueryItem';

const queries = [
  {
    id: 1,
    label: "Heart",
    image: "/icons/heart.png",
    path: "/sub-departments?specialty=cardiology"
  },
  {
    id: 2,
    label: "Lungs", 
    image: "/icons/lungs.png",
    path: "/sub-departments?specialty=pulmonology"
  },
  {
    id: 3,
    label: "Kidney",
    image: "/icons/kidney.png", 
    path: "/sub-departments?specialty=nephrology"
  },
  {
    id: 4,
    label: "Liver",
    image: "/icons/liver.png",
    path: "/sub-departments?specialty=hepatology"
  },
  {
    id: 5,
    label: "Brain",
    image: "/icons/doctor.png", // Using doctor icon as placeholder for brain
    path: "/sub-departments?specialty=neurology"
  },
  {
    id: 6,
    label: "Bones",
    image: "/icons/medicine-bottle.png", // Using medicine bottle as placeholder for bones
    path: "/sub-departments?specialty=orthopedics"
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
            onClick={() => navigate('/departments')}
            className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors"
          >
            All
          </button>
        </div>
      </div>

      {/* Query Items Grid */}
      <div className="px-4 w-full max-w-full">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {queries.map((query) => (
            <div key={query.id} className="flex-shrink-0">
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
