import React from 'react';
import CategoryGrid from "./CategoryGrid";

export default function QueryList() {
  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Health Categories</h2>
      </div>

      {/* Use the existing CategoryGrid component */}
      <CategoryGrid />
    </div>
  );
}


