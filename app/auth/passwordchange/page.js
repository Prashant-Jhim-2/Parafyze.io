'use client';

import { useState } from 'react';
import { Brain, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import zxcvbn from 'zxcvbn';
import { supabase } from '@/app/lib/SupabaseClient';  

export default function PasswordChange() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  
  // Validate Password
  const validatePassword = async(password)=>{
    const check2 = newPassword === confirmPassword
    const result = zxcvbn(password)
    if (result.score >= 3 && check2){
      return true
    }
    else{
      setError("Password is not invalid")
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const isValid = await validatePassword(newPassword)
    if (!isValid){
      setIsLoading(false)
      return
    }
    if (isValid){
      const {data,error} = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error){
        setError(error.message)
        setIsLoading(false)
        return
      }
      if (data){
        setIsLoading(false)   
        setIsSuccess(true)
      }
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }
    
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
    setPasswordFeedback(result.feedback.warning || result.feedback.suggestions[0] || '');
  };

  // Handle new password change
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    checkPasswordStrength(value);
  };

  // Check if passwords match
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';
  
  // Check if form is valid
  const isFormValid = newPassword && passwordsMatch && passwordStrength >= 3;

  // Get password strength color
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  // Get password strength text
  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Very Weak';
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-colorful flex items-center justify-center">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-beautiful border border-purple-500/40 p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-10 w-10 text-purple-400" />
              <h1 className="text-xl font-bold text-purple-400">Parafyze</h1>
            </div>
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Password Changed Successfully!</h2>
            <p className="text-gray-300">
              Your password has been updated. You can now use your new password to sign in.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="w-full bg-gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <span>Go to Dashboard</span>
            </Link>
            
            <button
              onClick={() => {
                setIsSuccess(false);
                setNewPassword('');
                setConfirmPassword('');
                setPasswordStrength(0);
                setPasswordFeedback('');
              }}
              className="w-full bg-black/50 border border-purple-400/50 text-white font-semibold py-3 px-6 rounded-xl hover:bg-black/70 transition-colors duration-300"
            >
              Change Another Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-colorful flex items-center justify-center">
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-beautiful border border-purple-500/40 p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="h-10 w-10 text-purple-400" />
            <h1 className="text-xl font-bold text-purple-400">Parafyze</h1>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Change Password</h2>
          <p className="text-gray-300">Choose a new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-200 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-400" />
              </div>
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="Enter your new password"
                className="w-full pl-12 pr-12 py-3 border border-purple-400/50 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base shadow-soft transition-all duration-300 hover:shadow-md bg-black/50 placeholder-gray-400"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            
            
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-200 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className={`w-full pl-12 pr-12 py-3 border rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base shadow-soft transition-all duration-300 hover:shadow-md bg-black/50 placeholder-gray-400 ${
                  confirmPassword && !passwordsMatch
                    ? 'border-red-400 focus:ring-red-500'
                    : 'border-purple-400/50'
                }`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-400 text-sm mt-1">Passwords don't match</p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="text-green-400 text-sm mt-1">✓ Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full bg-gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Changing Password...</span>
              </>
            ) : (
              <span>Change Password</span>
            )}
          </button>


        </form>
      </div>
    </div>
  );
} 