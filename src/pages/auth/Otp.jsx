import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyOtp, resendOtp } from '../../services/authAPI'
import useAuthStore from '../../stores/authStore'

export default function Otp(){
  const navigate = useNavigate()
  const { email, persona } = useAuthStore(s => s.onboarding)
  const setOnboarding = useAuthStore(s => s.setOnboarding)
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputsRef = useRef([])

  function handleChange(index, value){
    const digit = value.replace(/\D/g,'').slice(0,1)
    const next = [...code]
    next[index] = digit
    setCode(next)
    if (digit && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e){
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handlePaste(e){
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g,'')
    if (!text) return
    const next = [...code]
    for (let i = 0; i < Math.min(text.length, next.length); i++) {
      next[i] = text[i]
    }
    setCode(next)
    const focusTo = Math.min(text.length, next.length) - 1
    if (focusTo >= 0) inputsRef.current[focusTo]?.focus()
  }

  async function handleVerify(){
    setError('')
    setSubmitting(true)
    try{
      await verifyOtp({ email, otp: code.join(''), role: persona === 'doctor' ? 'doctor' : 'user' })
      setOnboarding({ otpVerified: true })
      navigate('/auth/about')
    }catch(err){
      setError(err.message || 'Invalid OTP')
    }finally{
      setSubmitting(false)
    }
  }

  async function handleResend(){
    if (cooldown > 0) return
    setError('')
    try{
      await resendOtp({ email, role: persona === 'doctor' ? 'doctor' : 'user' })
      setCooldown(60)
      const t = setInterval(()=>{
        setCooldown(c => {
          if (c <= 1) { clearInterval(t); return 0 }
          return c - 1
        })
      }, 1000)
    }catch(err){
      setError(err.message || 'Please wait before requesting a new OTP')
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f4ff] flex items-start pt-8 justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
        <h1 className="text-lg font-bold mb-1">Verification</h1>
        <p className="text-xs text-gray-500 mb-4">Enter the OTP sent to your phone/email</p>
        <div className="flex gap-3 justify-center mb-4" onPaste={handlePaste}>
          {code.map((v,i)=>(
            <input
              key={i}
              ref={el => inputsRef.current[i] = el}
              value={v}
              maxLength={1}
              onChange={e=>handleChange(i, e.target.value)}
              onKeyDown={e=>handleKeyDown(i, e)}
              className="w-10 h-10 text-center border rounded-md"
              inputMode="numeric"
              pattern="\\d*"
              autoComplete="one-time-code"
              autoFocus={i===0}
            />
          ))}
        </div>
        {error && <div className="text-red-600 text-sm mb-2 text-center">{error}</div>}
        <button onClick={handleVerify} disabled={submitting} className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50">{submitting ? 'Verifying…' : 'Continue'}</button>
        <div className="mt-3 text-center text-sm">
          <button onClick={handleResend} disabled={cooldown>0} className="text-blue-600 disabled:text-gray-400">
            {cooldown>0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}


