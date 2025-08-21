export default function QueryItem({ image, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center focus:outline-none"
    >
      <div className="bg-[#7551B2] w-20 h-20 rounded-full flex flex-col items-center justify-center space-y-1 hover:opacity-90 transition">
        <img src={image} alt={label} className="w-8 h-8 object-contain" />
        <span className="text-white text-xs">{label}</span>
      </div>
    </button>
  );
}


