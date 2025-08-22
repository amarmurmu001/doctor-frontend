import useAuthStore from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'

export default function AboutPersona(){
  const navigate = useNavigate()
  const { persona } = useAuthStore(s=>s.onboarding)
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">About me</h1>
          <p className="text-sm text-gray-600 mb-8">Please tell us know your purpose of visit, select from the options below</p>
          
          {/* Persona Selection Cards */}
          <div className="space-y-4 mb-8">
            {/* Patient Card */}
            <button 
              onClick={()=>setOnboarding({ persona:'patient' })} 
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                persona==='patient' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    I am a permanent<br />
                    resident but let not mention female or<br />
                    male
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {/* Patient illustration placeholder */}
                  <div className="w-20 h-20 bg-purple-100 rounded-xl flex items-center justify-center">
                    <div className="text-3xl">👥</div>
                  </div>
                </div>
              </div>
            </button>

            {/* Doctor Card */}
            <button 
              onClick={()=>setOnboarding({ persona:'doctor' })} 
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                persona==='doctor' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Doctor</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    I am a Doctor or<br />
                    practitioner of so Indian Ayurveda<br />
                    etc
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {/* Doctor illustration placeholder */}
                  <div className="w-20 h-20 bg-orange-100 rounded-xl flex items-center justify-center">
                    <div className="text-3xl">👨‍⚕️</div>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Next button */}
          <button 
            onClick={()=>navigate('/auth/location')} 
            disabled={!persona} 
            className="w-full bg-black text-white py-4 rounded-full font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
