import DoctorsList from "../components/DoctorList";
import QueryList from "../components/QueryList";
import SearchBar from "../components/ui/SearchBar";
import LocationDetector from "../components/LocationDetector";



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

      <div className="overflow-hidden">
        <h3 className="text-center">Why choose us</h3>
        <div className="bg-[#7551B2] w-full h-32 md:h-42 ">
          <h2 className="text-center">Consultant</h2>
          <div>
            <h2>
              Why <span>DOCTAR</span> for doctors
            </h2>
            <div className="flex ">
              <div>
                <div>1</div>
                <div>
                  <p>Free Verified Badge for your listings</p>
                  <p>
                    boost customer trust and increase chances of quicker,
                    reliable sales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
