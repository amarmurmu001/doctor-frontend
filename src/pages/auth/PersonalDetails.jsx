import useAuthStore from '../../stores/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function PersonalDetails(){
  const navigate = useNavigate()
  const onboarding = useAuthStore(s=>s.onboarding)
  const setOnboarding = useAuthStore(s=>s.setOnboarding)
  // const setAuth = useAuthStore(s=>s.setAuth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFinish(){
    setLoading(true); setError('')
    try{
      navigate('/login')
    }catch(err){
      setError(err.message || 'Failed to save details')
    }finally{ setLoading(false) }
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Details</h1>
          <p className="text-sm text-gray-600 mb-8">Please tell us know some basic details for seamless usage and consultations</p>
          
          {/* Sex Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-900 mb-4">Sex</label>
            <div className="flex gap-6 justify-center">
              {/* Male */}
              <button 
                onClick={()=>setOnboarding({ gender:'male' })} 
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  onboarding.gender === 'male' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  onboarding.gender === 'male' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.9 5l-1.4 1.4L16.1 8H13c-3.3 0-6 2.7-6 6v5h2v-5c0-2.2 1.8-4 4-4h3.1l-1.6 1.6L15.9 13 20 9l-4.1-4z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">Male</span>
              </button>

              {/* Female */}
              <button 
                onClick={()=>setOnboarding({ gender:'female' })} 
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  onboarding.gender === 'female' 
                    ? 'bg-pink-50 text-pink-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  onboarding.gender === 'female' ? 'bg-pink-100' : 'bg-gray-100'
                }`}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">Female</span>
              </button>
            </div>
          </div>

          {/* Age field */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-900 mb-3">Age</label>
            <input 
              value={onboarding.dob || ''} 
              onChange={e=>setOnboarding({ dob: e.target.value })} 
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white" 
              placeholder="DD/MM/YYYY" 
            />
          </div>

          {/* Error message */}
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
          
          {/* Finish Setup button */}
          <button 
            onClick={handleFinish} 
            disabled={loading} 
            className="w-full bg-black text-white py-4 rounded-full font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            {loading ? 'Finishing…' : 'Finish Setup'}
          </button>
        </div>
      </div>
    </div>
  )
}
