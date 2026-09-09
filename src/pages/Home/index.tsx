import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  Users,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  GraduationCap,
  Wrench,
  PhoneCall,
  CheckCircle,
  Briefcase,
  BadgeCheck,
  Building2,
  Headphones,
  Video,
  FolderGit2,
  UserCheck,
  Cpu
} from 'lucide-react';
import { courses } from '../../data/courses';
import { blogPosts } from '../../data/blog';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

// Hero slide definitions matching EDQOO visual identity
const heroSlides = [
  {
    id: 'slide-1',
    launchBadge: 'Enterprise Technology Masterclasses & Live Hybrid Tracks',
    accentLine: 'Learn Practical Tech.',
    mainLine: 'Build Production Systems from Day 1',
    pills: ['AI-Age Curriculum', 'Hands-on Cloud Labs', 'Real-World Projects'],
    primaryCta: 'Explore All Programs',
    primaryLink: '/courses',
    secondaryCta: 'Talk to Advisor',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop',
    statHighlight: '53% of learners received 50% and above salary hike post completion of the program*',
    partnerLogo: 'Enterprise Benchmark'
  },
  {
    id: 'slide-2',
    launchBadge: 'Master Program in Data Science and AI',
    accentLine: 'Engineer Real AI.',
    mainLine: 'Deploy Predictive Models & GenAI from Day 1',
    pills: ['Python & PyTorch', 'LLMs & RAG Architectures', '1:1 Mentor Reviews'],
    primaryCta: 'View Data Science & AI',
    primaryLink: '/courses/master-program-data-science-ai',
    secondaryCta: 'Request Syllabus',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    statHighlight: '94% of alumni report direct career advancement in data & AI operations*',
    partnerLogo: 'Accredited Labs'
  },
  {
    id: 'slide-3',
    launchBadge: 'Master Program in AI and Machine Learning',
    accentLine: 'Master Modern AI.',
    mainLine: 'Build Deep Neural Networks & Autonomous Agents',
    pills: ['Computer Vision', 'Transformers & NLP', 'vLLM Model Serving'],
    primaryCta: 'View AI & ML Track',
    primaryLink: '/courses/master-program-ai-machine-learning',
    secondaryCta: 'Book Advisory Call',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1600&auto=format&fit=crop',
    statHighlight: 'Over 2,500+ active practitioners enrolled across modern engineering tracks*',
    partnerLogo: 'Global Standards'
  },
  {
    id: 'slide-4',
    launchBadge: 'Tools And Upskills — Executive Fast-Track (24–36 Hours)',
    accentLine: 'Executive Power Skills.',
    mainLine: 'Master Python, SQL, Power BI & Prompt Engineering',
    pills: ['24–36 Hours Intensive', 'Executive Certificate', 'Instant Workplace Impact'],
    primaryCta: 'Explore Tools & Upskills',
    primaryLink: '/courses',
    secondaryCta: 'Enquire for Teams',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
    statHighlight: '100% lab-driven curriculum audited and verified by enterprise architects*',
    partnerLogo: 'Industry Verified'
  }
];

// Clean category navigation
const categoryNav = [
  { id: 'all', label: 'All Programs', count: courses.length, icon: Layers },
  { id: 'Master Programs', label: 'Master Programs', count: courses.filter(c => c.category === 'Master Programs').length, icon: GraduationCap },
  { id: 'Tools And Upskills', label: 'Tools And Upskills', count: courses.filter(c => c.category === 'Tools And Upskills').length, icon: Wrench }
];

