'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Trash2, RotateCcw, Plus, Coins, RefreshCw, Sparkles, Zap, Star } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. How can I help you today? ✨',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [credits, setCredits] = useState(100); // Template credits
  const [showSuccessEmoji, setShowSuccessEmoji] = useState(false);
  const [showErrorEmoji, setShowErrorEmoji] = useState(false);
  const [typingEmojis, setTypingEmojis] = useState(['🤔', '💭', '✨', '🚀', '💡']);
  const [currentTypingEmoji, setCurrentTypingEmoji] = useState(0);
  const [floatingElements, setFloatingElements] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate floating background elements
  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10
    }));
    setFloatingElements(elements);
  }, []);

  // Animate typing emojis
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setCurrentTypingEmoji((prev) => (prev + 1) % typingEmojis.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isTyping, typingEmojis.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || credits <= 0) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);
    
    // Deduct credits (template - 1 credit per message)
    setCredits(prev => Math.max(0, prev - 1));

    // Simulate AI response (template - no actual implementation)
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'This is a template response. In the real implementation, this would be the AI\'s response to your message. 🚀',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setIsTyping(false);
      
      // Show success emoji
      setShowSuccessEmoji(true);
      setTimeout(() => setShowSuccessEmoji(false), 2000);
    }, 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'ai',
        content: 'Hello! I\'m your AI assistant. How can I help you today? ✨',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const regenerateResponse = () => {
    if (messages.length < 2) return;
    
    setIsLoading(true);
    setIsTyping(true);
    
    // Remove the last AI message
    setMessages(prev => prev.slice(0, -1));
    
    // Simulate new AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: 'This is a regenerated response. In the real implementation, this would be a new AI response. 🔄',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setIsTyping(false);
      
      // Show success emoji
      setShowSuccessEmoji(true);
      setTimeout(() => setShowSuccessEmoji(false), 2000);
    }, 2000);
  };

  const paraphraseResponse = (messageId) => {
    setIsLoading(true);
    setIsTyping(true);
    
    // Find the message and update it
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.type === 'ai') {
        return {
          ...msg,
          content: 'This is a paraphrased version of the previous response. In the real implementation, this would be the AI paraphrasing its own response. ✨',
          timestamp: new Date().toLocaleTimeString()
        };
      }
      return msg;
    }));
    
    // Simulate paraphrasing delay
    setTimeout(() => {
      setIsLoading(false);
      setIsTyping(false);
      
      // Show success emoji
      setShowSuccessEmoji(true);
      setTimeout(() => setShowSuccessEmoji(false), 2000);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gradient-colorful relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute opacity-10"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animation: `float ${element.duration}s ease-in-out infinite`,
              animationDelay: `${element.delay}s`
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-indigo-300/30 to-purple-400/20 rounded-full blur-sm"></div>
          </div>
        ))}
        
        {/* Additional floating icons */}
        <div className="absolute top-20 left-10 text-indigo-300/20 animate-bounce" style={{ animationDelay: '1s' }}>
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="absolute top-40 right-20 text-purple-300/20 animate-bounce" style={{ animationDelay: '2s' }}>
          <Zap className="h-6 w-6" />
        </div>
        <div className="absolute bottom-40 left-20 text-cyan-300/20 animate-bounce" style={{ animationDelay: '3s' }}>
          <Star className="h-7 w-7" />
        </div>
        <div className="absolute bottom-20 right-10 text-pink-300/20 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      {/* Success/Error Emoji Overlay */}
      {showSuccessEmoji && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="text-6xl animate-bounce animate-pulse">🎉</div>
          <div className="text-4xl animate-bounce animate-pulse mt-2" style={{ animationDelay: '0.2s' }}>✨</div>
        </div>
      )}
      
      {showErrorEmoji && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="text-6xl animate-bounce">😅</div>
        </div>
      )}

      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-64 bg-indigo-900/95 backdrop-blur-sm text-white flex-col border-r border-indigo-700/50 shadow-2xl">
        {/* New Chat Button */}
        <div className="p-4 border-b border-indigo-700/50">
          <button
            onClick={clearChat}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-4 py-3 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
            <span className="font-medium">New Chat</span>
            <span className="text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse">✨</span>
          </button>
        </div>

        {/* Chat History (placeholder) */}
        <div className="flex-1 p-4">
          <div className="text-sm text-indigo-200 mb-3 font-medium flex items-center space-x-2">
            <span>Recent Chats</span>
            <span className="text-lg animate-pulse">💬</span>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="text-sm text-white hover:bg-indigo-700/80 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 group transform hover:scale-105 hover:shadow-md"
              >
                <span className="group-hover:animate-bounce inline-block mr-2">📝</span> 
                Previous Chat {i}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Credits Info */}
        <div className="p-4 border-t border-indigo-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-yellow-400 animate-pulse" />
              <span className="text-sm text-indigo-200">Credits</span>
            </div>
            <span className="text-sm font-semibold text-white flex items-center space-x-1">
              {credits}
              <span className="text-lg animate-pulse">💰</span>
            </span>
          </div>
          <div className="w-full bg-indigo-700/50 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${(credits / 100) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-indigo-300 mt-2 flex items-center justify-between">
            <span>{credits} / 100 remaining</span>
            {credits < 20 && <span className="animate-pulse text-red-400">⚠️</span>}
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-indigo-700/50">
          <div className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm">User</span>
            <span className="text-lg animate-bounce">👤</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-indigo-100/40 px-4 md:px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold text-indigo-600 flex items-center space-x-2">
                <span>Parafyze Chat</span>
                <span className="text-xl animate-pulse">🤖</span>
                <span className="text-sm animate-bounce">✨</span>
              </h1>
              {/* Mobile Credits Display */}
              <div className="md:hidden flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1.5 rounded-lg shadow-md">
                <Coins className="h-3 w-3 text-yellow-500 animate-pulse" />
                <span className="text-xs font-semibold text-indigo-700">{credits}</span>
                <span className="text-sm animate-pulse">💎</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={regenerateResponse}
                disabled={isLoading || messages.length < 2}
                className="p-2 text-indigo-600 hover:text-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group hover:bg-indigo-50 rounded-lg"
                title="Regenerate response"
              >
                <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white/95 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`py-4 md:py-6 ${
                  message.type === 'user' ? 'bg-indigo-50/50' : 'bg-white/50'
                } animate-slideInUp`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="max-w-3xl mx-auto px-3 md:px-4">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 hover:scale-110 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white'
                          : 'bg-gradient-to-br from-indigo-400 to-indigo-500 text-white'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="h-3 w-3 md:h-4 md:w-4" />
                      ) : (
                        <Bot className="h-3 w-3 md:h-4 md:w-4" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm md:text-sm text-gray-900 leading-relaxed whitespace-pre-wrap animate-fadeIn">
                        {message.content}
                      </div>
                      
                      {/* Paraphrase Button for AI messages */}
                      {message.type === 'ai' && (
                        <div className="mt-3 flex items-center space-x-2 animate-fadeInUp">
                          <button
                            onClick={() => paraphraseResponse(message.id)}
                            disabled={isLoading}
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-700 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            <RefreshCw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-500" />
                            <span>Paraphrase it</span>
                            <span className="text-sm group-hover:animate-bounce">✨</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="py-4 md:py-6 bg-white/50 animate-slideInUp">
                <div className="max-w-3xl mx-auto px-3 md:px-4">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 text-white flex items-center justify-center shadow-lg animate-pulse">
                      <Bot className="h-3 w-3 md:h-4 md:w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-2xl animate-pulse">
                          {typingEmojis[currentTypingEmoji]}
                        </span>
                        <span className="text-sm text-gray-500 animate-pulse">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-indigo-100/40 p-3 md:p-4 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative group">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Message Parafyze... 💬"
                  className="w-full pl-3 md:pl-4 pr-10 md:pr-12 py-2 md:py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none bg-white/80 text-sm md:text-base transition-all duration-300 hover:shadow-md focus:shadow-lg group-hover:border-indigo-300"
                  disabled={isLoading}
                  rows="1"
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading || credits <= 0}
                  className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 p-1.5 md:p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group hover:bg-indigo-50 rounded-lg"
                >
                  <Send className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                </button>
              </div>
            </form>
            
            <div className="text-xs text-indigo-600 mt-2 text-center flex items-center justify-center space-x-2">
              {credits > 0 ? (
                <>
                  <span>{credits} credits remaining</span>
                  <span className="text-lg animate-pulse">💎</span>
                </>
              ) : (
                <>
                  <span className="text-red-500 animate-pulse">No credits remaining. Please purchase more credits to continue.</span>
                  <span className="text-lg animate-bounce">😅</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 