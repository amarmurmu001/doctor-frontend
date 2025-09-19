import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TeamMemberDetail = ({ member, onBack, showBackButton = true }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Back Button - Only show if showBackButton is true */}
      {showBackButton && onBack && (
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-all duration-200 hover:bg-white px-4 py-2 rounded-lg hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">← Back to Team Grid</span>
          </button>
        </div>
      )}

      {/* Member Details */}
      <div className="p-8">
        {/* Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {member.name}
        </h1>
        
        {/* Title */}
        <p className="text-xl text-gray-700 font-medium mb-6">
          {member.title}
        </p>
        
        {/* Divider line */}
        <div className="w-16 h-0.5 bg-gray-300 mb-6"></div>
        
        {/* Description - Simple paragraph */}
        <p className="text-gray-700 leading-relaxed text-base">
          {member.description}
        </p>
      </div>
    </div>
  );
};

export default TeamMemberDetail;
