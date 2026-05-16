import React, { useState } from 'react'
import LoginForm from '../auth/LoginForm'
import Dashboard from './Dashboard'

const ClientPortal: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <LoginForm onToggleMode={toggleMode} isSignUp={isSignUp} onLogin={handleLogin} />
  }

  return <Dashboard />
}

export default ClientPortal