// Key Highlights data structured into the recommended groups
const highlightGroups = [
  {
    id: 'learning',
    category: 'Learning',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: BookOpen,
    items: [
      { text: '218 Hrs of Self-Paced Learning', icon: Clock },
      { text: '100+ Live Sessions Across 12 Months', icon: Video },
      { text: '50+ Industry Projects & Case Studies', icon: FolderGit2 }
    ]
  },
  {
    id: 'faculty-support',
    category: 'Faculty & Support',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Users,
    items: [
      { text: 'Learn from NIT Faculty & Industry Practitioners', icon: GraduationCap },
      { text: '24×7 Support', icon: Headphones },
      { text: 'Dedicated Learning Management Team', icon: Users }
    ]
  },
  {
    id: 'technology',
    category: 'Technology',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Cpu,
    items: [
      { text: 'AI Powered LMS', icon: Sparkles }
    ]
  },
  {
    id: 'campus-certification',
    category: 'Campus & Certification',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Award,
    items: [
      { text: '2 Days Campus Immersion at theccpeeps', icon: Building2 },
      { text: 'theccpeeps Certification', icon: BadgeCheck }
    ]
  },
  {
    id: 'career',
    category: 'Career',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: Briefcase,
    items: [
      { text: '3 Guaranteed Job Interviews upon movement to Placement Pool', icon: Briefcase }
    ]
  },
  {
    id: 'audience',
    category: 'Audience',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: UserCheck,
    items: [
      { text: 'Designed for Working Professionals and Freshers', icon: UserCheck }
    ]
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { openEnquiryModal } = useEnquiry();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statsAnimated, setStatsAnimated] = useState(false);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Hero auto-slider timer (6 seconds)
  useEffect(() => {
    if (isSlidePaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isSlidePaused]);

  // Statistics Intersection Observer for animated counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsAnimated(true);
        }
      },
      { threshold: 0.25 }
    );
    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Touch Swipe handlers for hero slider
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      } else {
        setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      }
    }
    touchStartX.current = null;
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Filter courses based on active category
  const displayedCourses = courses.filter((course) => {
    if (selectedCategory === 'all') return true;
    return course.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const currentHero = heroSlides[activeSlide];

  return (
    <div className="space-y-0 text-left bg-white">
      <SEO 
        title="Edqoo | Your Skill Partner - Master Programs & Tools And Upskills" 
        description="Accelerate your career with industry-aligned Master Programs in Data Science, AI, Python, Data Analytics, and Executive Upskilling tracks with NIT faculty and theccpeeps certification."
        canonical="/"
      />

      {/* ========================================================================= */}
      {/* 1. HERO SLIDER SECTION (EDQOO BRAND THEME) */}
      {/* ========================================================================= */}
      <section
        className="relative bg-white text-slate-900 overflow-hidden pt-8 pb-0 sm:pt-14 sm:pb-0 border-b border-slate-200 select-none min-h-[520px] lg:min-h-[580px] flex flex-col justify-between"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Right-aligned Photographic Banner with Left Seamless Fade Mask */}
        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[62%] h-full pointer-events-none z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentHero.id}
              src={currentHero.image}
              alt={currentHero.mainLine}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full h-full object-cover object-center lg:object-right opacity-80 sm:opacity-90"
            />
          </AnimatePresence>
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-6 sm:py-10">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            
            {/* Launch Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{currentHero.launchBadge}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <span className="block text-purple-600 font-display font-extrabold text-lg sm:text-2xl lg:text-3xl tracking-tight">
                {currentHero.accentLine}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight leading-[1.12]">
                {currentHero.mainLine}
              </h1>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {currentHero.pills.map((pill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100/90 border border-slate-200/80 rounded-lg text-xs font-bold text-slate-700 backdrop-blur-xs"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-4">
              <Link
                to={currentHero.primaryLink}
                className="btn-primary px-6 py-3 text-xs sm:text-sm font-bold rounded-xl shadow-md inline-flex items-center gap-2"
              >
                <span>{currentHero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="btn-secondary px-6 py-3 text-xs sm:text-sm font-bold rounded-xl shadow-2xs"
              >
                {currentHero.secondaryCta}
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Process Advisors / Outcome Highlight Strip */}
        <div className="relative z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-900">{currentHero.partnerLogo}:</span>
              <span className="truncate max-w-xs sm:max-w-md md:max-w-xl">
                {currentHero.statHighlight}
              </span>
            </div>

            {/* Slider Navigation Dots & Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex gap-1.5 mr-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === idx ? 'w-6 bg-purple-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={prevSlide}
                className="p-1.5 rounded-lg bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-purple-200 transition-colors shadow-2xs"
                aria-label="Previous outcome"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 rounded-lg bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-purple-200 transition-colors shadow-2xs"
                aria-label="Next outcome"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST & ENTERPRISE STANDARDS SECTION */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left flex-shrink-0">
              <span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-widest block">
                LEARNING EXCELLENCE
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                Programs Engineered to Industry Standards
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                100% Practical Labs
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <BadgeCheck className="w-4 h-4 text-purple-600" />
                theccpeeps Certification
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                NIT Faculty & Practitioners
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <Briefcase className="w-4 h-4 text-purple-600" />
                3 Guaranteed Job Interviews*
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. KEY HIGHLIGHTS SECTION (New Requirements) */}
      {/* ========================================================================= */}
      <section id="highlights" className="section-padding bg-gradient-to-b from-white via-purple-50/20 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-purple-600 text-xs font-extrabold tracking-widest uppercase block">
              PROGRAM PILLARS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
              Key Highlights
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Experience an unmatched standard of practical technology education designed with academic rigor and enterprise outcomes.
            </p>
          </div>

          {/* Grouped Highlights Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div
                  key={group.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-4">
                    {/* Header with Group Category Badge */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${group.badgeColor}`}>
                        {group.category}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <GroupIcon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Highlights List inside this Card */}
                    <ul className="space-y-3">
                      {group.items.map((item, idx) => {
                        const ItemIcon = item.icon;
                        return (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-0.5 p-1 rounded-md bg-purple-50 text-purple-700 flex-shrink-0">
                              <ItemIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                              {item.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Micro Accent */}
                  <div className="pt-2 border-t border-slate-50 flex items-center gap-1.5 text-[10px] font-bold text-purple-600">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                    <span>Verified EDQOO Standard</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COURSES / PROGRAMS SECTION (Master Programs & Tools And Upskills) */}
      {/* ========================================================================= */}
      <section id="programs" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-purple-600 text-xs font-extrabold tracking-widest uppercase block">
              EXPLORE CURRICULUM
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
              Featured Programs & Executive Tracks
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Choose between comprehensive <strong>Master Programs</strong> for career transformations or intensive <strong>Tools And Upskills</strong> executive tracks (24–36 Hours).
            </p>
          </div>

          {/* 2-Column Grid: Left Category Sidebar + Right Course Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Category Sidebar (Desktop) */}
            <aside className="hidden lg:block lg:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-2xs sticky top-20">
              <div className="px-3 py-2 border-b border-slate-200/80 mb-2">
                <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider block">
                  Program Tracks
                </span>
              </div>
              <div className="space-y-1.5">
                {categoryNav.map((cat) => {
                  const IconComponent = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-bold rounded-xl transition-all text-left ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-white hover:text-purple-600'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{cat.label}</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Info Card */}
              <div className="mt-4 p-3 bg-purple-50/80 border border-purple-200/70 rounded-xl space-y-1.5 text-left">
                <div className="flex items-center gap-1.5 text-purple-800 font-bold text-xs">
                  <BadgeCheck className="w-4 h-4 text-purple-600" />
                  <span>theccpeeps Certified</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  All courses include NIT faculty mentoring, AI-powered LMS access, and placement interview readiness.
                </p>
              </div>
            </aside>

            {/* Horizontal scrollable pills filter (Mobile / Tablet) */}
            <div className="lg:hidden w-full overflow-x-auto pb-2 scrollbar-none flex gap-2 mb-2">
              {categoryNav.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap border flex-shrink-0 flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Courses Cards Grid */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Header / Results counter */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-500">
                  Showing <strong className="text-slate-900">{displayedCourses.length}</strong> Programs in{' '}
                  <span className="text-purple-600">
                    {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                  </span>
                </span>
                <Link
                  to="/courses"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
                >
                  <span>View Full Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayedCourses.map((course) => {
                  const isToolsAndUpskills = course.category === 'Tools And Upskills';
                  return (
                    <div
                      key={course.id}
                      onClick={() => navigate(`/courses/${course.slug}`)}
                      className="premium-card cursor-pointer flex flex-col justify-between overflow-hidden group bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      {/* Course Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-xs border ${
                          isToolsAndUpskills
                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-800'
                            : 'bg-purple-50/90 border-purple-300 text-purple-800'
                        }`}>
                          {course.category}
                        </span>

                        {isToolsAndUpskills ? (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-extrabold rounded-md shadow-sm">
                            24–36 Hours
                          </span>
                        ) : (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-md shadow-sm">
                            Master Track
                          </span>
                        )}
                      </div>

                      {/* Card Content Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-left">
                        <div className="space-y-1.5">
                          <h3 className="font-display font-bold text-sm text-slate-950 group-hover:text-purple-600 transition-colors line-clamp-1">
                            <Link to={`/courses/${course.slug}`} onClick={(e) => e.stopPropagation()}>
                              {course.title}
                            </Link>
                          </h3>
                          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        {/* Skills Tags */}
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-1.5 py-0.5 bg-purple-50/70 border border-purple-100 text-purple-800 text-[9px] font-semibold rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {course.skills.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-medium rounded">
                              +{course.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Course Metadata (Duration, Mode, Rating) */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
                          <span className="flex items-center gap-1 font-bold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-purple-600" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            {isToolsAndUpskills ? 'Executive' : 'Master Track'}
                          </span>
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {course.rating > 0 ? course.rating : '4.9'}
                          </span>
                        </div>

                        {/* Action & Pricing Footer */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 line-through leading-none">
                              ₹{course.originalPrice}
                            </span>
                            <span className="text-slate-950 font-extrabold text-sm leading-tight">
                              ₹{course.price}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEnquiryModal(course.title);
                              }}
                              className="btn-primary px-3 py-1.5 text-[10px] font-bold rounded-lg inline-flex items-center gap-1 shadow-2xs"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Enquire Now</span>
                            </button>
                            <Link
                              to={`/courses/${course.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-2.5 py-1.5 text-[10px] font-bold text-slate-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 border border-slate-200 transition-colors inline-flex items-center gap-1"
                            >
                              <span>Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ANIMATED STATISTICS SECTION */}
      {/* ========================================================================= */}
      <section
        ref={statsSectionRef}
        className="bg-gradient-to-r from-purple-800 via-purple-600 to-purple-900 text-white py-12 sm:py-16 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            
            {/* Stat 1 */}
            <div className="space-y-1.5 p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-white mb-2">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white block">
                {statsAnimated ? '2,500+' : '0'}
              </span>
              <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider block">
                Active Learners
              </span>
            </div>

            {/* Stat 2 */}
            <div className="space-y-1.5 p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-white mb-2">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white block">
                {statsAnimated ? '4.9 / 5.0' : '0.0'}
              </span>
              <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider block">
                Average Rating
              </span>
            </div>

            {/* Stat 3 */}
            <div className="space-y-1.5 p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-white mb-2">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white block">
                {statsAnimated ? '3 Guaranteed' : '0'}
              </span>
              <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider block">
                Placement Interviews*
              </span>
            </div>

            {/* Stat 4 */}
            <div className="space-y-1.5 p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-white mb-2">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white block">
                {statsAnimated ? '10 Programs' : '0'}
              </span>
              <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider block">
                Master & Executive Tracks
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. "WHY CHOOSE US" / PEDAGOGY */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 border-b border-slate-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-purple-600 text-xs font-extrabold tracking-widest uppercase block">
              OUR PEDAGOGY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
              Discover What Makes Edqoo Unique
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              We focus on building functional ability through hands-on labs, NIT faculty mentoring, and verified industry credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'NIT Faculty & Industry Practitioners',
                icon: GraduationCap,
                desc: 'Learn directly from NIT faculty and seasoned technology leaders who architect enterprise systems.'
              },
              {
                title: 'theccpeeps Certification & Campus Immersion',
                icon: Award,
                desc: 'Gain verified industry credentials and participate in an exclusive 2-day campus immersion experience.'
              },
              {
                title: 'Career Placement & 24×7 Support',
                icon: Briefcase,
                desc: 'Access 3 guaranteed job interviews upon placement pool entry, backed by our dedicated learning management team.'
              }
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs hover:border-purple-400 hover:shadow-md transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-105 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-950 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PROMOTIONAL LEAD BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3.5 text-left">
            <span className="inline-block px-3 py-1 bg-white/20 border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-xs">
              Career Advisory
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Start Learning Today — Accelerate Your Career
            </h3>
            <p className="text-purple-100 text-xs sm:text-sm leading-relaxed max-w-xl">
              Connect with our learning advisors for a personalized track assessment, course roadmap, and customized corporate training options.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="btn-primary bg-white text-purple-800 border-white hover:bg-purple-50 hover:text-purple-900 px-6 py-2.5 text-xs font-bold rounded-xl shadow-md"
              >
                Request Free Advisory Session
              </button>
              <Link
                to="/courses"
                className="btn-secondary bg-transparent text-white border-white/40 hover:bg-white/15 px-6 py-2.5 text-xs font-bold rounded-xl"
              >
                Explore All Programs
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop"
                alt="Advisory session"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. LATEST MEDIA & INSIGHTS SPOTLIGHT */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div className="text-left space-y-1">
              <span className="text-purple-600 text-xs font-extrabold tracking-widest uppercase block">
                MEDIA & INSIGHTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950">
                Latest Insights & Industry Spotlights
              </h2>
            </div>
            <Link to="/resources" className="btn-secondary text-xs px-4 py-2 font-bold rounded-lg whitespace-nowrap">
              View All Articles
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:border-purple-300 hover:shadow-md transition-all group text-left"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-bold text-purple-600 uppercase">
                      {post.category}
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-950 group-hover:text-purple-600 transition-colors line-clamp-2">
                      <Link to={`/resources/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-3 border-t border-slate-100">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-white via-purple-50/40 to-slate-50 text-slate-950 py-16 text-center border-t border-slate-200 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
            Ready to Build Your Next Career Milestone?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-normal">
            Join ambitious learners building verified technological competencies across Master Programs and Executive Tools tracks. Speak with an advisor today.
          </p>
          <div className="flex justify-center gap-3.5 pt-2">
            <Link
              to="/courses"
              className="btn-primary px-8 py-3.5 text-xs sm:text-sm font-bold rounded-xl shadow-md"
            >
              Explore Programs
            </Link>
            <button
              type="button"
              onClick={() => openEnquiryModal()}
              className="btn-secondary px-8 py-3.5 text-xs sm:text-sm font-bold rounded-xl shadow-2xs"
            >
              Speak to Advisor
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
