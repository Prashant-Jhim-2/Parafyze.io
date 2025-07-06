'use client';

import { useState,useRef } from 'react';
import { Brain, Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/SupabaseClient';
import { useEffect } from 'react';
import zxcvbn from 'zxcvbn';

export default function AuthCallback() {
  const [needPassword, setNeedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const password = useRef("")
  const confirmPassword = useRef("")
  const [isLoading, setIsLoading] = useState(false);
  const [PasswordIsOk,setPasswordIsOk] = useState(false)
  const [error, setError] = useState('');
  const router = useRouter();

  // States for storing user data 
  const [userid,setUserid] = useState(undefined)

 

  // Function to Check User need password or not 
  const checkUserNeedPassword = async()=>{
    const {data,error} = await supabase.auth.getSession()
    const user = data.session.user 
    console.log(user)
    const hasPasswordSet = user.user_metadata.password_set
    const hasEmailIdent = user.identities.some(identity=>identity.provider == "email") 
    if (hasEmailIdent || hasPasswordSet){
        setNeedPassword(false)
        setTimeout(()=>{
            router.push('/')
        },2000)
    }
    else{
        setNeedPassword(true)
        setUserid(user.id)
    }

  }

  // Function to Check Password is Strong or not 
  const checkPasswordStrength = (password)=>{
    const result = zxcvbn(password)
    if (result.score >= 3){
      return true
    }
    else{
      return false
    }
  }
 // Function to handle password change 
 const handlePasswordChange = async()=>{
    const check1 = checkPasswordStrength(password.current.value)
    const check2 = password.current.value === confirmPassword.current.value
    if (check1 && check2){
      setPasswordIsOk(true)
    }
    else{
      setPasswordIsOk(false)
    }
 }

  // Function to Handle Password Submit 
  const handlePasswordSubmit = async(e)=>{
    e.preventDefault()
    setIsLoading(true)
    const check1 = checkPasswordStrength(password.current.value)
    const check2 = password.current.value === confirmPassword.current.value
    if (check1 && check2){
      const {data,error} = await supabase.auth.updateUser({
        password: password.current.value,
        data:{
            password_set:true,
        }
      })
      if (error){
        setError(error.message)
      }
      else{
        
        setError("Password set successfully")
      }
    }
    else{
      setError("Password is not strong or not match")
    }
    setIsLoading(false)
    
  }

  useEffect(()=>{
    checkUserNeedPassword()
  },[])

  if (needPassword) {
    return (
      <div className="min-h-screen bg-gradient-colorful flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-beautiful border border-indigo-100/40 p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-10 w-10 text-indigo-600" />
              <h1 className="text-xl font-bold text-indigo-600">Parafyze</h1>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Set Your Password</h2>
            <p className="text-gray-600">Create a password for your account</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  ref={password}
                  onChange = {(e)=>{
                    handlePasswordChange()
                    console.log(e.target.value) 
                  }}
                 
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border border-indigo-200 text-black rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base shadow-soft transition-all duration-300 hover:shadow-md bg-white/80"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-500 hover:text-indigo-600 transition-colors duration-300"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  ref={confirmPassword}
                  onChange = {(e)=>{
                    handlePasswordChange()
                    console.log(e.target.value) 
                  }}
                  
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3 border border-indigo-200 text-black rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base shadow-soft transition-all duration-300 hover:shadow-md bg-white/80"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              onClick={handlePasswordSubmit}
              disabled={isLoading || !PasswordIsOk}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Setting Password...</span>
                </>
              ) : (
                <span>Set Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-colorful flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Brain className="h-12 w-12 text-indigo-600" />
          <h1 className="text-2xl font-bold text-indigo-600">Parafyze</h1>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
} 