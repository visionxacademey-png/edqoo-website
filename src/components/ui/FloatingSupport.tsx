import React, { useState } from 'react';
import { MessageSquare, X, MessageCircle, Mail, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    
    // Simulate API delivery
    console.log('User submitted support question:', questionText);
    setQuestionSent(true);
    setQuestionText('');
    setTimeout(() => {
      setQuestionSent(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 text-white p-4 flex items-center justify-between">
              <div className="text-left">
                <h4 className="font-display font-bold text-white">Edqoo Support</h4>
                <p className="text-xs text-purple-100 mt-0.5 font-normal">We typically reply in minutes</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close support modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content / Options */}
            <div className="p-4 space-y-3 text-left">
              {/* Option: WhatsApp */}
              <a
                href="https://wa.me/placeholder" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 text-slate-800 rounded-xl transition-all group"
              >
                <div className="p-2 rounded-lg bg-emerald-500 text-white">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900 block group-hover:text-emerald-800">Chat on WhatsApp</span>
                  <span className="text-[11px] text-slate-500 block">Instant technical assistance</span>
                </div>
              </a>

              {/* Option: Email */}
              <a
                href="mailto:support@edqoo.com"
                className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100/70 border border-purple-100 text-slate-800 rounded-xl transition-all group"
              >
                <div className="p-2 rounded-lg bg-purple-600 text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900 block group-hover:text-purple-800">Email Support</span>
                  <span className="text-[11px] text-slate-500 block">support@edqoo.com</span>
                </div>
              </a>

              {/* Option: Ask a Question Quick Form */}
              <div className="border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Ask a Question</span>
                
                {questionSent ? (
                  <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-lg text-xs text-center font-medium">
                    Question received! We will reach out via email shortly.
                  </div>
                ) : (
                  <form onSubmit={handleSendQuestion} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your question..."
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg focus:outline-none focus:border-purple-600"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition-colors"
                      aria-label="Send question"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle support options"
        className="p-3.5 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-800 transform hover:scale-105 active:scale-95 transition-all duration-300 border border-purple-500"
      >
        {isOpen ? <X className="w-6 h-6 animate-pulse" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};
