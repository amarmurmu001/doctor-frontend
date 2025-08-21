import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setSubmitting(true)
    setMessage('If an account exists for this email, you will receive reset instructions.')
    setTimeout(()=>setSubmitting(false), 600)
  }

  return (
    <div className="min-h-screen bg-[#f4f4ff] flex items-start pt-8 justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
        <h1 className="text-lg font-bold mb-2">Forgot Password</h1>
        <p className="text-xs text-gray-500 mb-4">Enter your email to reset your password</p>
        <input className="w-full border rounded-md px-3 py-2 mb-4" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        {message && <div className="text-sm text-gray-600 mb-2">{message}</div>}
        <button disabled={!email || submitting} className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50">{submitting ? 'Sending…' : 'Send reset link'}</button>
        <button type="button" onClick={()=>navigate('/login')} className="w-full mt-2 bg-gray-100 text-gray-800 py-2 rounded-md">Back to login</button>
      </form>
    </div>
  )
}


