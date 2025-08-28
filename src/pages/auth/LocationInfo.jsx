import useAuthStore from '../../stores/useAuthStore'
import { useNavigate } from 'react-router-dom'

export default function LocationInfo(){
  const navigate = useNavigate()
  const { city, language } = useAuthStore(s=>s.onboarding)
  const setOnboarding = useAuthStore(s=>s.setOnboarding)

  return (
    <div className="min-h-screen bg-white" style={{
      backgroundImage: `
        linear-gradient(to right, #f3f4f6 1px, transparent 1px),
        linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px'
    }}>
      {/* Purple header bar */}
      <div className="w-full h-2 bg-purple-500"></div>
      
      {/* Logo section */}
      <div className="px-6 py-6 bg-white">
        <div className="flex items-center justify-center">
          <img 
            src="/icons/logo.png" 
            alt="Doctar" 
            className="h-10 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      {/* Content section */}
      <div className="px-6">
        <div className="w-full bg-white rounded-t-3xl p-6 -mt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Help us get more Precise</h1>
          
          <div className="space-y-6">
            {/* Location field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Select your location</label>
              <div className="relative">
                <input 
                  value={city} 
                  onChange={e=>setOnboarding({ city: e.target.value })} 
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white" 
                  placeholder="e.g., Mumbai, Delhi, Kolkata" 
                  list="city-suggestions"
                />
                <datalist id="city-suggestions">
                  <option value="Mumbai" />
                  <option value="Delhi" />
                  <option value="Bangalore" />
                  <option value="Kolkata" />
                  <option value="Chennai" />
                  <option value="Hyderabad" />
                  <option value="Pune" />
                  <option value="Ahmedabad" />
                  <option value="Jaipur" />
                  <option value="Lucknow" />
                  <option value="Dhanbad" />
                  <option value="Deoghar" />
                  <option value="Howrah" />
                  <option value="Sahjahanpur" />
                  <option value="Patna" />
                </datalist>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App Language field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">App Language</label>
              <input 
                value={language} 
                onChange={e=>setOnboarding({ language: e.target.value })} 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white" 
                placeholder="English" 
              />
            </div>

            {/* Second App Language field (as shown in design) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">App Language</label>
              <input 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white" 
                placeholder="English" 
              />
            </div>
          </div>

          {/* Next button */}
          <div className="mt-12">
            <button 
              onClick={()=>navigate('/auth/personal')} 
              className="w-full bg-black text-white py-4 rounded-full font-medium text-base hover:bg-gray-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
