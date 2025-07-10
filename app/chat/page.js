'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, CheckCheck,ChevronDown, RotateCcw, Plus, Coins, RefreshCw, Sparkles, Zap, Star, Circle } from 'lucide-react';

export default function ChatPage() {
  const [floatingElements, setFloatingElements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const AiThinking = useRef(null);
  const messagesEndRef = useRef(null);
  const Endofchatref = useRef(null);
  const inputRef = useRef(null);

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

  

  // Function to Handle Submit 
  const handleSubmit = async (e) => {
    AiThinking.current.style.display = 'flex';
    Endofchatref.current.scrollIntoView({behavior:"smooth"})
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue.trim()
    };
    const history = messages.map((message)=>{
      return {
        id:message.id,
        role:message.role,
        content:message.content,
        rephrasedcontent:message.rephrasedcontent || undefined
      }
    })
    history.push(userMessage)
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      
      const response = await fetch('/api/openai', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that answers the user's questions."
            },
            ...history
          ],
          model: "gpt-3.5-turbo"
        })
      });
      
      const data = await response.json();
      
      if (data.response) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.response,
          rephrasedcontent:  undefined
        };
        setMessages(prev => [...prev, assistantMessage]);
        AiThinking.current.style.display = 'none';
         setTimeout(()=>{
          Endofchatref.current.scrollIntoView({behavior:"smooth"})
         },2000)
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Message Card 
  const MessageCard = (props)=>{
    const message = props.data;
    const [openToneDropdowns, setOpenToneDropdowns] = useState(false);
    const [selectedtone,changeTone] = useState(undefined);
    return (
      <div key={message.id} className={`py-4 md:py-6 ${message.role === 'user' ? 'bg-black/40' : 'bg-black/20'} animate-slideInUp`}>
              <div className="max-w-3xl mx-auto px-3 md:px-4">
                <div className="flex items-start space-x-3 md:space-x-4">

                  <div className="w-9 text-white border border-purple-400 bg-purple-600 h-9 md:w-8 md:h-8 rounded-full flex items-center justify-center   ">
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 md:h-4 md:w-4" />
                    ) : (
                      <Bot className="h-3 w-3 bg-purple-600 text-white md:h-4 md:w-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm border border-purple-400/30 md:text-sm shadow-lg p-4 rounded-lg text-gray-200 leading-relaxed whitespace-pre-wrap animate-fadeIn bg-black/30">
                      {message.content}
                    </div>
                    {message.role === 'assistant' && (
                      <>
                      <div className="mt-3 mb-6 flex items-center space-x-2 animate-fadeInUp">
                        <button className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white rounded-lg transition-all duration-300 group shadow-md hover:shadow-lg transform hover:scale-105">
                          <RefreshCw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-500" />
                          <span>Paraphrase it</span>
                          <span className="text-sm group-hover:animate-bounce">✨</span>
                        </button>
                        <button onClick={()=>setOpenToneDropdowns(!openToneDropdowns)} className = 'flex items-center gap-2 space-x-1 px-3 py-1.5 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white rounded-lg transition-all duration-300 group shadow-md hover:shadow-lg transform hover:scale-105'>{selectedtone || 'Select Tone'} <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${openToneDropdowns ? 'rotate-180' : ''}`} /></button>

                        
                      </div>
                      {openToneDropdowns && (
                        <div className = 'flex w-full mt-6  bg-gradient-to-r from-purple-500/20 to-pink-500/20  border-black border-2 backdrop-blur-sm text-sm  gap-4 w-36  items-center p-4 overflow-none border rounded-lg flex-col '>
                          
                        <button onClick={()=>{changeTone('Formal');setOpenToneDropdowns(false)}} className = {`w-full  p-2 hover:bg-purple-700 text-white ${selectedtone === 'Formal' ? 'bg-purple-700' : ''} `}>Formal</button>
                        <button onClick={()=>{changeTone('Informal');setOpenToneDropdowns(false)}} className = {`w-full  p-2 hover:bg-purple-700 text-white ${selectedtone === 'Informal' ? 'bg-purple-700' : ''} `}>Informal</button>
                        <button onClick={()=>{changeTone('Technical');setOpenToneDropdowns(false)}} className = {`w-full p-2 hover:bg-purple-700 text-white ${selectedtone === 'Technical' ? 'bg-purple-700' : ''} `}>Technical</button>
                          <button onClick={()=>{changeTone('Creative');setOpenToneDropdowns(false)}} className = {`w-full p-2 hover:bg-purple-700 text-white ${selectedtone === 'Creative' ? 'bg-purple-700' : ''} `}>Creative</button>
                        <button onClick={()=>{changeTone('Academic');setOpenToneDropdowns(false)}} className = {`w-full  p-2 hover:bg-purple-700 text-white ${selectedtone === 'Academic' ? 'bg-purple-700' : ''} `}>Academic</button>
                        <button onClick={()=>{changeTone('Business');setOpenToneDropdowns(false)}} className = 'w-full  p-2 hover:bg-purple-700 text-white'>Business</button>
                        <button onClick={()=>{changeTone('Legal');setOpenToneDropdowns(false)}} className = 'w-full p-2 hover:bg-purple-700 text-white'>Legal</button>
                        </div>
                      )}
                      </>
                    )}

                    
                   {(!message.rephrasedcontent  && message.role === 'assistant') && (
                    <>
                    <label className = 'text-sm font-bold text-white flex items-center gap-2'>Paraphrased Message : <button  className = 'text-xs bg-gradient-to-r from-purple-500/20 flex items-center justify-center gap-2 to-pink-500/20 p-2 rounded-lg  text-white'><RefreshCw className = 'h-4 w-4 ' /> Reparaphrase it </button></label>
                    <div className = 'text-sm leading-relaxed whitespace-pre-wrap text-white mt-6 mb-6'>
                      {message.content}
                    </div>
                    <label className = 'text-xs bg-gradient-to-r w-40 flex items-center gap-2 from-purple-500/20 to-pink-500/20 p-2 rounded-lg  text-white'> <CheckCheck className = 'h-4 w-4' /> Plagiarism Checked   </label>
                    </>
                   )}
                  </div>
                </div>
              </div>
            </div>
    )
  }


  
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
            <div className="w-full h-full bg-gradient-to-br from-black/30 to-black/20 rounded-full blur-sm"></div>
          </div>
        ))}
        
        {/* Additional floating icons */}
        <div className="absolute top-20 left-10 text-black/20 animate-bounce" style={{ animationDelay: '1s' }}>
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="absolute top-40 right-20 text-black/20 animate-bounce" style={{ animationDelay: '2s' }}>
          <Zap className="h-6 w-6" />
        </div>
        <div className="absolute bottom-40 left-20 text-black/20 animate-bounce" style={{ animationDelay: '3s' }}>
          <Star className="h-7 w-7" />
        </div>
        <div className="absolute bottom-20 right-10 text-black/20 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

  

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/40 px-4 md:px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>Parafyze Chat</span>
                <span className="text-xl animate-pulse">🤖</span>
                <span className="text-sm animate-bounce">✨</span>
              </h1>
              {/* Mobile Credits Display */}
              <div className="md:hidden flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1.5 rounded-lg shadow-md">
                <Coins className="h-3 w-3 text-yellow-400 animate-pulse" />
                <span className="text-xs font-semibold text-white">100</span>
                <span className="text-sm animate-pulse">💎</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-purple-400 hover:text-purple-300 transition-all duration-300 group hover:bg-purple-500/20 rounded-lg"
                title="Regenerate response"
              >
                <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto pb-96 bg-black/20 backdrop-blur-sm">
          {/* Dynamic Messages */}
          {messages.map((message) => <MessageCard key = {message.id} data = {message} />)}
            <div ref= {AiThinking} className='hidden w-full mt-6 justify-center items-center space-x-2'>
            <div   className = 'border-b-2 border-b-purple-400 rounded-full w-4 h-4 animate-spin'></div>
            <span className='text-purple-300 text-sm animate-pulse  '>🤖 AI is thinking... 
             
            </span>

            </div>
            <div ref= {Endofchatref}></div>
            
           

            
        </div>

        {/* Input Area */}
        <div className="bg-black/30 fixed bottom-0 w-full left-0 right-1/2 backdrop-blur-sm border-t border-purple-500/40 p-3 md:p-4 shadow-lg">
          <div className="max-w-3xl mx-auto">
          
            <form className="relative" onSubmit={handleSubmit}>
              <div className="relative group">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message Parafyze... 💬"
                  className="w-full pl-3 md:pl-4 pr-10 md:pr-12 py-2 md:py-3 border border-purple-400/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-none bg-black/50 text-sm md:text-base transition-all duration-300 hover:shadow-md focus:shadow-lg group-hover:border-purple-400/70"
                  rows="1"
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 p-1.5 md:p-2 text-purple-400 hover:text-purple-300 transition-all duration-300 group hover:bg-purple-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                </button>
              </div>
            </form>
            
            <div className="text-xs text-purple-300 mt-2 text-center flex items-center justify-center space-x-2">
              <span>100 credits remaining</span>
              <span className="text-lg animate-pulse">💎</span>
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