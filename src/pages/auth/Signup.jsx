import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/authAPI'
import useAuthStore from '../../stores/useAuthStore'

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
      
      const persona = JSON.parse(localStorage.getItem('auth-store'))?.state?.onboarding?.persona || 'patient'
      const role = persona === 'doctor' ? 'doctor' : 'patient'
      await registerUser({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password, role })
      setOnboarding({ email: form.email, phone: form.phone })
      navigate('/auth/otp')
    } catch(err){
      setError(err.message || 'Failed to send OTP')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Purple header bar */}
      <div className="w-full h-2 bg-purple-500"></div>
      
      {/* Logo section */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="text-black font-semibold text-lg">octar</span>
        </div>
      </div>

      {/* Form section */}
      <div className="px-6">
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
  )
}
