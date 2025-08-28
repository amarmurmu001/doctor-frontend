import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyOtp, resendOtp, sendOtp } from '../../services/authAPI'
import useAuthStore from '../../stores/useAuthStore'

export default function Otp(){
  const navigate = useNavigate()
  const { email, persona } = useAuthStore(s => s.onboarding)
  const setOnboarding = useAuthStore(s => s.setOnboarding)
  const [code, setCode] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputsRef = useRef([])

  function startCooldown(){
    setCooldown(60)
    const t = setInterval(()=>{
      setCooldown(c => {
        if (c <= 1) { clearInterval(t); return 0 }
        return c - 1
      })
    }, 1000)
  }

  useEffect(() => {
    // trigger initial OTP send
    if (!email) return
    const key = `otpSent:${email}`
    if (sessionStorage.getItem(key) === '1') return
    sendOtp({ email }).then(() => {
      sessionStorage.setItem(key, '1')
      startCooldown()
    }).catch(()=>{})
  }, [email])

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
      startCooldown()
    }catch(err){
      setError(err.message || 'Please wait before requesting a new OTP')
    }
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

      {/* Form section */}
      <div className="px-6">
        <div className="w-full bg-white rounded-t-3xl p-6 -mt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification</h1>
          <p className="text-sm text-gray-600 mb-8">Please enter the O.T.P. sent to the entered Mobile number i.e +91XXXXXXXXXX</p>
          
          {/* OTP Input Section */}
          <div className="flex gap-4 justify-center mb-8" onPaste={handlePaste}>
            {code.map((v,i)=>(
              <input
                key={i}
                ref={el => inputsRef.current[i] = el}
                value={v}
                maxLength={1}
                onChange={e=>handleChange(i, e.target.value)}
                onKeyDown={e=>handleKeyDown(i, e)}
                className={`w-16 h-16 text-center text-xl font-semibold border-2 rounded-xl focus:outline-none transition-colors ${
                  v ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-200 bg-white'
                } focus:border-purple-500 focus:bg-purple-50`}
                inputMode="numeric"
                pattern="\\d*"
                autoComplete="one-time-code"
                autoFocus={i===0}
              />
            ))}
          </div>

          {/* Error message */}
          {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}
          
          {/* Continue button */}
          <div className="mb-6">
            <button 
              onClick={handleVerify} 
              disabled={submitting} 
              className="w-full bg-black text-white py-4 rounded-full font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              {submitting ? 'Verifying…' : 'Continue'}
            </button>
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            <button 
              onClick={handleResend} 
              disabled={cooldown>0} 
              className="text-purple-600 text-sm font-medium disabled:text-gray-400 hover:text-purple-700 transition-colors"
            >
              {cooldown>0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
