import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import api from '@/services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello 👋 Welcome to UniBuzz! How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickActions = [
    "Upcoming Events",
    "My Events",
    "Technical Events",
    "Workshops",
    "Registration Help",
    "FAQ",
    "Contact Support"
  ];

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Get JWT token for authenticated endpoints (like My Events)
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await api.post('/api/chat', { message: text }, { headers });
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.data.reply,
        data: response.data.data, // Array of events if any
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Sorry, I am having trouble connecting to the server right now. Please try again later.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend(inputText);
    }
  };

  const EventMiniCard = ({ event }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-3 mb-2 shadow-sm text-left hover:border-blue-200 transition-colors">
      <div className="font-bold text-gray-800 text-[13px] line-clamp-1">{event.title}</div>
      <div className="text-[11px] text-gray-500 mt-1 flex flex-col gap-0.5">
        <div>📅 {event.eventDate} {event.eventTime ? `• ${event.eventTime}` : ''}</div>
        <div>📍 {event.location || 'TBA'}</div>
        <div>🎟 {event.seats === null || event.seats === undefined ? '∞' : event.seats} Seats Available</div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[360px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.15)] border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">UniBuzz Assistant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[11px] text-blue-100 font-medium">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 flex flex-col gap-4 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.type === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-1">
                      <Bot className="h-3 w-3 text-blue-600" />
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-2xl ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    
                    {/* Render Event Data if available */}
                    {msg.data && Array.isArray(msg.data) && msg.data.length > 0 && (
                      <div className="mt-3 flex flex-col gap-1.5">
                        {msg.data.map(event => (
                          <EventMiniCard key={event.id} event={event} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-8">{msg.timestamp}</span>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-end gap-2 max-w-[80%]">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-1">
                  <Bot className="h-3 w-3 text-blue-600" />
                </div>
                <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions & Input Area */}
          <div className="bg-white border-t border-gray-200 p-3 shrink-0">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pb-3 mb-1">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-full text-[12px] font-semibold transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl py-3 pl-4 pr-12 text-[13px] outline-none transition-all"
              />
              <button
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim()}
                className="absolute right-2 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-gray-800 rotate-90 scale-90' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 shadow-[0_4px_20px_rgba(37,99,235,0.4)]'
        } w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg`}
      >
        {isOpen ? <X className="h-6 w-6 -rotate-90" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .css-hide-scroll {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
