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
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-beautiful border border-indigo-100/40 p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-10 w-10 text-indigo-600" />
              <h1 className="text-xl font-bold text-indigo-600">Parafyze</h1>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-4">
              We've sent a password reset link to <span className="font-semibold">{email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Click the link in your email to reset your password. The link will expire in 1 hour.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail(''); // Clear email when going back
              }}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors duration-300"
            >
              Send Another Email
            </button>
            
            <Link
              href="/auth/login"
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center space-x-2"
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
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-beautiful border border-indigo-100/40 p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="h-10 w-10 text-indigo-600" />
            <h1 className="text-xl font-bold text-indigo-600">Parafyze</h1>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-indigo-500" />
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
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black text-base shadow-soft transition-all duration-300 hover:shadow-md bg-white/80 ${
                  email && !isEmailValid
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-indigo-200'
                }`}
                required
                disabled={isLoading}
              />
            </div>
            {email && !isEmailValid && (
              <p className="text-red-600 text-sm mt-1">Please enter a valid email address</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isEmailValid}
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
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
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 