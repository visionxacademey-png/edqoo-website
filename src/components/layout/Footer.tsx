import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';

// Default core technical tracks if categories are still loading or unavailable
const DEFAULT_CORE_TRACKS = [
  { name: 'Data Science and AI Course', url: '/programs/data-science-and-ai' },
  { name: 'Python Course Online', url: '/programs/python' },
  { name: 'AI and Machine Learning Course', url: '/programs/ai-and-machine-learning' },
  { name: 'Data Analytics and AI Course', url: '/programs/data-analytics-and-ai' },
  { name: 'Tools & Upskills (Excel, Power BI, GenAI)', url: '/tools-and-upskills' },
];

const isSpokenEnglishCategory = (cat: Category) => {
  const name = (cat.name || '').toLowerCase();
  const slug = (cat.slug || '').toLowerCase();
  const id = (cat.id || '').toLowerCase();
  const parentId = (cat.parentId || '').toLowerCase();
  const parentSlug = (cat.parentSlug || '').toLowerCase();

  return (
    cat.isPartner ||
    Boolean(parentId) ||
    Boolean(parentSlug) ||
    name.includes('spoken english') ||
    name.includes('spoken tutorial') ||
    name.includes('english mirror') ||
    slug === 'spoken-tutorial' ||
    slug === 'spoken-english' ||
    slug === 'english-mirror' ||
    id === 'cat-spoken-tutorial' ||
    id === 'cat-english-mirror' ||
    parentId === 'cat-spoken-tutorial' ||
    parentId === 'cat-english-mirror' ||
    parentSlug === 'spoken-tutorial' ||
    parentSlug === 'english-mirror'
  );
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let isMounted = true;
    categoryService
      .getCategories()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error('Footer category load error:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const coreCategories = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];

    const filtered = categories.filter(
      (cat) => !cat.parentId && !cat.parentSlug && !isSpokenEnglishCategory(cat)
    );

    const seen = new Set<string>();
    const deduplicated: Category[] = [];
    for (const cat of filtered) {
      const key = (cat.slug || cat.name).toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(cat);
      }
    }
    return deduplicated;
  }, [categories]);

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
    <footer className="bg-[#050505] text-slate-300 border-t border-slate-800/80 pt-14 pb-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand & Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <Link to="/" className="inline-block bg-white p-2 rounded-xl">
              <img 
                src="/logo.jpg" 
                alt="Edqoo" 
                className="h-9 w-auto object-contain max-w-[150px]" 
              />
            </Link>
            
            <p className="text-xs leading-relaxed text-slate-400">
              Edqoo is an online learning platform focused on practical, industry-oriented education in Data Science, Artificial Intelligence, Python, Data Analytics and professional upskilling.
            </p>

            {/* Newsletter */}
            <div className="pt-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                Stay Updated On New Batches
              </span>
              {isSubscribed ? (
                <div className="p-2.5 bg-[#F1E8FA] border border-[#E0CEF5] text-[#6D22B5] text-xs rounded-lg flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#6D22B5]" />
                  <span>Thank you for subscribing to Edqoo insights!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="flex-1 px-3.5 py-2 text-xs bg-[#141414] border border-slate-800 rounded-lg focus:outline-none focus:border-[#6D22B5] text-white placeholder-slate-500 shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#6D22B5] hover:bg-[#4B1680] text-white font-bold rounded-lg transition-colors flex items-center justify-center shadow-2xs cursor-pointer"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Core Programs (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D22B5]" />
              <span>Core Program Tracks</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {coreCategories.length > 0
                ? coreCategories.map((cat) => {
                    const linkUrl =
                      cat.slug === 'tools-and-upskills'
                        ? '/tools-and-upskills'
                        : `/programs/${cat.slug}`;

                    const displayName =
                      cat.name.toLowerCase().includes('course') ||
                      cat.name.toLowerCase().includes('track') ||
                      cat.name.toLowerCase().includes('upskills') ||
                      cat.name.toLowerCase().includes('learning')
                        ? cat.name
                        : `${cat.name} Course`;

                    return (
                      <li key={cat.id || cat.slug}>
                        <Link to={linkUrl} className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                          {displayName}
                        </Link>
                      </li>
                    );
                  })
                : DEFAULT_CORE_TRACKS.map((track) => (
                    <li key={track.url}>
                      <Link to={track.url} className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                        {track.name}
                      </Link>
                    </li>
                  ))}
              <li>
                <Link to="/courses" className="text-[#6D22B5] hover:text-[#853FD5] font-bold transition-colors inline-flex items-center gap-1">
                  <span>Explore All Online Courses</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Career Guides & Articles (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D22B5]" />
              <span>Career Guides &amp; Blog</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/blog/what-is-data-science" className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                  What is Data Science? (2026 Guide)
                </Link>
              </li>
              <li>
                <Link to="/blog/how-to-learn-python" className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                  How to Learn Python Step-by-Step
                </Link>
              </li>
              <li>
                <Link to="/blog/python-vs-sql" className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                  Python vs SQL: Which to Learn First?
                </Link>
              </li>
              <li>
                <Link to="/blog/what-is-machine-learning" className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                  What is Machine Learning?
                </Link>
              </li>
              <li>
                <Link to="/blog/ai-career-skills" className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                  AI Career Skills for the Future
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#6D22B5] hover:text-[#853FD5] font-bold transition-colors inline-flex items-center gap-1">
                  <span>View All Career Guides</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Institutional (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D22B5]" />
              <span>Work With Us &amp; Contact</span>
            </h4>
            <ul className="space-y-2 text-xs mb-3">
              <li>
                <Link to="/hire-from-us" className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                  Hire Skilled Tech Talent
                </Link>
              </li>
              <li>
                <Link to="/become-an-instructor" className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                  Become an Online Instructor
                </Link>
              </li>
              <li>
                <Link to="/become-a-partner" className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                  Institutional &amp; University Partnerships
                </Link>
              </li>
              <li>
                <Link to="/leadership-council" className="text-slate-400 hover:text-[#6D22B5] transition-colors">
                  Leadership Council &amp; Advisors
                </Link>
              </li>
            </ul>

            <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#6D22B5] mt-0.5 flex-shrink-0" />
                <a href="mailto:support@edqoo.com" className="hover:text-[#6D22B5] transition-colors">
                  support@edqoo.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#6D22B5] mt-0.5 flex-shrink-0" />
                <span>+91 90744 50935</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#6D22B5] mt-0.5 flex-shrink-0" />
                <span>Indus Avenue, Chalappuram, Kozhikode, Kerala</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal Links & Socials */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center lg:text-left">
            &copy; {currentYear} Edqoo. All rights reserved.
          </p>

          {/* Core Footer Navigation & Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-[#6D22B5] transition-colors">
              Home
            </Link>
            <span className="text-slate-700 select-none">|</span>
            <Link to="/programs" className="hover:text-[#6D22B5] transition-colors">
              Programs
            </Link>
            <span className="text-slate-700 select-none">|</span>
            <Link to="/courses" className="hover:text-[#6D22B5] transition-colors">
              Courses
            </Link>
            <span className="text-slate-700 select-none">|</span>
            <Link to="/tools-and-upskills" className="hover:text-[#6D22B5] transition-colors">
              Tools &amp; Upskills
            </Link>
            <span className="text-slate-700 select-none">|</span>
            <Link to="/about" className="hover:text-[#6D22B5] transition-colors">
              About Edqoo
            </Link>
            <span className="text-slate-700 select-none">|</span>
            <Link to="/contact" className="hover:text-[#6D22B5] transition-colors">
              Contact Edqoo
            </Link>
            <span className="text-slate-700 select-none">|</span>
            <Link to="/privacy-policy" className="hover:text-[#6D22B5] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700 select-none">|</span>
            <Link to="/terms-and-conditions" className="hover:text-[#6D22B5] transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://www.linkedin.com/company/edqoo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#141414] hover:bg-[#6D22B5] text-slate-400 hover:text-black border border-slate-800 rounded-lg shadow-2xs transition-colors"
              aria-label="Edqoo LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            <a
              href="https://www.youtube.com/@edqoo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#141414] hover:bg-[#6D22B5] text-slate-400 hover:text-black border border-slate-800 rounded-lg shadow-2xs transition-colors"
              aria-label="Edqoo YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            <a
              href="https://www.facebook.com/edqoo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#141414] hover:bg-[#6D22B5] text-slate-400 hover:text-black border border-slate-800 rounded-lg shadow-2xs transition-colors"
              aria-label="Edqoo Facebook"
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
