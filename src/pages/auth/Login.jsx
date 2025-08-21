import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authAPI'
import useAuthStore from '../../stores/authStore'

function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s=>s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e){
    e.preventDefault()
    setLoading(true); setError('')
    try{
      const res = await loginUser({ email: form.email, password: form.password })
      const token = res.token
      const principal = res.user
      if (!token || !principal) throw new Error('Unexpected response')
      setAuth({ user: principal, token })
      navigate('/')
    }catch(err){
      setError(err.message || 'Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#f4f4ff] flex items-center justify-center px-4 py-10">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-2xl shadow p-5">
        <h1 className="text-xl font-bold">Welcome back</h1>
        <p className="text-xs text-gray-500 mb-4">Please enter your credentials to continue</p>

        <input
          className="w-full border rounded-md px-3 py-2 mb-2"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={e=>setForm({...form, email:e.target.value})}
        />
        <input
          className="w-full border rounded-md px-3 py-2 mb-3"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={e=>setForm({...form, password:e.target.value})}
        />

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

        <button disabled={loading} className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50">
          {loading?'Logging in…':'Login'}
        </button>

        <div className="mt-3 flex items-center justify-between text-sm">
          <button type="button" onClick={()=>navigate('/auth/forgot-password')} className="text-blue-600">Forgot password?</button>
          <div>
            <span className="text-gray-600">New here? </span>
            <button type="button" onClick={()=>navigate('/auth/signup')} className="text-blue-600">Register</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login