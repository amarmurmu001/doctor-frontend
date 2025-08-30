import { useNavigate } from 'react-router-dom';

export default function DoctorCard({
  name,
  specialty,
  languages,
  yearsOfExperience,
  ratingAverage,
  image,
  doctorId,
  city = 'india'
}) {
  const navigate = useNavigate();

  // Debug: Log rating data when component renders
  console.log('🔍 DoctorCard rating data:', {
    name,
    ratingAverage,
    type: typeof ratingAverage,
    isValid: ratingAverage && ratingAverage > 0
  });

  // Generate SEO-friendly URL
  const generateSeoUrl = () => {
    if (!doctorId) return '/';
    const location = city.toLowerCase().replace(/\s+/g, '-');
    const doctorSlug = `${name.toLowerCase().replace(/\s+/g, '-')}-${specialty.toLowerCase().replace(/\s+/g, '-')}`;
    return `/${location}/doctor/${doctorSlug}`;
  };

  function handleClick() {
    if (doctorId) {
      const seoUrl = generateSeoUrl();
      navigate(seoUrl);
    }
  }

  return (
    <div
      onClick={handleClick}
      className="min-w-[300px] p-2 flex items-center border-2 border-blue-500 rounded-xl bg-white overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      {/* Right: Image */}
      <div className="w-28 h-28 flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Left: Text */}
      <div className="flex-1 ">
        <h3 className="font-semibold text-gray-800 text-lg">{name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <img src="/icons/real-icon.png" alt="heart" className="w-4 h-4" />
          <span className="text-sm text-gray-700">{specialty}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 ">
          <span>🗣️</span>
          <span >{languages?.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-semibold">
            {yearsOfExperience}+ years Experience
          </span>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-semibold">
            {ratingAverage && ratingAverage > 0 ? `${Number(ratingAverage).toFixed(1)}/5 Rating` : 'New Doctor'}
          </span>
        </div>
      </div>
    </div>
  );
}
