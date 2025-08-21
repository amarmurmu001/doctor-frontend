import useAuthStore from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'

export default function LocationInfo(){
  const navigate = useNavigate()
  const { city, language } = useAuthStore(s=>s.onboarding)
  const setOnboarding = useAuthStore(s=>s.setOnboarding)

  return (
    <div className="min-h-screen bg-[#f4f4ff] flex items-start pt-8 justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
        <h1 className="text-lg font-bold mb-2">Help us get more precise</h1>
        <input value={city} onChange={e=>setOnboarding({ city: e.target.value })} className="w-full border rounded-md px-3 py-2 mb-3" placeholder="City / Location" />
        <input value={language} onChange={e=>setOnboarding({ language: e.target.value })} className="w-full border rounded-md px-3 py-2 mb-4" placeholder="Language" />
        <button onClick={()=>navigate('/auth/personal')} className="w-full bg-black text-white py-2 rounded-md">Next</button>
      </div>
    </div>
  )
}


