import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { registerUser, sendOtp } from '../../services/authAPI'
import useAuthStore from '../../stores/useAuthStore'
import ProgressBar from '../../components/auth/ProgressBar'

export default function Signup() {
  const navigate = useNavigate()
  const setOnboarding = useAuthStore(s => s.setOnboarding)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // Register user without role (will be selected after OTP)
      await registerUser({ 
        fullName: form.fullName, 
        email: form.email, 
        phone: form.phone, 
        password: form.password,
        role: 'pending' // Temporary role until user selects
      })
      
      // Immediately send OTP after successful registration
      console.log('Sending OTP to:', form.email)
      await sendOtp({ email: form.email })
      console.log('OTP sent successfully')
      
      // Store basic info for post-OTP flow and mark that OTP was sent
      setOnboarding({ 
        email: form.email, 
        phone: form.phone,
        basicInfo: form,
        otpSent: true
      })
      
      // Set session storage to prevent duplicate OTP sends
      const key = `otpSent:${form.email}`
      sessionStorage.setItem(key, '1')
      
      navigate('/auth/otp')
    } catch(err){
      setError(err.message || 'Failed to register user or send OTP')
    } finally {
      setSubmitting(false)
    }
  }

  const steps = ['Sign Up', 'Verify OTP', 'Role Selection', 'Complete Profile']

  return (
    <>
      <Helmet defer={false}>
        <title>Patient Sign Up | Create Your Doctar Account</title>
        <meta name="description" content="Sign up on Doctar to book doctor appointments online, consult with specialists, manage health records, and access personalized healthcare services. Quick and easy patient registration." />
        <meta name="keywords" content="patient sign up, doctar sign up, healthcare registration, create patient account, book doctor online, online doctor consultation signup, patient registration portal, doctar account create, join doctar" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.doctar.in/auth/signup" />
        <meta property="og:title" content="Patient Sign Up | Create Your Doctar Account" />
        <meta property="og:description" content="Sign up on Doctar to book doctor appointments online, consult with specialists, manage health records, and access personalized healthcare services. Quick and easy patient registration." />
        <meta property="og:url" content="https://www.doctar.in/auth/signup" />
        <meta name="twitter:title" content="Patient Sign Up | Create Your Doctar Account" />
        <meta name="twitter:description" content="Sign up on Doctar to book doctor appointments online, consult with specialists, manage health records, and access personalized healthcare services. Quick and easy patient registration." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <ProgressBar 
        currentStep={1} 
        totalSteps={steps.length} 
        steps={steps} 
      />
      
      {/* Logo section */}
      <div className="px-6 py-6">
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
          <form onSubmit={handleSubmit} className="w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration</h1>
          <p className="text-sm text-gray-600 mb-8">Please enter your registration details name, email and phone</p>
          
          <div className="space-y-6">
            {/* Name field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Name*</label>
              <input 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none" 
                placeholder="Full name" 
                value={form.fullName} 
                onChange={e=>setForm({...form, fullName:e.target.value})}
                required
              />
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email*</label>
              <input 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none" 
                type="email" 
                placeholder="Example@domain" 
                value={form.email} 
                onChange={e=>setForm({...form, email:e.target.value})}
                required
              />
            </div>

            {/* Phone field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Phone no.*</label>
              <input 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none" 
                placeholder="+91 xxxxx xxxxx" 
                value={form.phone} 
                onChange={e=>setForm({...form, phone:e.target.value})}
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Password*</label>
              <input 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none" 
                type="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={e=>setForm({...form, password:e.target.value})}
                required
              />
            </div>
          </div>

          {/* Error message */}
          {error && <div className="text-red-600 text-sm mt-4 px-1">{error}</div>}
          
          {/* Submit button */}
          <div className="mt-8 mb-8">
            <button 
              disabled={submitting} 
              className="w-full bg-black text-white py-4 rounded-full font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              {submitting ? 'Registering…' : 'Next'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
