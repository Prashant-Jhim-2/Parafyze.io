'use client';

import { useState,useEffect } from 'react';
import { Send, Sparkles, Copy, Check, Loader2, Brain, MessageSquare, Zap, ArrowRight, Play } from 'lucide-react';
import { signup } from './lib/authService';
import { supabase } from './lib/SupabaseClient';
import Link from 'next/link';
export default function Home() {
  const [question, setQuestion] = useState('');
  const [FullName,SetFullName] = useState(undefined)
  const [isProcessing, setIsProcessing] = useState(false);
  const [paraphrasedAnswer, setParaphrasedAnswer] = useState('');
  const [copied, setCopied] = useState(false);

  // UseEffect to check if user is logged in
  useEffect(()=>{
    (async()=>{
      const {data,error} = await supabase.auth.getSession()
       const user = data.session.user 
       if (user){
        console.log(user)
        SetFullName(user.user_metadata.full_name)
       }
    })()
  },[])

  // Function to Logout 
  const Logout = async()=>{
    const {error} = await supabase.auth.signOut()
    if (error){
      console.log(error)
    }
    else{
      SetFullName(undefined)
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
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-indigo-200/30 to-purple-300/20 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-cyan-300/30 to-blue-400/20 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-emerald-100/20 to-teal-200/15 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-amber-200/25 to-orange-300/15 rounded-full blur-xl sm:blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-rose-200/20 to-pink-300/10 rounded-full blur-xl sm:blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="relative">
              <Brain className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-indigo-600 float-animation" />
              <div className="absolute inset-0 bg-indigo-400/30 rounded-full blur-xl glow-pulse"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-primary gradient-animate text-shadow-soft">
              Parafyze
            </h1>
          </div>

          {/* Navigation Buttons */}
          {FullName == undefined ? (
            <div className="flex items-center justify-center sm:justify-end space-x-3 sm:space-x-4 md:space-x-6">
            <Link href="/auth/login"> 
            <button className="text-gray-700 hover:text-indigo-600 font-medium px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl hover:bg-indigo-50/60 transition-all duration-300 elegant-hover text-sm sm:text-base shadow-soft">
            Login
            </button>
            </Link>
            <Link href="/auth/signup"> 
            <button className="bg-gradient-primary text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-beautiful hover:shadow-glow elegant-hover text-sm sm:text-base">
            <Link href="/auth/signup">  Create Account
            </Link>
            </button>
            </Link>
          </div>
          ) : <div className = 'flex items-center justify-center gap-3'>
            <button className="text-gray-700 border-black border-2 hover:text-indigo-600 font-medium px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl hover:bg-indigo-50/60 transition-all duration-300 elegant-hover text-sm sm:text-base shadow-soft">
              {FullName}
            </button>
            <button 
            onClick={Logout}
            className="bg-gradient-primary text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-beautiful hover:shadow-glow elegant-hover text-sm sm:text-base">
              Logout
            </button>
            </div>}
        </div>
        
        <p className="text-center text-gray-600 mt-4 sm:mt-6 text-lg sm:text-xl lg:text-2xl font-medium text-shadow-soft max-w-4xl mx-auto">
          Transform AI responses into natural, human-style answers
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 sm:px-8 sm:py-4 mb-6 sm:mb-8 lg:mb-10 shadow-soft border border-indigo-100/30">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />
            <span className="text-xs sm:text-sm font-semibold text-indigo-700">AI-Powered Human-Style Responses</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight text-shadow px-4">
            Get AI Answers That Sound
            <span className="text-gradient-primary gradient-animation"> Human</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 sm:mb-16 leading-relaxed text-shadow-soft px-4">
            Ask any question and receive AI-powered responses that are paraphrased to sound natural, conversational, and engaging.
          </p>

          {/* Question Input */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-beautiful border border-indigo-100/40 p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto card-hover mx-4">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div>
                <label htmlFor="question" className="block text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 text-shadow-soft">
                  Ask your question
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What is artificial intelligence? How does machine learning work? What is the future of technology?"
                  className="w-full px-6 sm:px-8 py-4 sm:py-6 border border-indigo-200 text-black rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-base sm:text-lg lg:text-xl shadow-soft transition-all duration-300 hover:shadow-md bg-white/80 focus-primary"
                  rows="4"
                  disabled={isProcessing}
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !question.trim()}
                className="w-full bg-gradient-primary text-white font-bold py-4 sm:py-5 lg:py-6 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 sm:space-x-4 shadow-beautiful hover:shadow-glow transform hover:scale-105 text-base sm:text-lg lg:text-xl"
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
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-beautiful border border-indigo-100/40 p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto mt-6 sm:mt-8 lg:mt-10 fade-in mx-4">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-indigo-600" />
                  <div className="absolute inset-0 bg-indigo-400/30 rounded-full blur-xl pulse-animation"></div>
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl text-gray-700 font-medium text-center sm:text-left">AI is processing your question and creating a human-style response...</span>
              </div>
            </div>
          )}

          {paraphrasedAnswer && !isProcessing && (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-beautiful border border-indigo-100/40 p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto mt-6 sm:mt-8 lg:mt-10 card-hover fade-in mx-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4">
                  <div className="relative">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />
                    <div className="absolute inset-0 bg-indigo-400/30 rounded-full blur-lg glow-pulse"></div>
                  </div>
                  <span>Paraphrased Answer</span>
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-indigo-50 hover:bg-indigo-100 rounded-lg sm:rounded-xl elegant-hover"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
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
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 border border-indigo-200 shadow-soft">
                <p className="text-gray-800 leading-relaxed text-base sm:text-lg lg:text-xl">{paraphrasedAnswer}</p>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-16 sm:mb-20 lg:mb-24">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-beautiful border border-indigo-100/30 card-hover group relative overflow-hidden fade-in">
            <div className="absolute inset-0 color-overlay-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-beautiful">
                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-shadow-soft">Ask Anything</h3>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">Pose any question and get intelligent, contextual responses from our advanced AI system. No topic is off-limits!</p>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-beautiful border border-cyan-100/30 card-hover group relative overflow-hidden fade-in">
            <div className="absolute inset-0 color-overlay-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-secondary rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-beautiful">
                <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-shadow-soft">Human Style</h3>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">Our AI paraphrases responses to sound natural, conversational, and engaging - just like talking to a knowledgeable friend.</p>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-beautiful border border-emerald-100/30 card-hover group relative overflow-hidden fade-in md:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 color-overlay-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-accent rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-beautiful">
                <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-shadow-soft">Instant Results</h3>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">Get your paraphrased answer in seconds with our lightning-fast AI processing. No waiting, no delays!</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-16 sm:mb-20 lg:mb-24 text-center">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 sm:px-8 sm:py-4 mb-6 sm:mb-8 lg:mb-10 shadow-soft border border-amber-100/30">
            <Play className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
            <span className="text-xs sm:text-sm font-semibold text-amber-700">How It Works</span>
          </div>
          
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 text-shadow px-4">Simple 3-Step Process</h3>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20 leading-relaxed text-shadow-soft px-4">
            Experience the magic of AI-powered human-style responses in just three simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 max-w-7xl mx-auto">
            <div className="text-center group relative fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl sm:blur-3xl group-hover:blur-4xl transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 lg:mb-10 group-hover:scale-110 transition-transform duration-300 shadow-beautiful glow-pulse">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">1</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-shadow-soft">Ask Your Question</h4>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg lg:text-xl px-4">Type any question you have in our intuitive, beautifully designed input field above. It's that simple!</p>
              </div>
            </div>
            <div className="text-center group relative fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl blur-2xl sm:blur-3xl group-hover:blur-4xl transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 lg:mb-10 group-hover:scale-110 transition-transform duration-300 shadow-beautiful glow-pulse">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">2</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-shadow-soft">AI Processing</h4>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg lg:text-xl px-4">Our advanced AI analyzes your question and generates an intelligent, contextual response in seconds.</p>
              </div>
            </div>
            <div className="text-center group relative fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl blur-2xl sm:blur-3xl group-hover:blur-4xl transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 lg:mb-10 group-hover:scale-110 transition-transform duration-300 shadow-beautiful glow-pulse">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">3</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-shadow-soft">Human-Style Output</h4>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg lg:text-xl px-4">The response is beautifully paraphrased to sound natural, conversational, and engaging.</p>
              </div>
            </div>
          </div>

          {/* Connection lines between steps */}
          <div className="hidden md:block relative max-w-5xl mx-auto mt-12 sm:mt-16 lg:mt-20">
            <div className="absolute top-1/2 left-1/4 w-1/2 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 transform -translate-y-1/2 shadow-soft"></div>
            <div className="absolute top-1/2 left-3/4 w-1/2 h-1 bg-gradient-to-r from-purple-400 to-emerald-400 transform -translate-y-1/2 shadow-soft"></div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="bg-gradient-primary rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-beautiful relative overflow-hidden mx-4">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-purple-700/20"></div>
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 text-shadow">Ready to Experience the Future?</h3>
              <p className="text-lg sm:text-xl lg:text-2xl text-indigo-100 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto text-shadow-soft px-4">
                Join thousands of users who are already transforming their AI interactions with Parafyze
              </p>
              <button className="bg-white text-indigo-600 font-bold py-4 sm:py-5 lg:py-6 px-8 sm:px-10 lg:px-12 rounded-xl sm:rounded-2xl hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-beautiful text-base sm:text-lg lg:text-xl elegant-hover">
                Try Parafyze Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-indigo-100 mt-16 sm:mt-20 lg:mt-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gradient-primary text-shadow-soft">
              Parafyze
            </h2>
          </div>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl text-shadow-soft">
            © 2024 Parafyze. Powered by advanced AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
