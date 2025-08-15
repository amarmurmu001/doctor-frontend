function Nav() {
  return (
    <div className="relative flex items-center justify-between p-2 px-4 md:p-4 md:px-10 bg-[#7551B2] ">
      {/* Left: Location Dropdown */}
      <div className="relative">
        <select className="appearance-none bg-transparent text-white font-medium outline-none px-4 py-1 pr-8 rounded-md cursor-pointer transition-all duration-300 ease-in-out">
          <option className="bg-white text-black">Deoghar</option>
          <option className="bg-white text-black">Delhi</option>
          <option className="bg-white text-black">Mumbai</option>
        </select>

        {/* Custom Arrow */}
        <svg
          className="w-4 h-4 text-white absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Center: Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src="icons/logo.png" alt="Doctar" className="w-24 h-auto" />
      </div>

      {/* Right: Profile Image */}
      <div className="w-8 h-10 rounded-full overflow-hidden">
        <img
          src="profile.png"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Nav;
