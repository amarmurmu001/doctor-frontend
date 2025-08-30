const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export default function DoctorTypeCard({ category, number, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#744db8] rounded-2xl p-4 w-full max-w-[160px] h-[100px] flex flex-col items-center justify-center text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
    >
      <div className="text-center w-full">
        <h3 className="text-sm sm:text-base font-semibold mb-2 text-center leading-tight">
          {toTitleCase(category)}
        </h3>
        <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8f66d6] to-[#5e39a5] whitespace-nowrap">
          {number}+ doctors
        </span>
      </div>
    </div>
  );
}


