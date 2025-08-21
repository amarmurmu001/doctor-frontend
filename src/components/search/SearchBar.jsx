export default function SearchBar() {
  return (
    <div className="flex items-center bg-white rounded-full w-full max-w-md shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Custom Search Icon */}
      <img 
        src="/icons/Search.png"
        alt="Search"
        className="w-5 h-5 m-2 mx-3 object-contain"
      />

      {/* Input */}
      <input
        type="text"
        placeholder="Search"
        className="flex-1 outline-none text-gray-700 bg-transparent placeholder-gray-400 focus:placeholder-gray-300 transition-colors duration-200"
      />

      {/* Language Button */}
      <div className="bg-[#1F1F1F] text-white text-sm w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-800 transition-colors duration-200">
        En
      </div>
    </div>
  );
}


