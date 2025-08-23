import DoctorsList from "../components/doctor/DoctorList";
import QueryList from "../components/home/QueryList";
import SearchBar from "../components/search/SearchBar";
import WhyChooseUs from "../components/home/WhyChooseUs/WhyChooseUs.jsx";
import WhyChooseDoctar from "../components/marketing/WhyChooseDoctar.jsx";
import WhyChooseDoctorPhoto from "../components/marketing/WhyChooseDoctorPhoto.jsx";
import VisionMission from "../components/content/VisionMission.jsx";
import { doctarFeatures } from "../data/featuredData.js";
import NewsGuide from "../components/content/NewsGuide.jsx";
import Blogs from "../components/content/Blogs.jsx";
import Trendingshorts from "../components/content/Trendingshorts.jsx";
import TrendingVideo from "../components/content/TrendingVideos.jsx";
import TalkWithExpert from "../components/marketing/TalkWithExpert.jsx";
import Doctorreview from "../components/reviews/Doctorreview.jsx";
import Buyerreview from "../components/reviews/Buyerreview.jsx";
import HowItWorks from "../components/content/HowItWorks.jsx";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Purple Header Background - Full Width */}
      <div className="bg-[#7551B2] w-full h-32 md:h-[15vw]"></div>
      
      {/* Mobile Search Bar */}
      <div className="absolute md:hidden left-1/2 transform -translate-x-1/2 top-8 -translate-y-1/2 w-full max-w-md px-4">
        <SearchBar />
      </div>

      {/* Main Content Container with 80vw width on desktop */}
      <div className="md:w-[80vw] mx-auto">
        {/* Banner Section - Overlapping the split */}
        <div className="px-4 -mt-16 md:-mt-[12vw] z-10">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto w-full min-w-xsm max-w-6xl">
            <img
              src="banner.png"
              alt="banner"
              className="w-full min-h-30 h-[30vw] object-cover"
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

        <WhyChooseUs features={doctarFeatures} />

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-black font-bold py-2 text-xl">Why Doctar?</h2>
          <div className="flex bg-[#F2F2F2] justify-between rounded-3xl mx-2 text-sm text-black p-2">
            <div className="relative p-1 rounded-md flex-1">
              <p className="text-black text-[11px] leading-tight font-poppins">
                SIX offers a trusted, user-friendly platform tailored for used car
                dealers and individual seller.
              </p>
            </div>
            <div className="left-0 mt-1 h-8 w-1 bg-purple-600 rounded mr-2"></div>
            <div className="relative p-1 rounded-md flex-1 pl-[6px]">
              <p className="text-black text-[11px] leading-tight">
                Connect Directly Owners option to Skip middlemen, negotiate
                freely, and buy what you want within budget at your best price!
              </p>
            </div>
            <div className="left-0 mt-1 h-8 w-1 bg-purple-600 rounded mr-2"></div>
            <div className="relative p-1 rounded-md flex-1">
              <p className="text-black text-[11px] leading-tight">
                Connect with Real Buyers and Sellers Verified listings, genuine
                leads, and direct deals to ensure a faster & trusted experience.
              </p>
            </div>
          </div>
        </div>
        
        <WhyChooseDoctorPhoto />
        <WhyChooseDoctar />
        <HowItWorks/>
        <VisionMission />
        <NewsGuide />
        <Blogs />
        <Trendingshorts />
        <TrendingVideo />
        <TalkWithExpert/>
        <Doctorreview/>
        <Buyerreview/>
      </div>
    </div>
  );
}
