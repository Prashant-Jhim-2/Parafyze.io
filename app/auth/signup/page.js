'use client';

import { Brain, Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, User, Check } from 'lucide-react';
import Link from 'next/link';
import { useState ,useRef,useEffect} from 'react';
import { Mails } from 'lucide-react';
import zxcvbn from 'zxcvbn';
import { supabase } from '@/app/lib/SupabaseClient';
import { EmailSignup ,checkEmail} from '@/app/lib/authService';
import validator from 'validator';
import { useRouter } from 'next/navigation';




export default function SignupPage() {

    // States to handle Password and Confirm Password display
    const [ShowPassword,setShowPassword] = useState(false) 
    const [ConfirmPassword,setConfirmPassword] = useState(false) 

    // Error States 
    const [EmailError,setEmailError] = useState(``)

    // States to handle Password Strength 
    const [PasswordStrength,setPasswordStrength] = useState(0)
    const [PasswordStrengthText,setPasswordStrengthText] = useState("")
    const [PasswordStrengthFeedback,setPasswordStrengthFeedback] = useState("Password must be at least 8 characters long")

    // States to handle Password and Confirm Password Match
    const [PasswordAndConfirmPasswordMatch,setPasswordAndConfirmPasswordMatch] = useState(false)

    // States to handle Form Data
    const FullNameRef = useRef("")
    const EmailRef = useRef("")
    const PasswordRef = useRef("")
    const ConfirmPasswordRef = useRef('')
    const [AgreeToTerms,setAgreeToTerms] = useState(false)
    const [Newsletter,setNewsletter] = useState(false)

    // States for loading
    const [isLoading, setIsLoading] = useState(false)

    // Router 
    const router = useRouter()

    // Function To Check if Email is already in use 
    const checkEmailinUse = async (email) =>{
   
      

      const isvalid = validator.isEmail(email)
      if (! isvalid){
        EmailRef.current.style.color = 'red'
        
       
        setEmailError("Email is not valid please try again")
        setTimeout(()=>{
         setEmailError("")
         if (email == ''){
          EmailRef.current.style.color = 'black'
         }
        },1000)
        
        return {status:false}
      }
      if (isvalid){
        const {exists,verified} = await checkEmail(email)
        console.log(exists,verified)
        if (exists && verified){
          EmailRef.current.style.color = 'red'
          setEmailError("Email is not valid please try again")
          
          return {status:false}
        }
        if (! exists && ! verified){
          setEmailError("")
          EmailRef.current.style.color = 'black'
          return {status:true}
        } 
        if (exists && !verified){
          setEmailError("")
          EmailRef.current.style.color = 'black'
          return {status:true}
        }
      }
      
  }

  // Function to Check user is logged in 
  const checkUserIsLoggedIn = async()=>{
    const {data,error} = await supabase.auth.getSession()
    if (data.session){
       router.push('/')
    }
  }

  // Function to Handle Google Signin
  const handleGoogleSignin = async()=>{
    const {data,error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback'
      }
    })
  }

  useEffect(()=>{
    checkUserIsLoggedIn()
  },[])

    // Function to Check Password Strength
    const checkPasswordStrength = (password) =>{
        const result = zxcvbn(password)
       
        setPasswordStrength(result.score) 
       setPasswordStrengthFeedback(result.feedback.suggestions.join(", ")) 
       if (result.score === 0){
        setPasswordStrengthText("Very Weak")
       }else if (result.score === 1){
        setPasswordStrengthText("Weak")
       }else if (result.score === 2){
        setPasswordStrengthText("Medium")
       }else if (result.score === 3){
        setPasswordStrengthText("Strong")
       }else if (result.score === 4){
        setPasswordStrengthText("Very Strong")
       }

        
    }

    

    // Function to Check if Password and Confirm Password are the same
    const checkPasswordAndConfirmPassword = () =>{
        if (PasswordRef.current.value === ConfirmPasswordRef.current.value){
            setPasswordAndConfirmPasswordMatch(true)
        }else{
            setPasswordAndConfirmPasswordMatch(false)
        }
       
    }

    const handlesignup = async (e) => {
        e.preventDefault()
        
        console.log('🔍 Signup process starting...')
        
        try {
            // Validate email
            const emailValidation = await checkEmailinUse(EmailRef.current.value)
            console.log(emailValidation)
            if (!emailValidation.status) {
                alert("Email is not valid please try again")
                return
            }
            
            
           
        
            
            // Prepare user data
            const userData = {
                full_name: FullNameRef.current.value,
                email: EmailRef.current.value,
                password: PasswordRef.current.value,
                agree_to_terms: AgreeToTerms,
                newsletter: Newsletter,
            }
            console.log(userData)
            
           
            
            // Call EmailSignup
            console.log('🔍 Calling EmailSignup...')
            const {success, message, requiresConfirmation, user} = await EmailSignup(userData)
            
            console.log('📊 EmailSignup response:', { success, message, requiresConfirmation, user })
            
            if (success) {
               alert("Please check your email for verification")
                FullNameRef.current.value = ''
                EmailRef.current.value = ''
                PasswordRef.current.value = ''
                ConfirmPasswordRef.current.value = ''
                setAgreeToTerms(false)
                setNewsletter(false)
                setShowPassword(false)
            } else {
                console.log('❌ Signup failed:', message)
                alert(message)
            }
        } catch (error) {
            console.error('💥 Signup error:', error)
            alert('An error occurred during signup. Please try again.')
        }
    }
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
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="w-full max-w-lg">
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
              <span className="text-xs sm:text-sm font-semibold text-purple-300">Join Parafyze</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-shadow">
              Create Your Account
            </h2>
            <p className="text-lg text-gray-300 text-shadow-soft">
              Start your AI paraphrasing journey today
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-beautiful border border-purple-500/40 p-6 sm:p-8 ">
            <form className="space-y-6" onSubmit={handlesignup}>
              {/* Name Fields */}
              <div className="flex flex-col w-full ">
                <div>
                  <label htmlFor="FullName" className="block text-sm font-semibold text-gray-200 mb-3 text-shadow-soft">
                    FullName
                  </label>
                  <div className="relative w-full ">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-purple-400" />
                    </div>
                    <input
                      id="FullName"
                      ref={FullNameRef}
                      name="FullName"
                      type="text"
                      placeholder="Enter The Full name"
                      className="w-full pl-12 pr-4 py-4 border border-purple-400/50 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base shadow-soft transition-all duration-300 hover:shadow-md bg-black/50 focus-primary placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
                
                
              </div>

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
                    ref={EmailRef}
                    name="email"
                    type="email"
                    onChange = { async(e)=>{
                      const email = e.target.value 
                      const status = await checkEmailinUse(email)
                      console.log(status)
                    }}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 border border-purple-400/50 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base shadow-soft transition-all duration-300 hover:shadow-md bg-black/50 focus-primary placeholder-gray-400"
                    required
                  />
                </div>
                <label className="text-red-400 gap-2 mt-2 ml-4 flex items-center space-x-2 text-sm">{EmailError}</label>
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
                    ref={PasswordRef}
                    name="password"
                    onChange={(e)=>{checkPasswordStrength(e.target.value)}}
                    type= {ShowPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full pl-12 pr-12 py-4 border border-purple-400/50 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base shadow-soft transition-all duration-300 hover:shadow-md bg-black/50 focus-primary placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick = {()=>{setShowPassword(!ShowPassword)}}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    {ShowPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                 <>
                    <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-400 mt-2">Password Strength: <span className={`${PasswordStrength >= 3 ? "text-green-400" : "text-red-400"} font-bold`}>{PasswordStrengthText}</span></p>
                  </div>  
                <p className="text-xs text-gray-400 mt-2">{PasswordStrengthFeedback}</p>
                </>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-200 mb-3 text-shadow-soft">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    ref={ConfirmPasswordRef}
                    name="confirmPassword"
                    onChange = {(e)=>{
                        checkPasswordAndConfirmPassword()
                    }}
                    type= {ConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-12 py-4 border border-purple-400/50 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base shadow-soft transition-all duration-300 hover:shadow-md bg-black/50 focus-primary placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                   onClick = {()=>{setConfirmPassword(!ConfirmPassword)}}
                    
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    {ConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                 <>
                    <p className="text-xs text-gray-400 mt-2">Password Match: <span className={`${PasswordAndConfirmPasswordMatch ? "text-green-400" : "text-red-400"} font-bold`}>{PasswordAndConfirmPasswordMatch ? "Passwords Match" : "Passwords Do Not Match"}</span></p>
                 </>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={AgreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-purple-400 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                  />
                  <span className="text-sm text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-purple-400 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                  />
                  <span className="text-sm text-gray-300">
                    I want to receive updates about new features and AI paraphrasing tips
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-beautiful hover:shadow-glow transform hover:scale-105 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-4 text-sm text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Social Signup Options */}
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

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-black/30 backdrop-blur-sm rounded-xl shadow-soft border border-purple-500/30">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">AI-Powered</h3>
              <p className="text-xs text-gray-300">Advanced AI technology</p>
            </div>
            <div className="text-center p-4 bg-black/30 backdrop-blur-sm rounded-xl shadow-soft border border-cyan-500/30">
              <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
                <Check className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">Free to Start</h3>
              <p className="text-xs text-gray-300">No credit card required</p>
            </div>
            <div className="text-center p-4 bg-black/30 backdrop-blur-sm rounded-xl shadow-soft border border-pink-500/30">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">Instant Access</h3>
              <p className="text-xs text-gray-300">Start paraphrasing immediately</p>
            </div>
          </div>
                </div>
      </div>
    </div>
  );
}
