import { useState } from 'react'
import { loginUser } from '../../services/authAPI'
import useAuthStore from '../../stores/authStore'

function Login() {
  const setAuth = useAuthStore(s=>s.setAuth)
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e){
    e.preventDefault()
    setLoading(true); setError('')
    try{
      const res = await loginUser(form)
      setAuth({ user: res.user, token: res.token })
    }catch(err){
      setError(err.message || 'Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#f4f4ff] flex items-start pt-8 justify-center px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
        <h1 className="text-lg font-bold mb-2">Welcome Back</h1>
        <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Email/Phone" value={form.identifier} onChange={e=>setForm({...form, identifier:e.target.value})} />
        <input type="password" className="w-full border rounded-md px-3 py-2 mb-4" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button disabled={loading} className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50">{loading?'Logging in…':'Login'}</button>
      </form>
    </div>
  )
}

export default Login