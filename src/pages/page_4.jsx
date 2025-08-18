import SearchBar from "../components/ui/SearchBar";

const doctors = [
  {
    id: 1,
    name: "Dr. Sanchita Mukharjee",
    specialty: "Cardiologist",
    languages: ["Hindi", "English", "Bengali"],
    experienceYears: 7,
    rating: 4.4,
    image: "/profile.png"
  },
  {
    id: 2,
    name: "Dr. Sandeep Suman",
    specialty: "Cardiologist",
    languages: ["Hindi", "English", "Bhojpuri"],
    experienceYears: 7,
    rating: 4.5,
    image: "/profile.png"
  },
  {
    id: 3,
    name: "Dr. Riya Jaiswal",
    specialty: "Cardiologist",
    languages: ["Hindi", "English", "Bengali"],
    experienceYears: 6,
    rating: 4.3,
    image: "/profile.png"
  },
  {
    id: 4,
    name: "Dr. Sanchita Mukharjee",
    specialty: "Cardiologist",
    languages: ["Hindi", "English", "Bengali"],
    experienceYears: 8,
    rating: 4.4,
    image: "/profile.png"
  }
];

export default function Page4() {
  return (
    <div className="w-full">
      {/* Header with search */}
      <div className="w-full bg-[#7551b3] px-4 py-4">
        <SearchBar />
      </div>

      {/* Title */}
      <div className="px-4 py-3">
        <h2 className="text-xl font-extrabold">
          Total {doctors.length} Cardiologist found in Deoghar
        </h2>
      </div>

      {/* Doctors list */}
      <div className="px-4 pb-6 space-y-4">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl border border-[#eee7fb] shadow-sm p-4">
            <div className="flex gap-4 items-start">
              {/* Image */}
              <div className="w-[121px] h-[125px] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>

                {/* Specialty row */}
                <div className="mt-2 flex items-center gap-2 text-gray-700">
                  <img src="/icons/heart.png" alt="specialty" className="w-5 h-5" />
                  <span className="text-[15px]">{doc.specialty}</span>
                </div>

                {/* Languages row */}
                <div className="mt-2 flex items-center gap-2 text-gray-600">
                  <span className="text-base">🌐</span>
                  <span className="text-sm">{doc.languages.join(" ,")}</span>
                </div>

                {/* Badges (70x30) below language and close to image */}
                <div className="mt-2 flex gap-2">
                  <span className="inline-flex items-center justify-center rounded-lg w-[70px] h-[30px] text-[10px] font-semibold text-white bg-gradient-to-r from-[#8f66d6] to-[#5e39a5]">
                    {`${doc.experienceYears}+ yrs`}
                  </span>
                  <span className="inline-flex items-center justify-center rounded-lg w-[70px] h-[30px] text-[10px] font-semibold text-white bg-gradient-to-r from-[#8f66d6] to-[#5e39a5]">
                    {`${doc.rating}/5`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


