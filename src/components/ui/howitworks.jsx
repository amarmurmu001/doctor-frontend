import { useState } from "react";

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState("buy");

  const steps = [
    {
      id: 1,
      title: "Find your product",
      description:
        "Browse and find your perfect pick from our various categories like car, bikes, commercial vehicle and properties and get proper details about it.",
      icon: "/icons/search.png", // use the actual path to your icon
    },
    {
      id: 2,
      title: "Get direct contact",
      description:
        "We let you get the direct contact of the seller, owner or dealer and reach out to them, no middleman contact or long waiting queue.",
      icon: "/icons/phone.png", // use the actual path to your icon
    },
    {
      id: 3,
      title: "Complete transaction",
      description:
        "Negotiate directly with the owner, finalize the deal, and complete your transaction without any hidden fees or commission charges.",
      icon: "/icons/heart.png", // use the actual path to your icon
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">How it works ?</h2>

      {/* Combined Buy/Sell Tab in single pill */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-200 rounded-full p-1 shadow-lg flex">
          <button
            onClick={() => setActiveTab("buy")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === "buy"
                ? "bg-black text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            How to Buy
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === "sell"
                ? "bg-black text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            How to Sell
          </button>
        </div>
      </div>

      {/* Steps with horizontal scroll */}
      <div 
        className="flex overflow-x-auto  gap-4 pb-4"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* Internet Explorer 10+ */
        }}
      >
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-[#F2F1F9] p-4 pt-15 rounded-xl  flex-shrink-0 text-center relative w-[232px] h-[316px]"
          >
            {/* Step number in top right corner with white rounded background */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-bl-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {step.id}
              </span>
            </div>
            
            <div className="flex justify-start mb-6">
              <div className="bg-white rounded-full p-3">
                <img src={step.icon} alt={step.title} className="w-8 h-8" />
              </div>
            </div>
            <h3 className="font-semibold text-left text-lg text-gray-700 mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-left text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;
