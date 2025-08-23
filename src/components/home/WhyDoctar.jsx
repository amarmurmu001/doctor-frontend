import React from "react";
function WhyDoctar() {
  const features = [
    {
      id: 1,
      content:
        "SIX offers a trusted, user-friendly platform tailored for used car dealers and individual sellers.",
    },
    {
      id: 2,
      content:
        "Connect Directly with Owners option to skip middlemen, negotiate freely, and buy what you want within budget at your best price!",
    },
    {
      id: 3,
      content:
        "Connect with Real Buyers and Sellers. Verified listings, genuine leads, and direct deals to ensure a faster & trusted experience.",
    },
  ];

  return (
    <div className="flex flex-col  items-center justify-center">
      <h2 className="text-center text-black md:p-4 font-bold py-2 text-xl">
        Why Doctar?
      </h2>
      <div className="flex bg-[#F2F2F2] justify-between rounded-3xl md:p-4 text-sm text-black p-2">
        {features.map((feature, index) => (
          <React.Fragment key={feature.id}>

          <div key={feature.id} className="relative p-1 rounded-md flex-1">
            <p className="text-black text-[11px] md:text-lg leading-tight font-poppins">
              {feature.content}
            </p>
          </div>
          {
            index < features.length - 1 && (
              <div className="left-0 mt-1 md:h-auto h-8 w-1 bg-purple-600 rounded mr-2"></div>
            )}
          
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default WhyDoctar;
