import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Users,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Wrench,
  PhoneCall,
  CheckCircle,
  Briefcase,
  Brain,
  BarChart3,
  Cpu
} from 'lucide-react';
import { courses, filterCoursesByCategory, normalizeCategoryName } from '../../data/courses';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';
import { KeyHighlights } from '../../components/common/KeyHighlights';

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
    desktopImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1080&h=1920&auto=format&fit=crop',
    statHighlight: '53% of learners received 50% and above salary hike post completion of the program*',
    partnerLogo: 'Enterprise Benchmark'
  },
  {
    id: 'slide-2',
    launchBadge: 'Advanced Executive Program in Data Science and AI',
    accentLine: 'Engineer Real AI.',
    mainLine: 'Deploy Predictive Models & GenAI from Day 1',
    pills: ['Python & PyTorch', 'LLMs & RAG Architectures', '1:1 Mentor Reviews'],
    primaryCta: 'View Data Science and AI',
    primaryLink: '/courses/advanced-executive-program-data-science-ai',
    secondaryCta: 'Request Syllabus',
    desktopImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1080&h=1920&auto=format&fit=crop',
    statHighlight: '94% of alumni report direct career advancement in data & AI operations*',
    partnerLogo: 'Accredited Labs'
  },
  {
    id: 'slide-3',
    launchBadge: 'Executive Professional Certificate in Data Science and AI',
    accentLine: 'Master Modern AI.',
    mainLine: 'Build Deep Neural Networks & Autonomous Agents',
    pills: ['Computer Vision', 'Transformers & NLP', 'MLOps Serving'],
    primaryCta: 'View AI and Machine Learning Track',
    primaryLink: '/courses/executive-professional-certificate-data-science-ai',
    secondaryCta: 'Book Advisory Call',
    desktopImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1080&h=1920&auto=format&fit=crop',
    statHighlight: 'Over 2,500+ active practitioners enrolled across modern engineering tracks*',
    partnerLogo: 'Global Standards'
  },
  {
    id: 'slide-4',
    launchBadge: 'Tools and Upskills — Executive Fast-Tracks',
    accentLine: 'Executive Power Skills.',
    mainLine: 'Master Python, SQL, Power BI & Prompt Engineering',
    pills: ['Flexible Duration', 'Executive Certificate', 'Instant Workplace Impact'],
    primaryCta: 'Explore Tools & Upskills',
    primaryLink: '/courses',
    secondaryCta: 'Enquire for Teams',
    desktopImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1080&h=1920&auto=format&fit=crop',
    statHighlight: '100% lab-driven curriculum audited and verified by enterprise architects*',
    partnerLogo: 'Industry Verified'
  }
];

