import SearchBar from "../components/ui/SearchBar";

const arr = [
  { category: "heart", number: 25 },
  { category: "liver", number: 25 },
  { category: "lungs", number: 20 },
  { category: "heart", number: 25 },
  { category: "liver", number: 25 },
  { category: "lungs", number: 20 },
  { category: "heart", number: 25 },
  { category: "liver", number: 25 },
  { category: "lungs", number: 20 },
  { category: "heart", number: 25 },
  { category: "liver", number: 25 },
  { category: "lungs", number: 20 }
];

const categoryToIconSrc = {
  heart: "/icons/heart.png",
  liver: "/icons/liver.png",
  lungs: "/icons/lungs.png"
};

const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function CategoryCard({ category, number }) {
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

export default function DoctorType() {
  return (
    <div className="w-full">
      {/* Header with search */}
      <div className="w-full bg-[#7551b3] px-4 py-4">
        <SearchBar />
      </div>

      {/* Result count */}
      <div className="px-4 py-3">
        <h2 className="text-xl font-bold">Total 443 Doctors Found in Deoghar</h2>
      </div>

      {/* Two rows with 3 cards each */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-4 place-items-center">
          {arr.slice(0, 6).map(({ category, number }, index) => (
            <CategoryCard key={`top-${category}-${index}`} category={category} number={number} />
          ))}
        </div>
      </div>

      {/* Grid of categories */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-4 place-items-center">
          {arr.map(({ category, number }, index) => (
            <CategoryCard key={`${category}-${index}`} category={category} number={number} />
          ))}
        </div>
      </div>
    </div>
  );
}


