export default function QueryItem({ image, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center focus:outline-none group"
    >
      <div className="bg-[#7551B2] w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center hover:bg-[#6441a0] transition-all duration-300 transform group-hover:scale-105 shadow-lg">
        <img 
          src={image} 
          alt={label} 
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain filter brightness-0 invert"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div class="text-white text-2xl">🏥</div>';
          }}
        />
      </div>
      <span className="text-gray-700 text-xs sm:text-sm font-medium mt-2 group-hover:text-[#7551B2] transition-colors duration-300">
        {label}
      </span>
    </button>
  );
}


