import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { useEnquiry } from '../../context/EnquiryContext';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { openEnquiryModal } = useEnquiry();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => {
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-deep-navy-950 text-slate-400 border-t border-deep-navy-800 pt-14 pb-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand & Newsletter (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-royal-blue-600 to-royal-blue-500 flex items-center justify-center text-white font-display font-black text-base shadow">
                E
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                Edqoo
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
              Edqoo is a modern technology education platform. Build in-demand software engineering, cybersecurity, data science, and cloud systems capabilities through practical, industry-aligned curricula.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                Stay Updated On New Programs
              </span>
              {isSubscribed ? (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Thank you for subscribing to Edqoo insights!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter your corporate or personal email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="flex-1 px-3.5 py-2 text-xs bg-deep-navy-900 border border-deep-navy-700 rounded-lg focus:outline-none focus:border-royal-blue-500 text-white placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-royal-blue-600 text-white hover:bg-royal-blue-700 rounded-lg transition-colors flex items-center justify-center"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Core Programs (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">
              Core Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/courses/cybersecurity" className="hover:text-white transition-colors">
                  Cybersecurity Program
                </Link>
              </li>
              <li>
                <Link to="/courses/data-science" className="hover:text-white transition-colors">
                  Data Science Program
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  AI & Deep Learning
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Full Stack Engineering
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Cloud Solutions Architecture
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  DevOps & SRE
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Categories (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">
              Specializations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Ethical Hacking & SOC
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Predictive Analytics
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  UI/UX Product Design
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Growth Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Support (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Edqoo
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">
                  Resources & Insights
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openEnquiryModal()}
                  className="hover:text-white text-royal-blue-400 transition-colors text-left"
                >
                  Request Advisory
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact info (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-royal-blue-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@Edqoo.com" className="hover:text-white transition-colors">
                  support@Edqoo.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-royal-blue-400 mt-0.5 flex-shrink-0" />
                <span>+1 (555) 019-2844</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-royal-blue-400 mt-0.5 flex-shrink-0" />
                <span>100 Pine St, San Francisco, CA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="border-t border-deep-navy-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} Edqoo. All rights reserved. Professional EdTech Platform.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-deep-navy-900 hover:bg-royal-blue-600 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-deep-navy-900 hover:bg-royal-blue-600 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-deep-navy-900 hover:bg-royal-blue-600 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