// Clean category navigation with the exact category tracks
const categoryNav = [
  { id: 'all', label: 'All Categories', icon: Layers },
  { id: 'Data Science and AI', label: 'Data Science and AI', icon: Brain },
  { id: 'Data Analytics and AI', label: 'Data Analytics and AI', icon: BarChart3 },
  { id: 'AI and Machine Learning', label: 'AI and Machine Learning', icon: Cpu },
  { id: 'Tools and Upskills', label: 'Tools and Upskills', icon: Wrench },
  { id: 'Free Learning', label: 'Free Learning', icon: BookOpen }
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

  // Preload all hero slide images for instant switching (desktop and mobile)
  useEffect(() => {
    heroSlides.forEach((slide) => {
      const desktopImg = new Image();
      desktopImg.src = slide.desktopImage || slide.image;
      if (slide.mobileImage) {
        const mobileImg = new Image();
        mobileImg.src = slide.mobileImage;
      }
    });
  }, []);

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
  const displayedCourses = filterCoursesByCategory(courses, selectedCategory);

  const currentHero = heroSlides[activeSlide];

  return (
    <div className="space-y-0 text-left bg-white">
      <SEO 
        title="Edqoo | Your Skill Partner - Master Programs & Tools And Upskills" 
        description="Accelerate your career with industry-aligned Master Programs in Data Science, AI, Python, Data Analytics, and Executive Upskilling tracks."
        canonical="/"
      />

      {/* ========================================================================= */}
      {/* 1A. DEDICATED MOBILE HERO SLIDER (SEPARATE PORTRAIT-FIRST PRESENTATION)   */}
      {/* ========================================================================= */}
      <section
        className="flex md:hidden relative bg-white text-slate-900 overflow-hidden w-full max-w-full select-none min-h-[calc(100svh-64px)] flex-col justify-between border-b border-slate-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Portrait Hero Background Stage with Multi-Stop Readable Gradient */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentHero.id}
              src={currentHero.mobileImage}
              alt={currentHero.mainLine}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </AnimatePresence>
          {/* Multi-stop gradient overlay tailored for mobile typography legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 top-[28%] bg-gradient-to-t from-white via-white/95 to-transparent" />
        </div>

        {/* Mobile Hero Content Container */}
        <div className="w-full relative z-10 px-5 pt-6 pb-4 flex-1 flex flex-col justify-end space-y-3.5 text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full space-y-3"
            >
              {/* Launch Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50/95 border border-purple-200/90 text-purple-700 text-[11px] font-bold tracking-wide shadow-2xs backdrop-blur-xs max-w-full">
                <span className="truncate">{currentHero.launchBadge}</span>
              </div>

              {/* Mobile Headline Hierarchy */}
              <div className="space-y-1">
                <span className="block text-purple-600 font-display font-extrabold text-xs sm:text-sm tracking-tight">
                  {currentHero.accentLine}
                </span>
                <h1 className="text-[23px] sm:text-2xl font-display font-black text-slate-950 tracking-tight leading-[1.16]">
                  {currentHero.mainLine}
                </h1>
              </div>

              {/* Mobile Feature Pills */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {currentHero.pills.map((pill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 bg-slate-100/95 border border-slate-200/90 rounded-lg text-[11px] font-semibold text-slate-700 backdrop-blur-xs shadow-2xs"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {/* Mobile Action Buttons - Full-width / Easy Tap */}
              <div className="flex flex-col gap-2 pt-1 w-full">
                <Link
                  to={currentHero.primaryLink}
                  className="btn-primary w-full py-3.5 text-xs font-bold rounded-xl shadow-md inline-flex items-center justify-center gap-2"
                >
                  <span>{currentHero.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => openEnquiryModal()}
                  className="btn-secondary w-full py-3 text-xs font-bold rounded-xl shadow-2xs text-center"
                >
                  {currentHero.secondaryCta}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Highlight Strip & Slide Pagination */}
        <div className="relative z-20 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-5 py-3 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 text-[11px] text-slate-600 mb-2.5 leading-snug"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0 mt-0.5" />
              <p>
                <span className="font-bold text-slate-900">{currentHero.partnerLogo}: </span>
                <span>{currentHero.statHighlight}</span>
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Slider Controls */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? 'w-6 bg-purple-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            {/* <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 transition-colors shadow-2xs"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 transition-colors shadow-2xs"
                aria-label="Next slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div> */}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1B. DESKTOP & TABLET HERO SLIDER SECTION (UNCHANGED)                      */}
      {/* ========================================================================= */}
      <section
        className="hidden md:flex relative bg-white text-slate-900 overflow-hidden pt-8 pb-0 sm:pt-14 sm:pb-0 border-b border-slate-200 select-none min-h-[520px] lg:min-h-[580px] flex-col justify-between"
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
              src={currentHero.desktopImage || currentHero.image}
              alt={currentHero.mainLine}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full object-cover object-center lg:object-right opacity-85 sm:opacity-95"
            />
          </AnimatePresence>
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-white/80 lg:via-white/40 to-transparent z-10" />
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-6 sm:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-2xl space-y-4 sm:space-y-6"
            >
              {/* Launch Badge */}
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold tracking-wide shadow-2xs">
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Process Advisors / Outcome Highlight Strip */}
        <div className="relative z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 text-slate-600 font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900">{currentHero.partnerLogo}:</span>
                <span className="truncate max-w-xs sm:max-w-md md:max-w-xl">
                  {currentHero.statHighlight}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Dots & Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex gap-1.5 mr-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeSlide === idx ? 'w-7 bg-purple-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={prevSlide}
                className="p-1.5 rounded-lg bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 transition-colors shadow-2xs"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 rounded-lg bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 transition-colors shadow-2xs"
                aria-label="Next slide"
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
              {/* <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <BadgeCheck className="w-4 h-4 text-purple-600" />
                theccpeeps Certification
              </span> */}
              {/* <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                NIT Faculty & Practitioners
              </span> */}
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <Briefcase className="w-4 h-4 text-purple-600" />
                3 Guaranteed Job Interviews*
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. KEY HIGHLIGHTS SECTION (Exactly 6 Highlights) */}
      {/* ========================================================================= */}
      <KeyHighlights />

      {/* ========================================================================= */}
      {/* 4. COURSES / PROGRAM TRACKS SECTION */}
      {/* ========================================================================= */}
      <section id="programs" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-purple-600 text-xs font-extrabold tracking-widest uppercase block">
              EXPLORE CURRICULUM
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
              Featured Program Tracks & Courses
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Explore specialized program tracks in <strong>Data Science and AI</strong>, <strong>Data Analytics and AI</strong>, <strong>AI and Machine Learning</strong>, and intensive <strong>Tools and Upskills</strong>.
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
                      className={`w-full flex items-center gap-2.5 px-3.5 py-3 text-xs font-bold rounded-xl transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-white hover:text-purple-600'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Info Card */}
              <div className="mt-4 p-3 bg-purple-50/80 border border-purple-200/70 rounded-xl space-y-1.5 text-left">
                {/* <div className="flex items-center gap-1.5 text-purple-800 font-bold text-xs">
                  <BadgeCheck className="w-4 h-4 text-purple-600" />
                  <span>theccpeeps Certified</span>
                </div> */}
                {/* <p className="text-[11px] text-slate-600 leading-relaxed">
                  All courses include NIT faculty mentoring, AI-powered LMS access, and placement interview readiness.
                </p> */}
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
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap border flex-shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
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
                  const isTools = (course.categories || [course.category]).includes('Tools and Upskills');
                  const isFree = (course.categories || [course.category]).some((c) => normalizeCategoryName(c) === 'Free Learning') || course.price === 0;
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
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[70%]">
                          {(course.categories || [course.category]).map((rawCat) => {
                            const cat = normalizeCategoryName(rawCat);
                            return (
                              <span
                                key={cat}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-xs border ${
                                  cat === 'Free Learning'
                                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-800'
                                    : cat === 'Tools and Upskills'
                                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-800'
                                    : 'bg-purple-50/90 border-purple-300 text-purple-800'
                                }`}
                              >
                                {cat}
                              </span>
                            );
                          })}
                        </div>

                        {isFree ? (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-extrabold rounded-md shadow-sm uppercase tracking-wider">
                            FREE
                          </span>
                        ) : course.liveHours ? (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-extrabold rounded-md shadow-sm">
                            {course.liveHours} Live
                          </span>
                        ) : null}
                      </div>

                      {/* Card Content Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-left">
                        <div className="space-y-1.5">
                          <h3 className="font-display font-bold text-sm text-slate-950 group-hover:text-purple-600 transition-colors line-clamp-2">
                            <Link to={`/courses/${course.slug}`} onClick={(e) => e.stopPropagation()}>
                              {course.title}
                            </Link>
                          </h3>
                          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                            {course.shortDescription || course.description}
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

                        {/* Course Metadata (Duration, Live Hours, Rating) */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
                          <span className="flex items-center gap-1 font-bold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-purple-600" />
                            {course.duration}
                          </span>
                          {course.liveHours ? (
                            <span className="flex items-center gap-1 text-purple-700 font-bold">
                              <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                              {course.liveHours}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              {isFree ? 'Free Learning' : isTools ? 'Executive' : 'Master Track'}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {course.rating > 0 ? course.rating : '4.9'}
                          </span>
                        </div>

                        {/* Action & Pricing Footer */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 w-full">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEnquiryModal(course.title, {
                                  category: isFree ? 'Free Learning' : selectedCategory === 'Tools and Upskills' ? 'Tools and Upskills' : course.category,
                                  courseId: course.id,
                                  categories: course.categories
                                });
                              }}
                              className="btn-primary flex-1 py-1.5 text-[10px] font-bold rounded-lg inline-flex items-center justify-center gap-1 shadow-2xs"
                            >
                              {isFree ? (
                                <>
                                  <BookOpen className="w-3 h-3" />
                                  <span>Enquire Now</span>
                                </>
                              ) : (
                                <>
                                  <PhoneCall className="w-3 h-3" />
                                  <span>Enquire Now</span>
                                </>
                              )}
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
      {/* <section className="bg-slate-50 border-b border-slate-200 py-16 sm:py-20">
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
              // {
              //   title: 'NIT Faculty & Industry Practitioners',
              //   icon: GraduationCap,
              //   desc: 'Learn directly from NIT faculty and seasoned technology leaders who architect enterprise systems.'
              // },
              // {
              //   title: 'theccpeeps Certification & Campus Immersion',
              //   icon: Award,
              //   desc: 'Gain verified industry credentials and participate in an exclusive 2-day campus immersion experience.'
              // },
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
      </section> */}

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
              Enquire Now Today — Accelerate Your Career
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
