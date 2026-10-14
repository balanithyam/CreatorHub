import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, X, Send, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

export const CreatorChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; suggestions?: string[] }>>([
    {
      sender: 'bot',
      text: 'Hey Creator! 🎬 I am your **CreatorHub AI Copilot**. Ask me to brainstorm viral hooks, write 60-second Short scripts, structure blueprints, or optimize video titles!',
      suggestions: ['Generate 3 viral video hooks', 'Suggest 5 high-CTR titles', 'Write a 60s Short script', 'How to repurpose long video?']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend = input) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    const newMsgs = [...messages, { sender: 'user' as const, text }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat/message', { message: text });
      if (res.data?.success) {
        setMessages([
          ...newMsgs,
          {
            sender: 'bot' as const,
            text: res.data.data.reply,
            suggestions: res.data.data.suggestions
          }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          sender: 'bot' as const,
          text: '⚠️ Studio AI Assistant encountered a network glitch. Please try asking again!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-5 py-3 bg-[#121316] hover:bg-[#2A2C32] text-white rounded-2xl shadow-2xl border-2 border-[#D2F800] flex items-center gap-2.5 font-bold text-xs transition-all hover:scale-105 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#D2F800] animate-pulse" />
          <span>AI Studio Copilot</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[540px] bg-white border-2 border-[#121316] rounded-3xl shadow-brutal flex flex-col overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="px-5 py-3.5 border-b-2 border-[#121316] bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#121316] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#D2F800]" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#121316]">Creator AI Copilot</h4>
                <span className="text-[10px] text-green-700 font-mono font-bold flex items-center gap-1">
                  ● Live Studio Assistant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#6B6864] hover:text-[#121316] rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF8F5]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-[#121316] text-white rounded-br-none'
                      : 'bg-white border-2 border-[#121316] text-[#121316] rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}
                </div>

                {/* Suggestions */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {m.suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(s)}
                        className="px-2.5 py-1 bg-white hover:bg-[#FFEFEA] border border-[#121316] rounded-lg text-[10px] font-bold text-[#121316] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>{s}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-[#FF5A36]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-[#121316] rounded-2xl max-w-[70%] text-xs text-[#6B6864]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF5A36]" />
                <span>Thinking up viral strategy...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 border-t-2 border-[#121316] bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Write a hook for a ramen cooking video')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#FAF8F5] border border-[#121316] rounded-xl px-3.5 py-2 text-xs font-medium text-[#121316] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-[#121316] hover:bg-[#2A2C32] text-white disabled:opacity-50 rounded-xl transition-all cursor-pointer flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-[#D2F800]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
