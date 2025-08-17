import DoctorsList from "../components/DoctorList";
import QueryList from "../components/QueryList";
import SearchBar from "../components/ui/SearchBar";
import WhyChooseUs from "../components/WhyChooseUs.jsx";
import WhyChooseDoctar from "../components/ui/why_choose_doctar.jsx";
import WhyChooseDoctorPhoto from "../components/ui/why_choose_dotor_photo.jsx";
import VisionMission from "../components/ui/vision_mission.jsx";
import { doctarFeatures } from "../data/featuredData.js";
import NewsGuide from "../components/ui/news&guide.jsx";
import Blogs from "../components/ui/blogs.jsx";
import Trendingshorts from "../components/trendingshorts.jsx";
import TrendingVideo from "../components/ui/TrendingVideos.jsx";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 relative px-2">
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

      <WhyChooseUs features={doctarFeatures} />

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-center text-black text-xl">why Doctar?</h2>
        <div className="flex   bg-grey  justify-between gap-2  text-sm text-black bg- mt-16 ">
          <div className="relative   p-2 rounded-md flex-1 ">
            <p className="text-black font-xs font-poppins">
              SIX offers a trusted, user-friendly platform tailored for used car
              dealers and individual seller.
            </p>
          </div>
          <div className="  left-0 top-4  h-8 w-1 bg-purple-600 rounded mr-2"></div>
          <div className="relative  p-2 rounded-md flex-1 pl-[6px]">
            <p className="text-black font-xs">
              Connect Directly Owners option to Skip middlemen, negotiate
              freely, and buy what you want within budget at your best price!
            </p>
          </div>
          <div className=" left-0 top-4 h-8 w-1 bg-purple-600 rounded mr-2"></div>
          <div className="relative  p-2 rounded-md flex-1">
            <p className="text-black font-xs">
              Connect with Real Buyers and Sellers Verified listings, genuine
              leads, and direct deals to ensure a faster & trusted experience.
            </p>
          </div>
        </div>
      </div>
      <WhyChooseDoctorPhoto />
      <WhyChooseDoctar />
      <VisionMission />
      <NewsGuide />
      <Blogs />
      <Trendingshorts />
      <TrendingVideo />
      <div className="min-w-[431] flex-col bg-[#f2f1f9] rounded-2xl mt-[32px]"> 
        <div className="rounded-2xl"> <img src="/icons/expert.webp" alt="" /></div>
         <div className="text-center gap-2 p-2 items-center justify-center" > 
          <h2 className="text-[#7551b3] text-bold text-2xl">Talk With Expert</h2>
          <p>Engage in genuine, confident discussions
              with experts, fostering trust, sharing 
               insights, and encouraging collaborative
                problem-solving.</p>
          <button className="bg-black rounded-lg text-white py-2 px-4 flex text-xl items-center ">ask a question</button>
          <h2> trending categories</h2>
         </div>

      </div>
      
    </div>
  );
}
