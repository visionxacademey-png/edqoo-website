import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LogOut, User, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Scroll event detector to compress navbar height and inject shadows
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    // { to: '/categories', label: 'Categories' },
    { to: '/about', label: 'About' },
    { to: '/resources', label: 'Resources' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm border-b border-deep-navy-200/80 text-deep-navy-900'
            : 'bg-white text-deep-navy-900 py-4 border-b border-deep-navy-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Branding Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-royal-blue-600 to-royal-blue-500 flex items-center justify-center text-white font-display font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
                E
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-deep-navy-900">
                Edqoo
              </span>
            </Link>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-semibold tracking-wide transition-all hover:text-royal-blue-500 ${
                      isActive ? 'text-royal-blue-500 font-bold' : 'text-deep-navy-800/85'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right: Actions, Search, Auth */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search Bar Form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 bg-deep-navy-50 border border-deep-navy-200 rounded-full py-1.5 pl-4 pr-10 text-xs focus:w-60 focus:bg-white focus:border-royal-blue-500 focus:outline-none transition-all duration-300 text-deep-navy-900 placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-royal-blue-500 transition-colors"
                >
                  <Search className="w-4.5 h-4.5" />
                </button>
              </form>

              {/* Login / Dashboard Profile triggers */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 border-l border-deep-navy-200 pl-4">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-royal-blue-600 hover:bg-royal-blue-700 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    LMS Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100"
                    title="Log Out"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* <Link
                    to="/login"
                    className="text-xs font-semibold text-deep-navy-800/85 hover:text-royal-blue-500 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-semibold px-4 py-2 bg-royal-blue-600 hover:bg-royal-blue-700 text-white rounded-lg transition-colors shadow-sm"
                  >
                    Get Started
                  </Link> */}
                </div>
              )}
            </div>

            {/* Mobile Hamburger toggle */}
            <div className="lg:hidden flex items-center gap-3">
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="p-2 text-deep-navy-800/85 hover:text-royal-blue-500 transition-colors"
                  title="My Dashboard"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-deep-navy-800/85 hover:text-royal-blue-500 transition-colors focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 animate-pulse" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white flex flex-col pt-24 px-6 lg:hidden border-b border-deep-navy-200">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-deep-navy-50 border border-deep-navy-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:border-royal-blue-500 focus:outline-none text-deep-navy-900 placeholder-slate-400"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Nav links stack */}
          <div className="flex flex-col gap-5 mb-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-bold tracking-wide transition-all ${
                    isActive ? 'text-royal-blue-500' : 'text-deep-navy-900/85'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth stack */}
          <div className="border-t border-deep-navy-200 pt-6 mt-auto pb-10 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 bg-royal-blue-600 hover:bg-royal-blue-700 text-white rounded-xl text-center font-bold text-sm shadow-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-deep-navy-50 border border-deep-navy-200 text-deep-navy-900 rounded-xl text-center font-bold text-sm hover:bg-deep-navy-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 border border-deep-navy-200 text-deep-navy-900 hover:bg-deep-navy-50 rounded-xl text-center font-bold text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 bg-royal-blue-600 hover:bg-royal-blue-700 text-white rounded-xl text-center font-bold text-sm shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
