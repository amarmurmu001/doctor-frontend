import useAuthStore from '../../stores/authStore'
import { registerUser } from '../../services/authAPI'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function PersonalDetails(){
  const navigate = useNavigate()
  const onboarding = useAuthStore(s=>s.onboarding)
  const setOnboarding = useAuthStore(s=>s.setOnboarding)
  const setAuth = useAuthStore(s=>s.setAuth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFinish(){
    setLoading(true); setError('')
    try{
      const res = await registerUser({ ...onboarding })
      setAuth({ user: res.user, token: res.token })
      navigate('/login')
    }catch(err){
      setError(err.message || 'Failed to save details')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#f4f4ff] flex items-start pt-8 justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
        <h1 className="text-lg font-bold mb-2">Personal Details</h1>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {['male','female','other'].map(g => (
            <button key={g} onClick={()=>setOnboarding({ gender:g })} className={`border rounded-md py-2 capitalize ${onboarding.gender===g?'ring-2 ring-purple-500':''}`}>{g}</button>
          ))}
        </div>
        <input value={onboarding.dob} onChange={e=>setOnboarding({ dob: e.target.value })} className="w-full border rounded-md px-3 py-2 mb-4" placeholder="DD/MM/YYYY" />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button onClick={handleFinish} disabled={loading} className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50">{loading?'Finishing…':'Finish setup'}</button>
      </div>
    </div>
  )
}


