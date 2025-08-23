import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="bg-white">
      <div className="flex justify-center pt-5 pb-6">
        <div className="bg-gray-100 rounded-full p-1 flex relative">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
          {/* Animated Pill Background */}
          <div 
            className={`absolute top-1 bottom-1 rounded-full bg-[#7551b3] transition-all duration-300 ease-in-out ${
              activeTab === 'About' ? 'left-1 w-24' :
              activeTab === 'Review' ? 'left-1 w-24 translate-x-24' :
              'left-1 w-28 translate-x-48'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
