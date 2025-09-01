import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { verifyOtp, resendOtp, sendOtp } from '../../services/authAPI'
import { setOnboarding } from '../../stores/authSlice'
import ProgressBar from '../../components/auth/ProgressBar'

export default function Otp(){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { email, otpSent } = useSelector((state) => state.auth.onboarding)
  const [code, setCode] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [otpSentStatus, setOtpSentStatus] = useState('')
  const inputsRef = useRef([])

  const startCooldown = useCallback(() => {
    setCooldown(60)
    const t = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) {
          clearInterval(t)
          return 0
        }
        return c - 1
      })
    }, 1000)

    // Return cleanup function
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!email) return

    let cleanupInterval = null

    const key = `otpSent:${email}`

    // If OTP was already sent from signup, just start cooldown
    if (otpSent || sessionStorage.getItem(key) === '1') {
      setOtpSentStatus('OTP sent successfully! Please check your email.')
      cleanupInterval = startCooldown()
      return
    }

    // Otherwise, try to send OTP
    setOtpSentStatus('Sending OTP...')
    sendOtp({ email }).then(() => {
      sessionStorage.setItem(key, '1')
      setOtpSentStatus('OTP sent successfully! Please check your email.')
      cleanupInterval = startCooldown()
    }).catch((err) => {
      setOtpSentStatus('Failed to send OTP. Please try resending.')
      console.error('Failed to send OTP:', err)
    })

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (cleanupInterval) {
        cleanupInterval()
      }
    }
  }, [email, otpSent, startCooldown])

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
      await verifyOtp({ email, otp: code.join(''), role: 'pending' })
      dispatch(setOnboarding({ otpVerified: true }))
      navigate('/auth/role-selection')
    }catch(err){
      setError(err.message || 'Invalid OTP')
    }finally{
      setSubmitting(false)
    }
  }

  async function handleResend(){
    if (cooldown > 0) return
    setError('')
    setOtpSentStatus('Sending OTP...')
    try{
      await resendOtp({ email, role: 'pending' })
      setOtpSentStatus('OTP sent successfully! Please check your email.')
      startCooldown()
    }catch(err){
      setError(err.message || 'Please wait before requesting a new OTP')
      setOtpSentStatus('Failed to send OTP. Please try again.')
    }
  }

  const steps = ['Sign Up', 'Verify OTP', 'Role Selection', 'Complete Profile']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <ProgressBar 
        currentStep={2} 
        totalSteps={steps.length} 
        steps={steps} 
      />
      
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
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification</h1>
          <p className="text-sm text-gray-600 mb-4">Please enter the O.T.P. sent to your email: {email}</p>
          
          {/* OTP Status Message */}
          {otpSentStatus && (
            <div className={`text-sm p-3 rounded-lg mb-4 ${
              otpSentStatus.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : otpSentStatus.includes('Failed')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {otpSentStatus}
            </div>
          )}

          {/* Development Mode Notice */}
          {import.meta.env.DEV && (
            <div className="text-xs p-3 rounded-lg mb-4 bg-yellow-50 text-yellow-700 border border-yellow-200">
              <strong>Development Mode:</strong> If you don't receive an email, check the browser console or server logs for your OTP code.
            </div>
          )}
          
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
