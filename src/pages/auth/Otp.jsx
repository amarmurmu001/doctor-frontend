import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyOtp } from '../../services/authAPI'
import useAuthStore from '../../stores/authStore'

export default function Otp(){
  const navigate = useNavigate()
  const { email, phone } = useAuthStore(s => s.onboarding)
  const setOnboarding = useAuthStore(s => s.setOnboarding)
  const [code, setCode] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleVerify(){
    setError('')
    setSubmitting(true)
    try{
      await verifyOtp({ email, phone, code: code.join('') })
      setOnboarding({ otpVerified: true })
      navigate('/auth/about')
    }catch(err){
      setError(err.message || 'Invalid OTP')
    }finally{
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f4ff] flex items-start pt-8 justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
        <h1 className="text-lg font-bold mb-1">Verification</h1>
        <p className="text-xs text-gray-500 mb-4">Enter the OTP sent to your phone/email</p>
        <div className="flex gap-3 justify-center mb-4">
          {code.map((v,i)=>(
            <input key={i} value={v} maxLength={1} onChange={e=>{
              const n=[...code]; n[i]=e.target.value.replace(/\D/g,''); setCode(n)
            }} className="w-10 h-10 text-center border rounded-md" />
          ))}
        </div>
        {error && <div className="text-red-600 text-sm mb-2 text-center">{error}</div>}
        <button onClick={handleVerify} disabled={submitting} className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50">{submitting ? 'Verifying…' : 'Continue'}</button>
      </div>
    </div>
  )
}


