import useAuthStore from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'

export default function AboutPersona(){
  const navigate = useNavigate()
  const { persona } = useAuthStore(s=>s.onboarding)
  const setOnboarding = useAuthStore(s=>s.setOnboarding)

  return (
    <div className="min-h-screen bg-[#f4f4ff] flex items-start pt-8 justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
        <h1 className="text-lg font-bold mb-2">About me</h1>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={()=>setOnboarding({ persona:'patient' })} className={`border rounded-xl p-3 text-left ${persona==='patient'?'ring-2 ring-purple-500':''}`}>Patient</button>
          <button onClick={()=>setOnboarding({ persona:'doctor' })} className={`border rounded-xl p-3 text-left ${persona==='doctor'?'ring-2 ring-purple-500':''}`}>Doctor</button>
        </div>
        <button onClick={()=>navigate('/auth/location')} disabled={!persona} className="mt-4 w-full bg-black text-white py-2 rounded-md disabled:opacity-50">Next</button>
      </div>
    </div>
  )
}


