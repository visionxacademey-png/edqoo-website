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
              href="https://www.linkedin.com/company/edqoo/"
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
              href="https://x.com/edqooapp?s=11"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#141414] hover:bg-[#6D22B5] text-slate-400 hover:text-black border border-slate-800 rounded-lg shadow-2xs transition-colors"
              aria-label="Edqoo X"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            <a
              href="https://www.instagram.com/edqoo.app?obrf=M2VhcmtkbmFrOWY2&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#141414] hover:bg-[#6D22B5] text-slate-400 hover:text-black border border-slate-800 rounded-lg shadow-2xs transition-colors"
              aria-label="Edqoo Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
