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
import WhyDoctar from "../components/home/WhyDoctar.jsx";

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
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto w-full min-w-xsm ">
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
        <WhyDoctar/>
        
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
