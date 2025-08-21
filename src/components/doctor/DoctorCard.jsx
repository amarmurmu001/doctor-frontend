export default function DoctorCard({ name, specialty, price, image }) {
  return (
    <div className="min-w-[300px] flex items-center border-2 border-blue-500 rounded-xl bg-white overflow-hidden hover:shadow-lg transition">
      {/* Left: Text */}
      <div className="flex-1 p-4">
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{specialty}</p>
        <p className="text-sm font-medium text-gray-700 mt-2">{price}</p>
      </div>

      {/* Right: Image */}
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}


