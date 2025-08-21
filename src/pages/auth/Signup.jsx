import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/authAPI'
import useAuthStore from '../../stores/authStore'

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
      // Read persona from onboarding state and send as role
      const persona = JSON.parse(localStorage.getItem('auth-store'))?.state?.onboarding?.persona || 'patient'
      const role = persona === 'doctor' ? 'doctor' : 'user'
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
    <div className="min-h-screen bg-[#f4f4ff] flex items-start pt-8 justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
        <h1 className="text-lg font-bold mb-2">Registration</h1>
        <p className="text-xs text-gray-500 mb-4">Please enter your details</p>
        <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Full name" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} />
        <input className="w-full border rounded-md px-3 py-2 mb-2" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        <input className="w-full border rounded-md px-3 py-2 mb-4" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button disabled={submitting} className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50">{submitting ? 'Registering…' : 'Next'}</button>
      </form>
    </div>
  )
}


