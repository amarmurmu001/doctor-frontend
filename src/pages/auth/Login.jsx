import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authAPI'
import useAuthStore from '../../stores/useAuthStore'

function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await loginUser({ email: form.email, password: form.password })
      
      // Debug: Log the response to see the structure
      console.log('Login Response:', res)
      
      // Handle different response structures
      const token = res?.token || res?.data?.token
      const user = res?.user || res?.data?.user
      
      if (!token || !user) {
        console.error('Invalid response structure:', res)
        throw new Error('Invalid login response - missing token or user data')
      }

      // Call setAuth with correct parameters
      setAuth(user, token) // Updated: pass user and token separately
      
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
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

      {/* Content section */}
      <div className="px-6">
        <div className="w-full bg-white rounded-t-3xl p-6 -mt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Welcome Back</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email or Phone*</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white"
                type="text" // Changed from email to text to allow phone login
                placeholder="Example@domain"
                autoComplete="username"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900">Password*</label>
                <button 
                  type="button" 
                  onClick={() => navigate('/auth/forgot-password')} 
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Forgot ?
                </button>
              </div>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={form.password}
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}

            {/* Login button */}
            <button 
              type="submit"
              disabled={loading || !form.email || !form.password} 
              className="w-full bg-black text-white py-4 rounded-full font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>

            {/* Register link */}
            <div className="text-center">
              <span className="text-gray-600 text-sm">New here ? </span>
              <button 
                type="button" 
                onClick={() => navigate('/auth/signup')} 
                className="text-purple-600 text-sm font-medium hover:text-purple-700"
              >
                Get Started
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Doctor illustration */}
      <div className="fixed bottom-0 right-0 w-full flex justify-end pointer-events-none">
        <div className="relative">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200 rounded-full transform translate-x-20 translate-y-20"></div>
          <div className="relative w-48 h-56 mb-0 mr-8">
            <div className="w-full h-full bg-gradient-to-t from-purple-100 to-transparent rounded-t-full flex items-end justify-center">
              <div className="text-6xl mb-4">👨‍⚕️</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
