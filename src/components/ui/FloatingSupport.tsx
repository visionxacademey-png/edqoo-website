import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Send,
  Bot,
  User,
  PhoneCall,
  MessageCircle,
  RotateCcw,
  Loader2,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatService, type ChatMessage as ServiceChatMessage, type SearchResultItem } from '../../services/chatService';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  needsContact?: boolean;
  results?: SearchResultItem[];
  errorCode?: string;
  contactInfo?: {
    phone: string;
    whatsapp: string;
    email: string;
  };
}

const DEFAULT_SUGGESTIONS = [
  'What courses are available?',
  'Do you have a Python course?',
  'What free courses are available?',
  'What Data Science programs do you offer?',
  'What projects are included?',
  'How can I become an instructor?',
  'How can I become a partner?',
  'How can I contact support?'
];

const WELCOME_TEXT = "Hi! 👋 I'm the AI Assistant. I can help you find courses, programs, projects, instructors, and information about our services. What would you like to know?";

/**
 * Reusable ContactSupportCard component
 * Always prominently displays actual phone number and WhatsApp with direct action buttons.
 */
export const ContactSupportCard: React.FC<{
  phone: string;
  whatsapp: string;
  email?: string;
  title?: string;
  subtitle?: string;
}> = ({
  phone,
  whatsapp,
  title = 'Need more help?',
  subtitle = 'Our academic and technical support team is ready to assist you directly.'
}) => {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWa = whatsapp.replace(/[^0-9]/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="mt-3 p-4 bg-gradient-to-br from-blue-50/95 via-indigo-50/80 to-purple-50/70 border border-blue-200/90 rounded-2xl shadow-xs text-left space-y-3"
    >
      <div className="flex items-center gap-2 text-blue-950 font-bold text-xs">
        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
        <span>{title}</span>
      </div>

      <p className="text-[11px] text-slate-600 leading-normal">
        {subtitle}
      </p>

      {/* Prominently visible contact numbers */}
      <div className="bg-white/90 border border-blue-100/90 rounded-xl p-2.5 space-y-1.5 text-xs text-slate-800">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>Call us:</span>
          </span>
          <a
            href={`tel:${cleanPhone}`}
            className="font-bold text-blue-900 hover:text-blue-700 hover:underline tracking-tight"
          >
            {phone}
          </a>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp:</span>
          </span>
          <a
            href={`https://wa.me/${cleanWa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-900 hover:text-emerald-700 hover:underline tracking-tight"
          >
            {phone}
          </a>
        </div>
      </div>

      {/* Direct Interactive Call & WhatsApp Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <a
          href={`tel:${cleanPhone}`}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>📞 Call Now</span>
        </a>

        <a
          href={`https://wa.me/${cleanWa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>💬 WhatsApp</span>
        </a>
      </div>
    </motion.div>
  );
};

export const FloatingSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: WELCOME_TEXT,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [contactFallback, setContactFallback] = useState({
    phone: '+91 90744 50935',
    whatsapp: '9074450935',
    email: 'support@edqoo.com'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load configuration on mount
  useEffect(() => {
    chatService.getConfig().then((cfg) => {
      if (cfg.suggestedQuestions && cfg.suggestedQuestions.length > 0) {
        setSuggestedQuestions(cfg.suggestedQuestions);
      }
      if (cfg.contactInfo) {
        setContactFallback(cfg.contactInfo);
      }
    }).catch(() => {});
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const historyPayload: ServiceChatMessage[] = messages
        .filter((m) => m.id !== 'welcome-1')
        .map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        }));

      const res = await chatService.sendMessage(text, historyPayload);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        needsContact: res.needsContact,
        results: res.results,
        errorCode: res.errorCode,
        contactInfo: res.contactInfo || contactFallback
      };

      if (res.contactInfo) {
        setContactFallback(res.contactInfo);
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat API error:', err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: "I'm unable to process your question right now. Please contact our support team directly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        needsContact: true,
        errorCode: 'AI_SERVICE_UNAVAILABLE',
        contactInfo: contactFallback
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: WELCOME_TEXT,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Markdown-like bold and bullet point renderer
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
      const isNumbered = /^\d+\.\s/.test(line.trim());

      return (
        <p key={idx} className={`${isBullet || isNumbered ? 'pl-2 py-0.5' : 'py-0.5'} ${line.trim() === '' ? 'h-1.5' : ''}`}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* PROMO / TEASER CALLOUT (WHEN CHAT IS CLOSED)                   */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {!isOpen && showTeaser && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-16 right-0 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-blue-100 p-4 text-left overflow-hidden z-40"
          >
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-100/60 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4 text-blue-100" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    AI Assistant
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online &bull; Instant Answers
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowTeaser(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Dismiss AI prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-2.5 space-y-1 relative z-10">
              <h5 className="text-sm font-bold text-slate-900">
                Have a question? Ask our AI Assistant
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ask me about our courses, programs, instructors, projects, learning options, partnerships, and more.
              </p>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between relative z-10">
              <button
                onClick={() => {
                  setIsOpen(true);
                  setShowTeaser(false);
                }}
                className="w-full py-2 px-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span>Chat with AI</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* MAIN AI CHATBOT PANEL                                          */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-x-2 bottom-2 top-16 sm:inset-auto sm:bottom-20 sm:right-0 sm:w-[420px] sm:h-[620px] sm:max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50"
          >
            {/* PANEL HEADER */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white px-4 py-3.5 flex items-center justify-between shadow-xs select-none">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-xs">
                    <Bot className="w-5 h-5 text-blue-200" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-900" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white tracking-wide">AI Assistant</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-blue-100">
                      Edqoo Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100/90 font-normal truncate max-w-[210px] sm:max-w-none">
                    Ask us anything about our programs and services.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reset conversation */}
                <button
                  onClick={handleResetChat}
                  title="Restart Conversation"
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Restart chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Close Panel */}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close chatbot modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MESSAGES SCROLLABLE BODY */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70 text-left text-xs sm:text-sm">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[92%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                          isUser
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs'
                        }`}
                      >
                        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4 text-blue-100" />}
                      </div>

                      {/* Message Bubble Content */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div
                          className={`p-3.5 rounded-2xl shadow-2xs leading-relaxed ${
                            isUser
                              ? 'bg-blue-600 text-white rounded-tr-xs'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            <div className="text-slate-700 text-xs sm:text-[13px] leading-relaxed space-y-0.5">
                              {renderFormattedContent(msg.content)}
                            </div>
                          )}
                        </div>

                        {/* MATCHED RESULTS COURSE CARDS WITH WORKING [VIEW COURSE] LINKS */}
                        {!isUser && msg.results && msg.results.length > 0 && (
                          <div className="space-y-2 pt-1">
                            {msg.results.map((item) => (
                              <div
                                key={item.id}
                                className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-xl p-3 shadow-2xs transition-all text-left space-y-1.5"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <h6 className="font-bold text-slate-950 text-xs leading-snug">
                                    {item.title}
                                  </h6>
                                  <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                                    {item.category}
                                  </span>
                                </div>

                                {item.description && (
                                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-normal">
                                    {item.description}
                                  </p>
                                )}

                                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                                  <span className="text-[11px] font-medium text-slate-500">
                                    {Number(item.price) === 0 ? (
                                      <span className="text-emerald-600 font-bold">100% Free</span>
                                    ) : item.price ? (
                                      <span className="text-slate-900 font-bold">₹{item.price.toLocaleString()}</span>
                                    ) : (
                                      <span>{item.duration || 'Flexible'}</span>
                                    )}
                                  </span>

                                  <Link
                                    to={item.url}
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                                  >
                                    <span>View Course</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <span className={`text-[10px] text-slate-400 mt-1 px-1 ${isUser ? 'mr-9' : 'ml-9'}`}>
                      {msg.timestamp}
                    </span>

                    {/* REUSABLE CONTACT SUPPORT CARD (WHEN FALLBACK IS NEEDED) */}
                    {msg.needsContact && (
                      <div className="ml-9 w-full max-w-[92%]">
                        <ContactSupportCard
                          phone={msg.contactInfo?.phone || contactFallback.phone}
                          whatsapp={msg.contactInfo?.whatsapp || contactFallback.whatsapp}
                          email={msg.contactInfo?.email || contactFallback.email}
                          title={
                            msg.errorCode === 'AI_SERVICE_UNAVAILABLE'
                              ? 'Direct Academic Advisory'
                              : 'Support Team Contact'
                          }
                          subtitle="Our counselors are available right now on Phone and WhatsApp for complete syllabus and admission guidance."
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* TYPING INDICATOR */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4 text-blue-100" />
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-slate-400 font-medium ml-1">Searching database...</span>
                  </div>
                </div>
              )}

              {/* SUGGESTED QUESTIONS CHIPS (SHOWN WHEN ONLY WELCOME MESSAGE IS PRESENT) */}
              {messages.length === 1 && !isLoading && (
                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Suggested Questions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-left text-xs bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900 py-1.5 px-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK CONTACT BOTTOM BAR (ALWAYS ACCESSIBLE) */}
            <div className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span className="font-medium">Direct Support:</span>
                <a
                  href={`tel:${contactFallback.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-blue-700 font-bold hover:underline inline-flex items-center gap-0.5"
                >
                  <PhoneCall className="w-3 h-3 text-blue-600" /> {contactFallback.phone}
                </a>
                <span>&bull;</span>
                <a
                  href={`https://wa.me/${contactFallback.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-0.5"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
                </a>
              </div>
            </div>

            {/* INPUT / SEND AREA */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask a question about Python, courses, fees..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  maxLength={1000}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send question to AI Assistant"
                  className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING ACTION TRIGGER BUBBLE                                 */}
      {/* ------------------------------------------------------------- */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTeaser(false);
        }}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        className="p-4 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border-2 border-white/80 relative flex items-center justify-center cursor-pointer group"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Bot className="w-6 h-6 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
};
