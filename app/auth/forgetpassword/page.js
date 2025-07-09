'use client';

import { useState, useRef } from 'react';
import { Brain, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/app/lib/SupabaseClient';
import validator from 'validator';

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const isValid = await validateEmail(email);
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    
    if (isValid) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/passwordchange'
      });
      
      console.log(data);
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      
      if (data) {
        setIsLoading(false);
        setIsSubmitted(true);
        setEmail(''); // Clear the email state
      }
    }
  };

  const validateEmail = async (emailValue) => {
    const isValid = validator.isEmail(emailValue);
    
    if (!isValid) {
      setIsEmailValid(false);
      return false;
    }
    
    // For now, just check if email is valid format
    // You can add additional checks here if needed
    setIsEmailValid(true);
    return true;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-colorful flex items-center justify-center">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-beautiful border border-purple-500/40 p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="h-10 w-10 text-purple-400" />
            <h1 className="text-xl font-bold text-purple-400">Parafyze</h1>
          </div>
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Check Your Email</h2>
          <p className="text-gray-300 mb-4">
            We've sent a password reset link to <span className="font-semibold">{email}</span>
          </p>
          <p className="text-sm text-gray-400">
            Click the link in your email to reset your password. The link will expire in 1 hour.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail(''); // Clear email when going back
            }}
            className="w-full bg-gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 transition-colors duration-300"
          >
            Send Another Email
          </button>
          
          <Link
            href="/auth/login"
            className="w-full bg-black/50 border border-purple-400/50 text-white font-semibold py-3 px-6 rounded-xl hover:bg-black/70 transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </Link>
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
          <h2 className="text-lg font-semibold text-white mb-2">Forgot Password?</h2>
          <p className="text-gray-300">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-purple-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                placeholder="Enter your email address"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-base shadow-soft transition-all duration-300 hover:shadow-md bg-black/50 placeholder-gray-400 ${
                  email && !isEmailValid
                    ? 'border-red-400 focus:ring-red-500'
                    : 'border-purple-400/50'
                }`}
                required
                disabled={isLoading}
              />
            </div>
            {email && !isEmailValid && (
              <p className="text-red-400 text-sm mt-1">Please enter a valid email address</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isEmailValid}
            className="w-full bg-gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-600">
          <p className="text-xs text-gray-400 text-center">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 