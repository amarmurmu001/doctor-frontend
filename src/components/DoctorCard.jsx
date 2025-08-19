export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-2xl border border-[#eee7fb] shadow-sm p-4">
      <div className="flex gap-4 items-start">
        {/* Image */}
        <div className="w-[121px] h-[125px] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>

          {/* Specialty row */}
          <div className="mt-2 flex items-center gap-2 text-gray-700">
            <img src="/icons/real-icon.png" alt="specialty" className="w-5 h-5" />
            <span className="text-[15px]">{doctor.specialty}</span>
          </div>

          {/* Languages row */}
          <div className="mt-2 flex items-center gap-2 text-gray-600">
            <img src="/icons/language.png" alt="language" className="w-5 h-5" />
            <span className="text-sm">{doctor.languages.join(" ,")}</span>
          </div>

          {/* Badges (70x30) below language and close to image */}
          <div className="mt-2 flex gap-2">
            <span className="inline-flex items-center justify-center rounded-lg w-[70px] h-[30px] text-[10px] font-semibold text-white bg-[#744db8]">
              {`${doctor.experienceYears}+ yrs`}
            </span>
            <span className="inline-flex items-center justify-center rounded-lg w-[70px] h-[30px] text-[10px] font-semibold text-white bg-[#744db8]">
              {`${doctor.rating}/5`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
  