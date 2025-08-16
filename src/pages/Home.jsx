import DoctorsList from "../components/DoctorList";
import QueryList from "../components/QueryList";
import SearchBar from "../components/ui/SearchBar";

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

      <div>
        <h3 className="text-center text-black text-xl">Why choose us</h3>
        <div className="bg-[#7551B2] w-full h-75 md:h-42 pt-4 px-2 ">
          <h2 className="text-center text-white text-xl">Consultant</h2>
          <div className="flex flex-col items-center justify-center p-4 border-2 border-white rounded-xl ">
            <h2 className="text-center text-white text-xl">
              Why <span className="text-[#4D9FF1]">DOCTAR</span> for doctors
            </h2>
            <div className="flex overflow-x-auto">
              <div
                className="flex p-4
              "
              >
                <div className="w-16 h-16  inline-flex items-center justify-center text-7xl font-bold text-white">
                  1
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    Free Verified Badge for your listings
                  </p>
                  <p className="text-sm text-white">
                    boost customer trust and increase chances of quicker,
                    reliable sales.
                  </p>
                </div>
              </div>
              {/* <div
                className="flex
              "
              >
                <div className="w-10 h-10  inline-flex items-center justify-center text-7xl font-bold text-white">
                  2
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    5 Free Listings for first 3 months
                  </p>
                  <p className="text-sm text-white">
                    showcase your listing to more buyers and grow your sales
                  </p>
                </div>
              </div>
              <div
                className="flex
              "
              >
                <div className="w-10 h-10  inline-flex items-center justify-center text-7xl font-bold text-white">
                  3
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    Free Dealer Page
                  </p>
                  <p className="text-sm text-white">
                    showcase your inventory, business details, contact and build
                    trust with potential buyers!
                  </p>
                </div>
              </div> */}
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-[#5154B5] text-white px-4 py-2 rounded-md flex items-center justify-center">
              <p>apply now</p>
            </button>
          </div>
        </div>
      </div>
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
