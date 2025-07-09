'use client';

import { useState,useRef,useEffect} from 'react';
import { Brain, Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/app/lib/SupabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const EmailRef = useRef("")
  const PasswordRef = useRef("")
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Function to Check user is logged in 
  const checkUserIsLoggedIn = async()=>{
    const {data,error} = await supabase.auth.getSession()
    if (data.session){
      router.push('/')
    }
  }

  useEffect(()=>{
    checkUserIsLoggedIn()
  },[])

  // Function to Handle Google Signin
  const handleGoogleSignin = async()=>{
    const {data,error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback'
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setErrorMessage('');
    
    // Validate inputs
    const email = EmailRef.current.value.trim();
    const password = PasswordRef.current.value.trim();
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('🔍 Attempting sign in...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Please verify your email address before signing in.');
        } else if (error.message.includes('Too many requests')) {
          setErrorMessage('Too many login attempts. Please try again later.');
        } else {
          setErrorMessage(error.message || 'Sign in failed. Please try again.');
        }
        return;
      }
      
      if (data.user) {
        console.log('✅ Sign in successful:', data.user.email);
        
        // Check if email is verified
        if (!data.user.email_confirmed_at) {
          setErrorMessage('Please verify your email address before signing in.');
          return;
        }
        
        // Success - redirect to home page or dashboard
        alert('Welcome back! You have successfully signed in.');
        router.push('/');
      }
      
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-colorful relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/15 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-blue-500/20 to-cyan-500/15 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-violet-500/15 to-purple-500/10 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/15 rounded-full blur-xl sm:blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-pink-500/15 to-rose-500/10 rounded-full blur-xl sm:blur-2xl"></div>
      </div>

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/"
          className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300 elegant-hover"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <Brain className="h-12 w-12 sm:h-16 sm:w-16 text-purple-400 float-animation" />
                <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl glow-pulse"></div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gradient-primary gradient-animate text-shadow-soft">
                Parafyze
              </h1>
            </div>
            
            <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 sm:px-8 sm:py-4 mb-6 shadow-soft border border-purple-500/30">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
              <span className="text-xs sm:text-sm font-semibold text-purple-300">Welcome Back</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-shadow">
              Sign In to Your Account
            </h2>
            <p className="text-lg text-gray-300 text-shadow-soft">
              Continue your AI paraphrasing journey
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-beautiful border border-purple-500/40 p-6 sm:p-8 card-hover">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-3 text-shadow-soft">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 border border-purple-400/50 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base shadow-soft transition-all duration-300 hover:shadow-md bg-black/50 focus-primary placeholder-gray-400"
                    required
                    disabled={isLoading}
                    ref={EmailRef}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-3 text-shadow-soft">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 border border-purple-400/50 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base shadow-soft transition-all duration-300 hover:shadow-md bg-black/50 focus-primary placeholder-gray-400"
                    required
                    disabled={isLoading}
                    ref={PasswordRef}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
               
                <Link
                  href="/auth/forgetpassword"
                  className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-beautiful hover:shadow-glow transform hover:scale-105 text-base"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-4 text-sm text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Social Login Options */}
            <div className="space-y-3">
              <button onClick={handleGoogleSignin} className="w-full bg-black/50 border border-purple-400/50 text-white font-medium py-3 px-6 rounded-xl hover:bg-black/70 transition-all duration-300 flex items-center justify-center space-x-3 shadow-soft hover:shadow-md elegant-hover">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
