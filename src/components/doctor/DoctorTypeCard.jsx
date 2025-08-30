const categoryToIconSrc = {
  heart: "/icons/heart.png",
  liver: "/icons/liver.png",
  lungs: "/icons/lungs.png"
};

const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export default function DoctorTypeCard({ category, number }) {
  return (
    <div className="bg-[#744db8] rounded-2xl p-3 sm:p-4 w-full max-w-[140px] h-[120px] sm:h-[142px] flex flex-col items-center justify-center text-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <img
        src={categoryToIconSrc[category]}
        alt={category}
        className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
      />
      <div className="mt-2 sm:mt-4 w-full">
        <span className="inline-flex items-center justify-center rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8f66d6] to-[#5e39a5] whitespace-nowrap">
          {`${toTitleCase(category)} ${number}+`}
        </span>
      </div>
    </div>
  );
}


