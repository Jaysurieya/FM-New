  import React, { useState, useCallback, useRef, useEffect } from 'react';
  import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';

  // --- Helper Components ---

  // Renders a single chat message
  const ChatMessage = ({ message }) => {
    const isModel = message.role === 'model';
    return (
      <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-3`}>
        <div
          className={`rounded-2xl px-4 py-3 max-w-[280px] shadow-sm ${
            isModel
              ? 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-800 border border-slate-200'
              : 'bg-gradient-to-r from-[#492110] to-[#492110] text-white shadow-blue-200'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    );
  };

  // Renders a loading indicator while the model is thinking
  const LoadingIndicator = () => (
    <div className="flex justify-start mb-3">
      <div className="rounded-2xl px-4 py-3 max-w-[280px] bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200">
        <div className="flex items-center">
          <span className="text-sm text-slate-600 mr-3">Thinking</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Main Floating Chatbot Component ---

  export default function FloatingChatbot() {
    // --- Integrated API Key ---
    // IMPORTANT: Replace "YOUR_API_KEY_HERE" with your actual Google Gemini API key.
    const API_KEY = process.env.REACT_APP_GOOGLE_GEMINI_API_KEY;

    // --- State Management ---
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
      { role: 'model', text: "Hello! 👋\nHow can I help you today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    // --- Effects ---
    useEffect(() => {
      // Scroll to the bottom of the chat on new messages
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
      // Focus input when chat opens
      if (isOpen && !isMinimized && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen, isMinimized]);

    // --- Core Functions ---
    const handleSendMessage = useCallback(async (e) => {
      if (e) e.preventDefault();
      if (!userInput.trim() || isLoading) return;

      
      // Add user message to state
      const newMessages = [...messages, { role: 'user', text: userInput }];
      setMessages(newMessages);
      setUserInput('');
      setIsLoading(true);
      setError(null);

      // Prepare API request
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
      const payload = {
        contents: newMessages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
      };

      // Make the API call
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "An unknown error occurred.");
        }

        const data = await response.json();
        const modelResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (modelResponse) {
          setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);
        } else {
          throw new Error("Received an empty response from the API.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, [userInput, isLoading, messages, API_KEY]);

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const toggleChat = () => {
      setIsOpen(!isOpen);
      setIsMinimized(false);
    };

    const toggleMinimize = () => {
      setIsMinimized(!isMinimized);
    };

    // --- Render Logic ---
    return (
      <>
        {/* Floating Chat Button */}
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={toggleChat}
              className="bg-gradient-to-r from-[#492110] to-[#492110] hover:from-[#492110] hover:to-[#492110] text-white p-4 rounded-full shadow-2xl hover:shadow-blue-300/25 transition-all duration-300 transform hover:scale-110 group"
            >
              <MessageCircle size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </div>
        )}

        {/* Floating Chat Window */}
        {isOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border-5 border-[#492110] overflow-hidden transition-all duration-300 transform">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#492110] to-[#492110] p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Fitmate AI Assistant</h3>
                  <p className="text-xs text-blue-100">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages Container */}
                <div className="flex-1 h-80 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-white">
                  {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                  ))}
                  {isLoading && <LoadingIndicator />}
                  <div ref={chatEndRef} />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-xs">
                      <strong>Error:</strong> {error}
                    </p>
                  </div>
                )}

                {/* Input Container */}
                <div className="p-4 bg-white border-t border-slate-200">
                  <div className="flex items-center space-x-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#492110] focus:border-transparent text-sm placeholder-slate-500"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !userInput.trim()}
                      className="bg-gradient-to-r from-[#492110] to-[#492110] hover:from-[#492110] hover:to-[#492110] text-white p-3 rounded-full disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-200/50 transform hover:scale-105"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Minimized State */}
            {isMinimized && (
              <div className="p-4 bg-gradient-to-b from-slate-50 to-white h-16 flex items-center justify-center cursor-pointer" onClick={toggleMinimize}>
                <p className="text-slate-500 text-sm">Chat minimized - Click to expand</p>
              </div>
            )}
          </div>
        )}
      </>
    );
  }


