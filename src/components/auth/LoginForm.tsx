import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Mail, Lock, Eye, EyeOff, User, Phone, GraduationCap } from 'lucide-react'

interface LoginFormProps {
  onToggleMode: () => void
  isSignUp: boolean
  onLogin: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, isSignUp, onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [currentSchool, setCurrentSchool] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      // Demo login - accept any email/password combination
      if (email && password) {
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000))
        onLogin()
        return
      }

      throw new Error('Please enter both email and password')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
      {/* Sidebar with Portal Info */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/3 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src="/logotransferringup.png" 
                alt="Transferring Up Logo" 
                className="h-16 w-16 rounded-xl shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold font-display"><span className="text-cream-400">Transferring</span> <span className="text-crimson-300">Up</span></h1>
                <p className="text-red-100">Client Portal</p>
              </div>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Your Transfer Journey, <span className="text-red-200">Organized</span>
            </h2>
            
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Track applications, manage documents, communicate with consultants, and stay on top of deadlines - all in one place.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-red-100">🚀 Portal Features Coming Soon:</h3>
              <ul className="space-y-3 text-red-50">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-200 rounded-full"></div>
                  <span>Application tracking & deadlines</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-200 rounded-full"></div>
                  <span>Document management & essay reviews</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-200 rounded-full"></div>
                  <span>Direct messaging with consultants</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-200 rounded-full"></div>
                  <span>Task management & progress tracking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-200 rounded-full"></div>
                  <span>Meeting scheduling & calendar integration</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-red-100">📞 For Now, Contact Us Directly:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">📧</span>
                  </div>
                  <div>
                    <p className="font-semibold">Ajay Sharma</p>
                    <a href="mailto:as4489@cornell.edu" className="text-red-200 hover:text-white transition-colors">
                      as4489@cornell.edu
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">📱</span>
                  </div>
                  <div>
                    <p className="font-semibold">Call or Text</p>
                    <a href="tel:+19802489218" className="text-red-200 hover:text-white transition-colors">
                      (980) 248-9218
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
      </div>

      {/* Login Form */}
      <div className="flex-1 lg:w-1/2 xl:w-1/3 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4 lg:hidden">
                <img 
                  src="/logotransferringup.png" 
                  alt="Transferring Up Logo" 
                  className="h-12 w-12 rounded-xl"
                />
                <span className="text-2xl font-bold text-gray-900">Client Portal</span>
              </div>
              <div className="hidden lg:block mb-4">
                <span className="text-2xl font-bold text-gray-900">Client Portal</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {isSignUp 
                  ? 'Join Transferring Up to manage your transfer journey' 
                  : 'Sign in to access your transfer dashboard'
                }
              </p>
            </div>

            {/* Mobile Contact Info */}
            <div className="lg:hidden bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-red-900 mb-3">Portal Coming Soon!</h4>
              <p className="text-red-800 text-sm mb-3">
                For now, contact us directly to manage your transfer application:
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Ajay:</span>{' '}
                  <a href="mailto:as4489@cornell.edu" className="text-red-600 hover:underline">
                    as4489@cornell.edu
                  </a>
                </div>
                <div>
                  <span className="font-medium">Phone:</span>{' '}
                  <a href="tel:+19802489218" className="text-red-600 hover:underline">
                    (980) 248-9218
                  </a>
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm">{message}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <GraduationCap className="h-4 w-4 inline mr-2" />
                      Current School (Optional)
                    </label>
                    <input
                      type="text"
                      value={currentSchool}
                      onChange={(e) => setCurrentSchool(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., UNCG, Community College"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                    placeholder="Enter your password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <button
                onClick={onToggleMode}
                className="text-red-600 hover:text-red-700 transition-colors text-sm"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            {/* Back to Main Site */}
            <div className="mt-4 text-center">
              <a 
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                ← Back to main site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm