import DoctorsList from "../components/DoctorList";
import QueryList from "../components/QueryList";
import SearchBar from "../components/ui/SearchBar";
import WhyChooseUs from "../components/WhyChooseUs.jsx";
import { doctarFeatures } from "../data/featuredData.js";

export default function Home() {
  
  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Purple Header Background - Compact */}
      <div className="bg-[#7551B2] w-full h-32 md:h-42 "></div>
      <div className="absolute left-1/2 transform -translate-x-1/2 top-8 -translate-y-1/2 w-full max-w-md px-4">
        <SearchBar />
      </div>

      {/* Banner Section - Overlapping the split */}
      <div className="px-4 -mt-15 md:-mt-20 z-10">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto w-full max-w-4xl">
          <img
            src="banner.png"
            alt="banner"
            className="w-full h-32 md:h-60 object-cover"
          />
        </div>
      </div>

      {/* Query List Section - Compact spacing */}
      <div className="mt-4">
        <QueryList />
      </div>

      <div className="mt-4">
        <DoctorsList />
      </div>

      <WhyChooseUs 
        features={doctarFeatures}
      />

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-center text-black text-xl">why Doctar?</h2>
        <div className="flex items-center justify-between gap-4 p-4 text-sm text-black bg-[#F2F2F2] mt-16">
          <div className="w-1/3 h-40">
            <p className="text-xs">
              SIX offers a trusted, user-friendly platform tailored for used car
              dealers and individual seller.
            </p>
          </div>
          <div className="w-1/3 h-40 border-l-4 border-[#5C1F9F] pl-4 ">
            <p className="text-xs">
              Connect Directly Owners option to Skip middlemen,negotiate freely,
              and buy what you want within budge at your best price!
            </p>
          </div>
          <div className="w-1/3 h-40 border-l-4 border-[#5C1F9F] pl-1 ">
            <p className="text-xs">
              Connect with Real Buyers and Sellers Verified listings, genuine
              leads, and direct deals to ensure a faster & trusted experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
