import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { loginUser } from '../../services/authAPI'
import useAuthStore from '../../stores/useAuthStore'

function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
    <>
      <Helmet defer={false}>
        <title>Patient Login | Secure Access to Doctar Account</title>
        <meta name="description" content="Login to your Doctar account to book appointments, connect with doctors, manage health records, and access personalized healthcare services. Secure and easy patient login." />
        <meta name="keywords" content="patient login, doctar login, healthcare login, book doctor appointment, patient account access, online doctor consultation login, secure medical login, doctar patient portal, login to book doctor" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.doctar.in/login" />
        <meta property="og:title" content="Patient Login | Secure Access to Doctar Account" />
        <meta property="og:description" content="Login to your Doctar account to book appointments, connect with doctors, manage health records, and access personalized healthcare services. Secure and easy patient login." />
        <meta property="og:url" content="https://www.doctar.in/login" />
        <meta name="twitter:title" content="Patient Login | Secure Access to Doctar Account" />
        <meta name="twitter:description" content="Login to your Doctar account to book appointments, connect with doctors, manage health records, and access personalized healthcare services. Secure and easy patient login." />
      </Helmet>

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
      <div className="px-6 ">
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
              <div className="relative">
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
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
                className="text-purple-600 text-sm z-20 relative font-medium  hover:text-purple-700"
              >
                Get Started
              </button>
            </div>
          </form>
        </div>
        <div className="fixed  bottom-0 right-0 w-full  flex justify-end pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full ">
<img 
                src="/curvy-bg.png" 
                alt="Doctor" 
                className="w-full h-[25vh] object-stretch"
              />
          </div>
        <div className="relative">
          
          <div className="relative w-48 h-56 mb-0 ">
            <div className="w-full h-full absolute bottom-0 ">
              <img 
                src="/doctor-image.png" 
                alt="Doctor" 
                className="w- h-full bottom-0  object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Doctor illustration */}

    </div>
    </>
  )
}

export default Login
