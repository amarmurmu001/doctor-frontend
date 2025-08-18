function TalkWithExpert() {
  return (
    <div className=" m-2 flex flex-col  bg-[#f2f1f9] rounded-2xl mt-[32px] overflow-hidden">
        <div className="w-full">
          <img
            src="/icons/expert.webp"
            alt="Doctor consultation"
            className="w-full h-auto rounded-t-2xl object-cover"
          />
        </div>

        <div className="text-center gap-4 p-6 flex flex-col items-center justify-center">
          <h2 className="text-[#7551b3] font-bold text-2xl ">
            Talk With Expert
          </h2>

          <p className="text-gray-700 text-base leading-relaxed  px-2">
            Engage in genuine, confident discussions with experts, fostering
            trust, sharing insights, and encouraging collaborative
            problem-solving.
          </p>

          <button className="bg-black rounded-lg text-white py-3 px-6 text-lg font-medium  hover:bg-gray-800 transition-colors">
            Ask a question
          </button>

          <h3 className="text-gray-800 text-lg font-medium ">
            Trending categories
          </h3>

          <div className="flex flex-wrap gap-4 mx-auto text-sm">
            <a href="#" className="text-[#7551b3] hover:underline">
              New cars &gt;
            </a>
            <a href="#" className="text-[#7551b3] hover:underline">
              New Bikes &gt;
            </a>
            <a href="#" className="text-[#7551b3] hover:underline">
              property for sale &gt;
            </a>
            <a href="#" className="text-[#7551b3] hover:underline">
              Used car &gt;
            </a>
            <a href="#" className="text-[#7551b3] hover:underline">
              Used Bikes &gt;
            </a>
            <a href="#" className="text-[#7551b3] hover:underline">
              property for rent &gt;
            </a>
          </div>
        </div>
      </div>
  )
}

export default TalkWithExpert