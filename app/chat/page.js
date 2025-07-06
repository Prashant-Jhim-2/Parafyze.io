'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Trash2, RotateCcw, Plus, Coins, RefreshCw } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [credits, setCredits] = useState(100); // Template credits
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        content: 'This is a template response. In the real implementation, this would be the AI\'s response to your message.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setIsTyping(false);
    }, 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'ai',
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
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
        content: 'This is a regenerated response. In the real implementation, this would be a new AI response.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setIsTyping(false);
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
          content: 'This is a paraphrased version of the previous response. In the real implementation, this would be the AI paraphrasing its own response.',
          timestamp: new Date().toLocaleTimeString()
        };
      }
      return msg;
    }));
    
    // Simulate paraphrasing delay
    setTimeout(() => {
      setIsLoading(false);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gradient-colorful">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-64 bg-indigo-900 text-white flex-col">
        {/* New Chat Button */}
        <div className="p-4 border-b border-indigo-700">
          <button
            onClick={clearChat}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History (placeholder) */}
        <div className="flex-1 p-4">
          <div className="text-sm text-indigo-200 mb-2 font-medium">Recent Chats</div>
          <div className="space-y-2">
            <div className="text-sm text-white hover:bg-indigo-700 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200">
              Previous Chat 1
            </div>
            <div className="text-sm text-white hover:bg-indigo-700 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200">
              Previous Chat 2
            </div>
            <div className="text-sm text-white hover:bg-indigo-700 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200">
              Previous Chat 3
            </div>
          </div>
        </div>

        {/* Credits Info */}
        <div className="p-4 border-t border-indigo-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-indigo-200">Credits</span>
            </div>
            <span className="text-sm font-semibold text-white">{credits}</span>
          </div>
          <div className="w-full bg-indigo-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(credits / 100) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-indigo-300 mt-1">
            {credits} / 100 remaining
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-indigo-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm">User</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-indigo-100/40 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold text-indigo-600">Parafyze Chat</h1>
              {/* Mobile Credits Display */}
              <div className="md:hidden flex items-center space-x-2 bg-indigo-100 px-2 py-1 rounded-lg">
                <Coins className="h-3 w-3 text-yellow-500" />
                <span className="text-xs font-semibold text-indigo-700">{credits}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={regenerateResponse}
                disabled={isLoading || messages.length < 2}
                className="p-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Regenerate response"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white/95 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`py-4 md:py-6 ${
                  message.type === 'user' ? 'bg-indigo-50/50' : 'bg-white/50'
                }`}
              >
                <div className="max-w-3xl mx-auto px-3 md:px-4">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-500 text-white'
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
                      <div className="text-sm md:text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                      
                      {/* Paraphrase Button for AI messages */}
                      {message.type === 'ai' && (
                        <div className="mt-3 flex items-center space-x-2">
                          <button
                            onClick={() => paraphraseResponse(message.id)}
                            disabled={isLoading}
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Paraphrase it</span>
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
              <div className="py-4 md:py-6 bg-white/50">
                <div className="max-w-3xl mx-auto px-3 md:px-4">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                      <Bot className="h-3 w-3 md:h-4 md:w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
        <div className="bg-white/95 backdrop-blur-sm border-t border-indigo-100/40 p-3 md:p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Message Parafyze..."
                  className="w-full pl-3 md:pl-4 pr-10 md:pr-12 py-2 md:py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none bg-white/80 text-sm md:text-base"
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
                  className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 p-1.5 md:p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Send className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </form>
            
            <div className="text-xs text-indigo-600 mt-2 text-center">
              {credits > 0 ? (
                `${credits} credits remaining`
              ) : (
                <span className="text-red-500">No credits remaining. Please purchase more credits to continue.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 