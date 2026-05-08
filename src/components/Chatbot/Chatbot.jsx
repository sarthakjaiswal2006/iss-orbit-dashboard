import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { generateChatResponse } from '../../services/huggingface';
import { useDashboard } from '../../context/DashboardContext';
import toast from 'react-hot-toast';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { issData, astronauts, news } = useDashboard();

  useEffect(() => {
    const saved = localStorage.getItem('chatbot_history');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        { role: 'assistant', content: 'Hello! I am your ISS Dashboard Assistant. Ask me about the ISS location, astronauts in space, or recent news!' }
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot_history', JSON.stringify(messages));
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    
    // Keep last 30 messages
    if (newMessages.length > 30) newMessages.splice(0, newMessages.length - 30);
    
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Build context string from dashboard data
      const context = `
ISS Current Location: Latitude ${issData?.lat?.toFixed(2) || 'unknown'}, Longitude ${issData?.lng?.toFixed(2) || 'unknown'}
ISS Speed: ${issData?.speed?.toFixed(0) || 'unknown'} km/h
Astronauts in space (${astronauts?.length || 0}): ${astronauts?.map(a => a.name).join(', ') || 'none known'}
Recent News Titles: ${news?.slice(0, 3).map(n => n.title).join(' | ') || 'none'}
      `.trim();
      console.log("ISS DATA:", issData);
      const response = await generateChatResponse(userMsg.content, {
        issData,
        astronauts,
        news,
      });
      
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      toast.error(err.message || 'Failed to get response');
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my neural network right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const initial = [{ role: 'assistant', content: 'Chat cleared. How can I help you today?' }];
    setMessages(initial);
    localStorage.setItem('chatbot_history', JSON.stringify(initial));
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-neon-blue/50 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] glass rounded-2xl flex flex-col z-50 shadow-2xl overflow-hidden border border-white/20 dark:border-white/10"
          >
            <div className="p-4 bg-gradient-to-r from-space-800 to-space-900 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-neon-blue" />
                <h3 className="font-bold">Orbit Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearChat} className="p-1 hover:bg-white/10 rounded transition-colors" title="Clear Chat">
                  <Trash2 className="w-4 h-4 text-slate-300" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-white/50 dark:bg-space-900/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-neon-blue text-space-900' : 'bg-neon-purple text-white'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${msg.role === 'user' ? 'bg-neon-blue text-space-900 rounded-tr-none' : 'bg-white dark:bg-space-800 dark:text-slate-200 border border-slate-200 dark:border-white/5 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-neon-purple flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white dark:bg-space-800 border border-slate-200 dark:border-white/5 rounded-tl-none flex items-center gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-space-800 border-t border-slate-200 dark:border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the dashboard..."
                className="flex-1 bg-slate-100 dark:bg-space-900 border-none rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue dark:text-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 bg-neon-blue text-space-900 rounded-xl hover:bg-neon-blue/80 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
