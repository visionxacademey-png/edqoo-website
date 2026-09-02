import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  LogOut,
  User as UserIcon,
  BookOpen,
  Award,
  LogIn,
  UserPlus,
  ChevronDown,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEnquiry } from '../../context/EnquiryContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, logout, isAuthenticated } = useAuth();
  const { openEnquiryModal } = useEnquiry();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Explore Programs' },
    { to: '/about', label: 'About Us' },
    { to: '/resources', label: 'Resources' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-2.5 shadow-sm border-b border-deep-navy-200/80 text-deep-navy-900'
            : 'bg-white text-deep-navy-900 py-3.5 border-b border-deep-navy-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-royal-blue-600 to-royal-blue-500 flex items-center justify-center text-white font-display font-black text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                  E
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-xl tracking-tight text-deep-navy-900 leading-none">
                    Edqoo
                  </span>
                  <span className="text-[9px] font-bold text-royal-blue-600 tracking-wider uppercase mt-0.5">
                    Professional Learning
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-xs font-bold tracking-wide transition-colors hover:text-royal-blue-600 ${
                      isActive ? 'text-royal-blue-600 font-extrabold' : 'text-deep-navy-800/85'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right: Search + Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 bg-deep-navy-50 border border-deep-navy-200 rounded-full py-1.5 pl-3.5 pr-8 text-xs focus:w-56 focus:bg-white focus:border-royal-blue-600 focus:outline-none transition-all duration-200 text-deep-navy-900 placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-royal-blue-600 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Advisory CTA button */}
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-royal-blue-700 bg-royal-blue-50 border border-royal-blue-200 hover:bg-royal-blue-100 rounded-lg transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-royal-blue-600" />
                <span>Talk to Advisor</span>
              </button>

              {/* Authentication Controls */}
              {isAuthenticated && user ? (
                <div className="relative pl-2 border-l border-deep-navy-200" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-deep-navy-50 transition-colors focus:outline-none"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-deep-navy-300"
                    />
                    <div className="text-left hidden md:block">
                      <span className="text-xs font-bold text-deep-navy-900 block leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Student</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-deep-navy-200 rounded-xl shadow-xl py-2 z-50 text-left animate-fadeIn">
                      <div className="px-4 py-2 border-b border-deep-navy-100">
                        <p className="text-xs font-bold text-deep-navy-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-deep-navy-800 hover:bg-deep-navy-50 hover:text-royal-blue-600 transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-royal-blue-600" />
                          <span>LMS Dashboard</span>
                        </Link>
                        <Link
                          to="/dashboard/my-courses"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-deep-navy-800 hover:bg-deep-navy-50 hover:text-royal-blue-600 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-royal-blue-600" />
                          <span>My Enrolled Courses</span>
                        </Link>
                        <Link
                          to="/dashboard/certificates"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-deep-navy-800 hover:bg-deep-navy-50 hover:text-royal-blue-600 transition-colors"
                        >
                          <Award className="w-4 h-4 text-royal-blue-600" />
                          <span>Certificates</span>
                        </Link>
                      </div>

                      <div className="border-t border-deep-navy-100 pt-1 mt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-2 border-l border-deep-navy-200">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-deep-navy-800 hover:text-royal-blue-600 hover:bg-deep-navy-50 rounded-lg transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger toggle */}
            <div className="lg:hidden flex items-center gap-2">
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="p-2 text-deep-navy-900 hover:text-royal-blue-600"
                  aria-label="Dashboard"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-deep-navy-900 hover:text-royal-blue-600 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white flex flex-col pt-20 px-6 lg:hidden border-b border-deep-navy-200 overflow-y-auto">
          {/* Mobile search form */}
          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-deep-navy-50 border border-deep-navy-200 rounded-xl py-2.5 pl-4 pr-10 text-xs focus:border-royal-blue-600 focus:outline-none text-deep-navy-900"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Nav links stack */}
          <div className="flex flex-col gap-3 mb-6 text-left">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-bold py-2 px-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-royal-blue-50 text-royal-blue-600'
                      : 'text-deep-navy-900 hover:bg-deep-navy-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openEnquiryModal();
              }}
              className="flex items-center gap-2 text-sm font-bold text-royal-blue-600 py-2 px-3 bg-royal-blue-50 rounded-lg text-left"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Talk to an Advisor</span>
            </button>
          </div>

          {/* Auth stack */}
          <div className="border-t border-deep-navy-200 pt-5 mt-auto pb-8 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full py-2.5 rounded-xl text-center font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Go to LMS Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-deep-navy-50 border border-deep-navy-200 text-deep-navy-900 rounded-xl text-center font-bold text-xs hover:bg-deep-navy-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 border border-deep-navy-200 text-deep-navy-900 hover:bg-deep-navy-50 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full py-2.5 rounded-xl text-center font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
