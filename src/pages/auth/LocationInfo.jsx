import useAuthStore from '../../stores/authStore'
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="text-black font-semibold text-lg">octar</span>
        </div>
      </div>

      {/* Content section */}
      <div className="px-6">
        <div className="w-full bg-white rounded-t-3xl p-6 -mt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Help us get more Precise</h1>
          
          <div className="space-y-6">
            {/* Location field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Select you location</label>
              <input 
                value={city} 
                onChange={e=>setOnboarding({ city: e.target.value })} 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white" 
                placeholder="Eg : Lucknow, Uttar Pradesh" 
              />
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
