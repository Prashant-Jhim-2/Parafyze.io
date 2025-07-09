'use client';

import { useState,useEffect } from 'react';
import { Send, Sparkles, Copy, Check, Loader2, Brain, MessageSquare, Zap, ArrowRight, Play, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { signup } from './lib/authService';
import { supabase } from './lib/SupabaseClient';
import Link from 'next/link';
export default function Home() {
  const [question, setQuestion] = useState('');
  const [FullName,SetFullName] = useState(undefined)
  const [isProcessing, setIsProcessing] = useState(false);
  const [paraphrasedAnswer, setParaphrasedAnswer] = useState('');
  const [copied, setCopied] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // UseEffect to check if user is logged in and listen for auth changes
  useEffect(()=>{
    // Get initial session
    const getInitialSession = async () => {
      const {data,error} = await supabase.auth.getSession()
      const user = data.session?.user 
      if (user){
        console.log('👤 User session found:', user)
        SetFullName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
        setUserEmail(user.email || '')
      } else {
        console.log('👤 No user session found')
        SetFullName(undefined)
        setUserEmail('')
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          SetFullName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User')
          setUserEmail(session.user.email || '')
        } else if (event === 'SIGNED_OUT') {
          SetFullName(undefined)
          setUserEmail('')
          setShowUserMenu(false)
        }
      }
    )

    // Cleanup subscription
    return () => subscription.unsubscribe()
  },[])

    // Function to Logout 
  const Logout = async(e)=>{
    console.log('Logout button clicked')
    console.log('Event:', e)
    console.log('Event target:', e.target)
    
    // Prevent event bubbling to avoid closing the menu
    e.preventDefault()
    e.stopPropagation()
    
    try {
      setIsLoggingOut(true)
      console.log('🔄 Starting logout process...')
      console.log('isLoggingOut set to:', true)
      
      const {error} = await supabase.auth.signOut()
      console.log('Supabase signOut result:', {error})
      
      if (error){
        console.error('❌ Logout error:', error)
        alert('Logout failed: ' + error.message)
        setIsLoggingOut(false)
      }
      else{
        console.log('✅ Logout successful')
        SetFullName(undefined)
        setUserEmail('')
        setShowUserMenu(false)
        
        // Force a page refresh to ensure clean state
        window.location.reload()
      }
    } catch (err) {
      console.error('❌ Logout exception:', err)
      alert('Logout failed: ' + err.message)
      setIsLoggingOut(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsProcessing(true);
    setParaphrasedAnswer('');

    // Simulate AI processing
    setTimeout(() => {
      // This is a mock response - in a real app, you'd call an AI API
      const mockResponses = {
        'what is artificial intelligence': 'Well, think of AI as giving computers the ability to learn and make decisions like humans do. It\'s basically teaching machines to understand patterns, solve problems, and even have conversations with us. Pretty cool, right?',
        'how does machine learning work': 'Machine learning is like teaching a computer to recognize patterns by showing it lots of examples. It\'s similar to how you learned to recognize a cat - you saw many cats and your brain figured out what makes a cat a cat. The computer does the same thing, but with data!',
        'what is the future of technology': 'The future of tech is going to be wild! We\'re talking about AI that can think like us, robots that can do complex tasks, and maybe even flying cars (finally!). But honestly, the most exciting part is how it\'s going to make our everyday lives easier and more connected.',
        'how to learn programming': 'Learning to code is like learning a new language, but for computers. Start with the basics - pick a beginner-friendly language like Python, work on small projects that interest you, and don\'t worry about being perfect. The key is to keep practicing and building things you actually care about!'
      };

      const lowerQuestion = question.toLowerCase();
      let response = 'That\'s a great question! Let me break this down in a way that makes sense. The answer involves several interesting aspects that I think you\'ll find quite fascinating when you think about it.';

      // Check for matching keywords
      for (const [key, value] of Object.entries(mockResponses)) {
        if (lowerQuestion.includes(key.split(' ').slice(-2).join(' '))) {
          response = value;
          break;
        }
      }

      setParaphrasedAnswer(response);
      setIsProcessing(false);
    }, 2000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paraphrasedAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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

      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="relative">
              <Brain className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-purple-400 float-animation" />
              <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl glow-pulse"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-primary gradient-animate text-shadow-soft">
              Parafyze
            </h1>
          </div>

          {/* Navigation Buttons */}
          {FullName == undefined ? (
            <div className="flex items-center justify-center sm:justify-end space-x-3 sm:space-x-4 md:space-x-6">
              <Link href="/auth/login"> 
                <button className="text-gray-300 hover:text-purple-400 font-medium px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl hover:bg-purple-500/20 transition-all duration-300 elegant-hover text-sm sm:text-base shadow-soft">
                  Login
                </button>
              </Link>
              <Link href="/auth/signup"> 
                <button className="bg-gradient-primary text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-beautiful hover:shadow-glow elegant-hover text-sm sm:text-base">
                  Create Account
                </button>
              </Link>
            </div>
                    ) : (
            <div className="relative user-menu-container">
              {/* Simple User Button */}
              <div className="flex items-center justify-center space-x-3">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-black/30 border border-purple-400/50 text-white px-4 py-2 rounded-lg hover:bg-purple-500/20 transition-all duration-300"
                >
                  <User className="h-5 w-5" />
                  <span>{FullName}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Direct Logout Button */}
                <button 
                  onClick={Logout}
                  disabled={isLoggingOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </div>

              {/* Simple Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute z-60 right-0 mt-2 w-56 bg-black/90 border border-purple-500/50 rounded-lg shadow-lg ">
                  <div className="p-4 border-b border-purple-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{FullName}</p>
                        <p className="text-gray-400 text-xs">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <Link href="/chat">
                      <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded transition-all duration-300 text-sm flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat with AI</span>
                      </button>
                    </Link>
                    
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded transition-all duration-300 text-sm flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="text-center text-gray-300 mt-40  text-lg sm:text-xl lg:text-2xl font-medium text-shadow-soft max-w-4xl mx-auto">
          {FullName ? `Welcome back, ${FullName}! ` : ''}Transform AI responses into natural, human-style answers
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto  px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl relative z-10">
        {/* Hero Section */}
        <div className="text-center z-10 mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 sm:px-8 sm:py-4 mb-6 sm:mb-8 lg:mb-10 shadow-soft border border-purple-500/30">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
            <span className="text-xs sm:text-sm font-semibold text-purple-300">AI-Powered Human-Style Responses</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight text-shadow px-4">
            Get AI Answers That Sound
            <span className="text-gradient-primary gradient-animation"> Human</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 sm:mb-16 leading-relaxed text-shadow-soft px-4">
            Ask any question and receive AI-powered responses that are paraphrased to sound natural, conversational, and engaging.
          </p>

          {/* Quick Access for Logged-in Users */}
          {FullName && (
            <div className="mb-6 sm:mb-8 text-center">
              <Link href="/chat">
                <button className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-primary text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-beautiful hover:shadow-glow text-sm sm:text-base">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Go to Chat Interface</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </Link>
            </div>
          )}

          {/* Question Input */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-beautiful border border-purple-500/40 p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto card-hover mx-4">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div>
                <label htmlFor="question" className="block text-base sm:text-lg font-semibold text-gray-200 mb-3 sm:mb-4 text-shadow-soft">
                  Ask your question
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What is artificial intelligence? How does machine learning work? What is the future of technology?"
                  className="w-full px-6 sm:px-8 py-4 sm:py-6 border border-purple-400 text-white rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-base sm:text-lg lg:text-xl shadow-soft transition-all duration-300 hover:shadow-md bg-black/50 focus-primary placeholder-gray-400"
                  rows="4"
                  disabled={isProcessing}
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !question.trim()}
                className="w-full bg-gradient-primary text-white font-bold py-4 sm:py-5 lg:py-6 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 sm:space-x-4 shadow-beautiful hover:shadow-glow transform hover:scale-105 text-base sm:text-lg lg:text-xl"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                    <span>Get Paraphrased Answer</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {isProcessing && (
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-beautiful border border-purple-500/40 p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto mt-6 sm:mt-8 lg:mt-10 fade-in mx-4">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-purple-400" />
                  <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl pulse-animation"></div>
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium text-center sm:text-left">AI is processing your question and creating a human-style response...</span>
              </div>
            </div>
          )}

          {paraphrasedAnswer && !isProcessing && (
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-beautiful border border-purple-500/40 p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto mt-6 sm:mt-8 lg:mt-10 card-hover fade-in mx-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4">
                  <div className="relative">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                    <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-lg glow-pulse"></div>
                  </div>
                  <span>Paraphrased Answer</span>
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 text-sm text-gray-300 hover:text-purple-400 transition-colors bg-purple-500/20 hover:bg-purple-500/30 rounded-lg sm:rounded-xl elegant-hover"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                      <span className="font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-medium">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 border border-purple-400/30 shadow-soft">
                <p className="text-gray-200 leading-relaxed text-base sm:text-lg lg:text-xl">{paraphrasedAnswer}</p>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-16 sm:mb-20 lg:mb-24">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-beautiful border border-purple-500/30 card-hover group relative overflow-hidden fade-in">
            <div className="absolute inset-0 color-overlay-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-beautiful">
                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-shadow-soft">Ask Anything</h3>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">Pose any question and get intelligent, contextual responses from our advanced AI system. No topic is off-limits!</p>
            </div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-beautiful border border-cyan-500/30 card-hover group relative overflow-hidden fade-in">
            <div className="absolute inset-0 color-overlay-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-secondary rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-beautiful">
                <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-shadow-soft">Human Style</h3>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">Our AI paraphrases responses to sound natural, conversational, and engaging - just like talking to a knowledgeable friend.</p>
            </div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-beautiful border border-pink-500/30 card-hover group relative overflow-hidden fade-in md:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 color-overlay-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-accent rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-beautiful">
                <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-shadow-soft">Instant Results</h3>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">Get your paraphrased answer in seconds with our lightning-fast AI processing. No waiting, no delays!</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-16 sm:mb-20 lg:mb-24 text-center">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 sm:px-8 sm:py-4 mb-6 sm:mb-8 lg:mb-10 shadow-soft border border-yellow-500/30">
            <Play className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
            <span className="text-xs sm:text-sm font-semibold text-yellow-300">How It Works</span>
          </div>
          
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 text-shadow px-4">Simple 3-Step Process</h3>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20 leading-relaxed text-shadow-soft px-4">
            Experience the magic of AI-powered human-style responses in just three simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 max-w-7xl mx-auto">
            <div className="text-center group relative fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-3xl blur-2xl sm:blur-3xl group-hover:blur-4xl transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 lg:mb-10 group-hover:scale-110 transition-transform duration-300 shadow-beautiful glow-pulse">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">1</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-shadow-soft">Ask Your Question</h4>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg lg:text-xl px-4">Type any question you have in our intuitive, beautifully designed input field above. It's that simple!</p>
              </div>
            </div>
            <div className="text-center group relative fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-3xl blur-2xl sm:blur-3xl group-hover:blur-4xl transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 lg:mb-10 group-hover:scale-110 transition-transform duration-300 shadow-beautiful glow-pulse">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">2</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-shadow-soft">AI Processing</h4>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg lg:text-xl px-4">Our advanced AI analyzes your question and generates an intelligent, contextual response in seconds.</p>
              </div>
            </div>
            <div className="text-center group relative fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/15 to-rose-500/15 rounded-3xl blur-2xl sm:blur-3xl group-hover:blur-4xl transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 lg:mb-10 group-hover:scale-110 transition-transform duration-300 shadow-beautiful glow-pulse">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">3</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-shadow-soft">Human-Style Output</h4>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg lg:text-xl px-4">The response is beautifully paraphrased to sound natural, conversational, and engaging.</p>
              </div>
            </div>
          </div>

          {/* Connection lines between steps */}
          <div className="hidden md:block relative max-w-5xl mx-auto mt-12 sm:mt-16 lg:mt-20">
            <div className="absolute top-1/2 left-1/4 w-1/2 h-1 bg-gradient-to-r from-purple-400 to-pink-400 transform -translate-y-1/2 shadow-soft"></div>
            <div className="absolute top-1/2 left-3/4 w-1/2 h-1 bg-gradient-to-r from-pink-400 to-cyan-400 transform -translate-y-1/2 shadow-soft"></div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="bg-gradient-primary rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-beautiful relative overflow-hidden mx-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-pink-700/20"></div>
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 text-shadow">Ready to Experience the Future?</h3>
              <p className="text-lg sm:text-xl lg:text-2xl text-purple-100 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto text-shadow-soft px-4">
                Join thousands of users who are already transforming their AI interactions with Parafyze
              </p>
              <button className="bg-white text-purple-600 font-bold py-4 sm:py-5 lg:py-6 px-8 sm:px-10 lg:px-12 rounded-xl sm:rounded-2xl hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-beautiful text-base sm:text-lg lg:text-xl elegant-hover">
                Try Parafyze Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-purple-500/30 mt-16 sm:mt-20 lg:mt-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gradient-primary text-shadow-soft">
              Parafyze
            </h2>
          </div>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl text-shadow-soft">
            © 2024 Parafyze. Powered by advanced AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
