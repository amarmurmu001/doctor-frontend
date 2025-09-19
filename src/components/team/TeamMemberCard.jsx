import React from 'react';

const TeamMemberCard = ({ member, onClick, isSelected = false }) => {
  return (
    <div 
      className={`aspect-square rounded-lg cursor-pointer transition-all duration-200 transform ${
        isSelected 
          ? 'scale-95 shadow-inner' 
          : 'hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
      } group`}
      onClick={onClick}
      style={{
        background: member.color,
        boxShadow: isSelected 
          ? 'inset 0 2px 4px rgba(0,0,0,0.2)' 
          : '0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        {/* Initials - Directly on the colored background */}
        <div className="text-white text-2xl font-bold drop-shadow-sm">
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            member.initials
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
