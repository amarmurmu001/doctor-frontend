export default function QueryItem({ image, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center focus:outline-none group"
    >
      <div className="bg-[#7551B2] w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full flex items-center justify-center hover:bg-[#6441a0] transition-all duration-300 transform group-hover:scale-105 shadow-lg">
        <img
          src={image}
          alt={label}
          className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 object-contain filter brightness-0 invert"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div class="text-white text-xl sm:text-2xl">🏥</div>';
          }}
        />
      </div>
      <span className="text-gray-700 text-xs sm:text-sm md:text-base font-medium mt-2 group-hover:text-[#7551B2] transition-colors duration-300 text-center max-w-[70px] sm:max-w-[80px] md:max-w-none">
        {label}
      </span>
    </button>
  );
}


