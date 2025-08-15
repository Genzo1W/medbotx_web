import React, { useState, useEffect } from 'react'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const [step, setStep] = useState('email') // 'email', 'otp', 'success'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [resendAttempts, setResendAttempts] = useState(0)
  
  // Validation states
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Mock user data for demo
  const mockUsers = [
    {
      email: 'doctor@hospital.com',
      password: 'password123',
      name: 'Dr. Sarah Johnson',
      role: 'Doctor',
      specialty: 'Cardiology'
    },
    {
      email: 'admin@hospital.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'Administrator',
      specialty: 'Management'
    }
  ]

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return null
  }

  const validatePassword = (password) => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return null
  }

  const validateOTP = (otp) => {
    if (!otp) return 'OTP is required'
    if (otp.length !== 6) return 'OTP must be 6 digits'
    if (!/^\d{6}$/.test(otp)) return 'OTP must contain only numbers'
    return null
  }

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        return validateEmail(value)
      case 'password':
        return validatePassword(value)
      case 'otp':
        return validateOTP(value)
      default:
        return null
    }
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, getFieldValue(field))
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const getFieldValue = (field) => {
    switch (field) {
      case 'email': return email
      case 'password': return password
      case 'otp': return otp
      default: return ''
    }
  }

  const getFieldError = (field) => {
    if (!touched[field]) return null
    return errors[field]
  }

  const isFormValid = () => {
    if (step === 'email') {
      return email && password && !getFieldError('email') && !getFieldError('password')
    }
    if (step === 'otp') {
      return otp && !getFieldError('otp')
    }
    return false
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError })
      setTouched({ email: true, password: true })
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user exists
      const user = mockUsers.find(u => u.email === email && u.password === password)
      
      if (user) {
        // Simulate OTP generation
        console.log('OTP sent to:', email)
        setStep('otp')
        setCountdown(30) // 30 seconds countdown
        setResendAttempts(0)
      } else {
        setErrors({ general: 'Invalid email or password' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    
    const otpError = validateOTP(otp)
    if (otpError) {
      setErrors({ otp: otpError })
      setTouched({ otp: true })
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6 && /^\d{6}$/.test(otp)) {
        const user = mockUsers.find(u => u.email === email)
        const token = 'mock-jwt-token-' + Date.now()
        
        login(user, token)
        setStep('success')
        
        // Redirect after success animation
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again.' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0 || resendAttempts >= 3) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCountdown(30)
      setResendAttempts(prev => prev + 1)
      setOtp('')
      setErrors({})
    } catch (error) {
      setErrors({ general: 'Failed to resend OTP. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setOtp('')
    setErrors({})
    setCountdown(0)
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 to-primary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
            <p className="text-gray-600 mb-6">Welcome back to MedBotX</p>
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-primary-600 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-primary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-medical-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 'email' ? 'Welcome Back' : 'Verify OTP'}
            </h1>
            <p className="text-gray-600">
              {step === 'email' 
                ? 'Sign in to your MedBotX account' 
                : `We've sent a 6-digit code to ${email}`
              }
            </p>
          </div>

          {/* Error Messages */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{errors.general}</span>
            </div>
          )}

          {/* Email/Password Form */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                      getFieldError('email') 
                        ? 'border-red-300 focus:border-red-300' 
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {getFieldError('email') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                      getFieldError('password') 
                        ? 'border-red-300 focus:border-red-300' 
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {getFieldError('password') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isFormValid() && !isLoading
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Continue'
                )}
              </button>
            </form>
          )}

          {/* OTP Form */}
          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit OTP
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onBlur={() => handleBlur('otp')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                      getFieldError('otp') 
                        ? 'border-red-300 focus:border-red-300' 
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                {getFieldError('otp') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('otp')}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isFormValid() && !isLoading
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || resendAttempts >= 3 || isLoading}
                  className={`text-sm transition-colors ${
                    countdown > 0 || resendAttempts >= 3 || isLoading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-primary-600 hover:text-primary-700'
                  }`}
                >
                  {countdown > 0 
                    ? `Resend OTP in ${countdown}s`
                    : resendAttempts >= 3
                    ? 'Maximum resend attempts reached'
                    : 'Resend OTP'
                  }
                </button>
              </div>

              {/* Back to email */}
              <button
                type="button"
                onClick={handleBackToEmail}
                className="w-full flex items-center justify-center space-x-2 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to email</span>
              </button>
            </form>
          )}

          {/* Demo Credentials */}
          {step === 'email' && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p><strong>Doctor:</strong> doctor@hospital.com / password123</p>
                <p><strong>Admin:</strong> admin@hospital.com / admin123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login 