export default function WhyChooseDoctar() {
  return (
    <div className="p-2">
        <h2 className="text-center text-black font-bold text-xl mt-2 mb-2 ">why choose DOCTAR ?</h2>
        <div className="flex text-[10px] gap-2.5 rounded-xl mb-20 ">
          <div className="flex-col w-[200px] flex rounded-xl overflow-hidden bg-white h-[225px] flex-1 ">
            <div className="flex justify-center ">
              <img
                className="w-[96px] h-[31px"
                src="/icons/logo.png"
                alt="no image"
              />
            </div>
            <div className="flex items-center  flex-1 p-2.5 text-white bg-purple-600">
              <p>Thousands of options around you</p>
            </div>
            <div className="flex items-center  flex-1 p-2.5 text-black ">
              <p>Genuine prices</p>
            </div>
            <div className="flex items-center  flex-1 p-2.5 text-white bg-purple-600">
              
              <p>Maximum Details</p>
            </div>
            <div className="flex items-center  flex-1 p-2.5 text-black ">

              <p>Lowest interest rate*</p>
            </div>
                <div className="flex items-center  flex-1 p-2.5 text-white bg-purple-600">
              
              <p>One click you can connect with seller</p>
            </div>
          </div>
          <div className="flex-col w-[200px] rounded-xl overflow-hidden bg-white h-[225px] flex flex-1">
            <div className="flex justify-center flex-1    ">
              <p className="text-[20px]">Others</p>
            </div>
            <div className="flex items-center flex-1 p-2.5 text-white bg-[#7881A3]">
              <p>Limited option</p>
            </div>
            <div className="flex items-center flex-1 p-2.5 text-black ">
              <p>Higher prices</p>
            </div>
            <div className="flex items-center flex-1 p-2.5 text-white bg-[#7881A3]">
              
              <p>Low details</p>
            </div>
            <div className="flex items-center flex-1 p-2.5 text-black ">
              
              <p>High interest rate*</p>
            </div>
            <div className="flex items-center flex-1 p-2.5 text-white bg-[#7881A3]">
              
              <p>Struggling for connect with seller</p>
            </div>
          </div>
        </div>
      </div>
  );
}