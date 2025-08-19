const categoryToIconSrc = {
  heart: "/icons/heart.png",
  liver: "/icons/liver.png",
  lungs: "/icons/lungs.png"
};

const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export default function DoctorTypeCard({ category, number }) {
  return (
    <div className="bg-[#744db8] rounded-2xl p-4 w-[128px] h-[142px] flex flex-col items-center justify-center text-white shadow-sm">
      <img
        src={categoryToIconSrc[category]}
        alt={category}
        className="w-14 h-14 object-contain"
      />
      <div className="mt-4 w-full">
        <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-[#8f66d6] to-[#5e39a5]">
          {`${toTitleCase(category)} ${number}+`}
        </span>
      </div>
    </div>
  );
}
