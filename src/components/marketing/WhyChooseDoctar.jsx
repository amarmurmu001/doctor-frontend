export default function WhyChooseDoctar() {
  return (
    <div className="p-2">
      <h2 className="text-center text-black font-bold text-xl mt-2 mb-2">why choose DOCTAR ?</h2>
      
      {/* Mobile Layout - 2 divs per row */}
      <div className="md:hidden flex text-[10px] gap-2.5 rounded-xl mb-2">
        <div className="flex-col w-[200px] flex shadow-lg rounded-xl overflow-hidden bg-white h-[225px] flex-1">
          <div className="flex justify-center">
            <img
              className="w-[96px] h-[31px]"
              src="/icons/logo.png"
              alt="no image"
            />
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-purple-600">
            <p>Thousands of options around you</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-black">
            <p>Genuine prices</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-purple-600">
            <p>Maximum Details</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-black">
            <p>Lowest interest rate*</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-purple-600">
            <p>One click you can connect with seller</p>
          </div>
        </div>
        <div className="flex-col w-[200px] shadow-lg rounded-xl overflow-hidden bg-white h-[225px] flex flex-1">
          <div className="flex justify-center flex-1">
            <p className="text-[20px]">Others</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-[#7881A3]">
            <p>Limited option</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-black">
            <p>Higher prices</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-[#7881A3]">
            <p>Low details</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-black">
            <p>High interest rate*</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-[#7881A3]">
            <p>Struggling for connect with seller</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout - 3 divs of equal size */}
      <div className="hidden md:flex gap-4 rounded-xl mb-2">
        {/* First div - Image only (leftmost) */}
        <div className="flex-1 flex-col shadow-lg rounded-xl overflow-hidden bg-white h-[225px] flex">
          <div className="flex justify-center items-center h-full">
            <img
              className="w-full h-full object-cover"
              src="/icons/doctor.png"
              alt="Doctor"
            />
          </div>
        </div>

        {/* Second div with Doctar logo */}
        <div className="flex-1 flex-col shadow-lg rounded-xl overflow-hidden bg-white h-[225px] flex">
          <div className="flex justify-center">
            <img
              className="w-[96px] h-[31px]"
              src="/icons/logo.png"
              alt="Doctar logo"
            />
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-purple-600">
            <p className="text-sm">Thousands of options around you</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-black">
            <p className="text-sm">Genuine prices</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-purple-600">
            <p className="text-sm">Maximum Details</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-black">
            <p className="text-sm">Lowest interest rate*</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-purple-600">
            <p className="text-sm">One click you can connect with seller</p>
          </div>
        </div>

        {/* Third div */}
        <div className="flex-1 flex-col shadow-lg rounded-xl overflow-hidden bg-white h-[225px] flex">
          <div className="flex justify-center flex-1">
            <p className="text-[20px]">Others</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-[#7881A3]">
            <p className="text-sm">Limited option</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-black">
            <p className="text-sm">Higher prices</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-[#7881A3]">
            <p className="text-sm">Low details</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-black">
            <p className="text-sm">High interest rate*</p>
          </div>
          <div className="flex items-center flex-1 p-2.5 text-white bg-[#7881A3]">
            <p className="text-sm">Struggling for connect with seller</p>
          </div>
        </div>
      </div>
    </div>
  );
}


