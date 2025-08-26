import { useNavigate } from 'react-router-dom';

export default function DoctorCard({ name, specialty, price, image, doctorId, city = 'india' }) {
  const navigate = useNavigate();

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
      className="min-w-[300px] flex items-center border-2 border-blue-500 rounded-xl bg-white overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
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


