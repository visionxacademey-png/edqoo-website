import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  LogIn,
  UserPlus,
  ChevronDown,
  PhoneCall,
  MessageSquareCheck,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  Handshake,
  GraduationCap,
  Users,
  Info,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEnquiry } from '../../context/EnquiryContext';
import { CourseSearchBar } from '../common/CourseSearchBar';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const { openEnquiryModal } = useEnquiry();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Active section detectors
  const isOrgActive = location.pathname === '/hire-from-us' || location.pathname === '/become-a-partner';
  const isProActive = location.pathname === '/become-an-instructor' || location.pathname.startsWith('/instructors');
  const isAboutActive = location.pathname === '/about' || location.pathname === '/leadership-council';

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

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-2.5 shadow-sm border-b border-slate-200/80 text-slate-900'
            : 'bg-white text-slate-900 py-3 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 xl:gap-4">
            
            {/* Left: Official Brand Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center focus:outline-none group">
                <img 
                  src="/logo.jpg" 
                  alt="EDQOO - Your skill partner" 
                  className="h-9 sm:h-10 xl:h-11 w-auto object-contain max-w-[125px] sm:max-w-[145px] xl:max-w-[160px] transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation Links with Rich Dropdowns */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-[13px] xl:text-[14px] font-semibold tracking-normal px-2.5 xl:px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'text-purple-600 bg-purple-50/70 font-bold'
                      : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `text-[13px] xl:text-[14px] font-semibold tracking-normal px-2.5 xl:px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'text-purple-600 bg-purple-50/70 font-bold'
                      : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'
                  }`
                }
              >
                Programs
              </NavLink>

              {/* For Organizations Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('organizations')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'organizations' ? null : 'organizations')}
                  className={`inline-flex items-center gap-1 text-[13px] xl:text-[14px] font-semibold tracking-normal px-2.5 xl:px-3 py-1.5 rounded-lg transition-all ${
                    isOrgActive || activeDropdown === 'organizations'
                      ? 'text-purple-600 bg-purple-50/70 font-bold'
                      : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Organizations</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'organizations' ? 'rotate-180 text-purple-600' : 'text-slate-400'
                    }`}
                  />
                </button>

                {activeDropdown === 'organizations' && (
                  <div className="absolute top-full left-0 pt-1.5 w-64 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-purple-950/5 p-2 text-left">
                      <Link
                        to="/hire-from-us"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">Hire From Us</span>
                          <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">Recruit trained AI &amp; tech talent</span>
                        </div>
                      </Link>
                      <Link
                        to="/become-a-partner"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50 transition-colors group mt-0.5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Handshake className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">Become a Partner</span>
                          <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">Academic &amp; corporate alliances</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* For Professionals Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('professionals')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'professionals' ? null : 'professionals')}
                  className={`inline-flex items-center gap-1 text-[13px] xl:text-[14px] font-semibold tracking-normal px-2.5 xl:px-3 py-1.5 rounded-lg transition-all ${
                    isProActive || activeDropdown === 'professionals'
                      ? 'text-purple-600 bg-purple-50/70 font-bold'
                      : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Educators</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'professionals' ? 'rotate-180 text-purple-600' : 'text-slate-400'
                    }`}
                  />
                </button>

                {activeDropdown === 'professionals' && (
                  <div className="absolute top-full left-0 pt-1.5 w-64 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-purple-950/5 p-2 text-left">
                      <Link
                        to="/become-an-instructor"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">Become an Instructor</span>
                          <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">Teach &amp; mentor global learners</span>
                        </div>
                      </Link>
                      <Link
                        to="/instructors"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50 transition-colors group mt-0.5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">Faculty Directory</span>
                          <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">Meet our NIT &amp; industry faculty</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
                  className={`inline-flex items-center gap-1 text-[13px] xl:text-[14px] font-semibold tracking-normal px-2.5 xl:px-3 py-1.5 rounded-lg transition-all ${
                    isAboutActive || activeDropdown === 'about'
                      ? 'text-purple-600 bg-purple-50/70 font-bold'
                      : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'
                  }`}
                >
                  <span>About</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'about' ? 'rotate-180 text-purple-600' : 'text-slate-400'
                    }`}
                  />
                </button>

                {activeDropdown === 'about' && (
                  <div className="absolute top-full left-0 pt-1.5 w-64 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-purple-950/5 p-2 text-left">
                      <Link
                        to="/about"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Info className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">About Us</span>
                          <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">Mission, vision &amp; learning model</span>
                        </div>
                      </Link>
                      <Link
                        to="/leadership-council"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50 transition-colors group mt-0.5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">Leadership Council</span>
                          <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">Advisory &amp; strategic leadership</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-[13px] xl:text-[14px] font-semibold tracking-normal px-2.5 xl:px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'text-purple-600 bg-purple-50/70 font-bold'
                      : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'
                  }`
                }
              >
                Contact
              </NavLink>
            </div>

            {/* Right: Search + Action CTA + Auth Hub */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
              {/* Dynamic Real-Time Course Search */}
              <CourseSearchBar
                variant="desktop"
                placeholder="Search programs..."
              />

              {/* Advisory CTA button */}
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="inline-flex items-center gap-1.5 px-3.5 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-[13px] font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.98] rounded-xl transition-all shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Enquire Now</span>
              </button>

              {/* Authentication Controls */}
              {isAuthenticated && user ? (
                <div className="relative pl-2 border-l border-slate-200" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none border border-transparent hover:border-slate-200"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-purple-200"
                    />
                    <div className="text-left hidden xl:block">
                      <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[100px]">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-purple-600 font-semibold capitalize block">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-purple-950/10 py-2 z-50 text-left animate-fadeIn">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50/80 hover:bg-purple-100 transition-colors border-b border-purple-100 mb-1"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-600" />
                          <span>Dashboard Overview</span>
                        </Link>
                        <Link
                          to="/dashboard/enquiries"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          <MessageSquareCheck className="w-4 h-4 text-purple-600" />
                          <span>My Enquiries</span>
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-purple-600" />
                          <span>Profile &amp; Settings</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          onClick={async () => {
                            await logout();
                            setIsUserMenuOpen(false);
                            navigate('/');
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
                <div className="flex items-center gap-1.5 xl:gap-2 pl-2 border-l border-slate-200">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs xl:text-[13px] font-semibold text-slate-700 hover:text-purple-600 hover:bg-purple-50/70 rounded-lg transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1 px-3 xl:px-3.5 py-1.5 text-xs xl:text-[13px] font-bold text-white bg-slate-900 hover:bg-purple-900 rounded-lg transition-colors shadow-2xs"
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
                  className="p-2 text-slate-900 hover:text-purple-600"
                  aria-label="Dashboard"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-slate-900 hover:text-purple-600 transition-colors focus:outline-none"
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
        <div className="fixed inset-0 z-30 bg-white flex flex-col pt-20 px-6 lg:hidden border-b border-slate-200 overflow-y-auto text-left">
          {/* Logo on top of mobile menu */}
          <div className="mb-4">
            <img 
              src="/logo.jpg" 
              alt="EDQOO - Your skill partner" 
              className="h-10 w-auto object-contain max-w-[135px]" 
            />
          </div>

          {/* Dynamic Mobile Real-Time Search Bar */}
          <div className="mb-6">
            <CourseSearchBar
              variant="mobile"
              placeholder="Search programs..."
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </div>

          {/* Nav links stack */}
          <div className="flex flex-col gap-1 mb-6">
            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-xs font-bold py-2 px-3 rounded-lg transition-all ${
                  isActive ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-xs font-bold py-2 px-3 rounded-lg transition-all ${
                  isActive ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              Explore Programs
            </NavLink>

            {/* Organizations Group */}
            <div className="pt-2 pb-1 px-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                For Organizations
              </span>
            </div>
            <NavLink
              to="/hire-from-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-xs font-bold py-2 px-3 pl-5 rounded-lg transition-all ${
                  isActive ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              Hire From Us
            </NavLink>
            <NavLink
              to="/become-a-partner"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-xs font-bold py-2 px-3 pl-5 rounded-lg transition-all ${
                  isActive ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              Become a Partner
            </NavLink>

            {/* Professionals Group */}
            <div className="pt-2 pb-1 px-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                For Professionals &amp; Faculty
              </span>
            </div>
            <NavLink
              to="/become-an-instructor"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-xs font-bold py-2 px-3 pl-5 rounded-lg transition-all ${
                  isActive ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              Become an Instructor
            </NavLink>
            <NavLink
              to="/instructors"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-xs font-bold py-2 px-3 pl-5 rounded-lg transition-all ${
                  isActive ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              Instructors Directory
            </NavLink>

            {/* About Group */}
            <div className="pt-2 pb-1 px-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                About Edqoo
              </span>
            </div>
            <NavLink
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-xs font-bold py-2 px-3 pl-5 rounded-lg transition-all ${
                  isActive ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/leadership-council"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-xs font-bold py-2 px-3 pl-5 rounded-lg transition-all ${
                  isActive ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              Leadership Council
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-xs font-bold py-2 px-3 rounded-lg transition-all mt-1 ${
                  isActive ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              Contact Us
            </NavLink>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openEnquiryModal();
              }}
              className="flex items-center gap-2 text-xs font-bold text-purple-700 py-2.5 px-3 bg-purple-50 border border-purple-200 rounded-xl text-left mt-2"
            >
              <PhoneCall className="w-4 h-4 text-purple-600" />
              <span>Enquire Now / Talk to Advisor</span>
            </button>
          </div>

          {/* Auth stack */}
          <div className="border-t border-slate-200 pt-5 mt-auto pb-8 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-purple-900 text-white rounded-xl text-center font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-300" />
                    <span>Admin Control Portal</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full py-2.5 rounded-xl text-center font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to My Dashboard</span>
                </Link>
                <Link
                  to="/dashboard/enquiries"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl text-center font-bold text-xs hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquareCheck className="w-4 h-4" />
                  <span>My Enquiries</span>
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-center font-bold text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
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
                  className="w-full py-2.5 border border-slate-200 text-slate-900 hover:bg-slate-50 hover:text-purple-600 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5"
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
