import DoctorsList from "../components/doctor/DoctorList";
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
import Buyerreview from "../components/reviews/Patientreview.jsx";
import HowItWorks from "../components/content/HowItWorks.jsx";
import WhyDoctar from "../components/home/WhyDoctar.jsx";
import FAQ from "../components/FAQ.jsx";
import HomeFAQ from "../components/home/HomeFAQ.jsx";
import Footer from "../components/layout/Footer.jsx";
import QueryGrid from "../components/home/QueryGrid.jsx";

import DefaultSeo from "../components/seo/DefaultSeo.jsx";


export default function Home() {


  
  return (
    <>
      {/* Default SEO for Home page - resets any doctor profile meta tags */}
      <DefaultSeo />
      
      <div className="min-h-screen relative">
      {/* Purple Header Background - Full Width */}
      <div className="bg-[#7551B2] w-full h-32 md:h-[15vw]"></div>
      
      {/* Mobile Search Bar */}
      <div className="absolute md:hidden left-1/2 transform -translate-x-1/2 top-8 -translate-y-1/2 w-full max-w-md px-4">
        <SearchBar />
      </div>

      {/* Main Content Container with responsive width */}
      <div className="w-full md:w-[90vw] lg:w-[80vw] mx-auto">
        {/* Banner Section - Overlapping the split */}
        <div className="px-2 sm:px-4 -mt-16 md:-mt-[12vw] z-10">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto w-full min-w-xsm">
            <img
              src="banner.png"
              alt="banner"
              className="w-full min-h-30 h-[30vw] object-cover"
            />
          </div>
        </div>

        
        <div className="mt-4 px-2 sm:px-0 my-10 ">
          <QueryGrid />
        </div>

        <div className="mt-4 px-2 sm:px-0 mb-10">
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
        
        {/* Reviews Section - Responsive Layout with proper spacing */}
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-8 md:mt-12 lg:mt-16">
          {/* Mobile: Stacked vertically, Tablet: Side by side with smaller gap, Desktop: Side by side with larger gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-stretch">
            <Doctorreview/>
            <Buyerreview/>
          </div>
        </div>
      </div>

      </div>

      {/* FAQ Section - New style for all devices */}
      <div className="mt-20">
        <HomeFAQ />
      </div>

      {/* Footer Section */}
      <Footer />
    </>
  );
}
