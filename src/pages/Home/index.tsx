import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Star,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  BarChart3,
  BrainCircuit,
  Code2,
  Cloud,
  GitBranch,
  Palette,
  Smartphone,
  PhoneCall,
  CheckCircle,
  Briefcase,
  BadgeCheck,
  GraduationCap
} from 'lucide-react';
import { courses } from '../../data/courses';
import { testimonials } from '../../data/testimonials';
import { blogPosts } from '../../data/blog';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

// Hero slide definitions with high-resolution professional people photography
const heroSlides = [
  {
    id: 'slide-1',
    badge: 'Career Advancement & Transformation',
    title: 'Accelerate Your Career With Industry-Ready Skills',
    subtitle: 'Learn from experienced enterprise practitioners, build practical project portfolios, and take the next confident step in your career.',
    primaryCta: 'Explore Programs',
    primaryLink: '/courses',
    secondaryCta: 'Talk to Advisor',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop',
    statBadge: { value: '4.8/5 Rating', label: 'Over 2,500+ Active Learners' },
    trustPoints: ['Live Project Labs', 'Enterprise Mentors', 'Verifiable Certificates']
  },
  {
    id: 'slide-2',
    badge: 'High-Growth Technology Tracks',
    title: 'Master Practical Cybersecurity & Data Science',
    subtitle: 'Step beyond passive lectures. Execute live system defense configurations, vulnerability assessments, and predictive machine learning models.',
    primaryCta: 'View Cybersecurity Track',
    primaryLink: '/courses/cybersecurity',
    secondaryCta: 'Request Syllabus',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop',
    statBadge: { value: '15+ Labs', label: 'Real-World Production Scenarios' },
    trustPoints: ['Ethical Hacking Labs', 'Python & ML Pipelines', 'SOC Incident Simulation']
  },
  {
    id: 'slide-3',
    badge: 'Expert Practitioner Mentorship',
    title: 'Learn Directly From Experienced Leaders',
    subtitle: 'Our programs are curated and delivered by senior technology architects who have managed enterprise systems and built architectures at scale.',
    primaryCta: 'Explore All Courses',
    primaryLink: '/courses',
    secondaryCta: 'Book Advisory Call',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=900&auto=format&fit=crop',
    statBadge: { value: '100% Practical', label: 'Zero Fluff & Outdated Theory' },
    trustPoints: ['1:1 Guidance', 'Code & Architecture Reviews', 'Resume-Ready Capstones']
  },
  {
    id: 'slide-4',
    badge: 'Recognized Professional Credentials',
    title: 'Build Verifiable Competencies That Recruiters Value',
    subtitle: 'Graduate with practical portfolio repositories and authenticated digital certificates that substantiate your hands-on abilities.',
    primaryCta: 'Get Started Today',
    primaryLink: '/courses',
    secondaryCta: 'Enquire for Teams',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=900&auto=format&fit=crop',
    statBadge: { value: '94% Success', label: 'Alumni Report Career Growth' },
    trustPoints: ['Digital Verification', 'Portfolio Guidance', 'Flexible Schedule']
  }
];

// Dynamic categories with Lucide icons (No Emojis)
const categoryNav = [
  { id: 'all', label: 'All Programs', icon: Layers },
  { id: 'Cybersecurity', label: 'Cybersecurity', icon: ShieldCheck },
  { id: 'Data Science', label: 'Data Science & Analytics', icon: BarChart3 },
  { id: 'AI / ML', label: 'AI & Machine Learning', icon: BrainCircuit },
  { id: 'Programming', label: 'Software & Technology', icon: Code2 },
  { id: 'Cloud Computing', label: 'Cloud Solutions', icon: Cloud },
  { id: 'DevOps', label: 'DevOps & SRE', icon: GitBranch },
  { id: 'UI/UX Design', label: 'UI/UX Design', icon: Palette },
  { id: 'Digital Marketing', label: 'Digital Marketing', icon: TrendingUp },
  { id: 'App Development', label: 'Mobile Engineering', icon: Smartphone }
];

export const Home: React.FC = () => {
  const { openEnquiryModal } = useEnquiry();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
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
        // swipe left -> next slide
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      } else {
        // swipe right -> prev slide
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
    <div className="space-y-0 text-left">
      <SEO 
        title="Edqoo | Professional EdTech & Technology Learning Platform" 
        description="Accelerate your career with industry-aligned certification programs in Cybersecurity, Data Science, AI, Cloud, and Software Engineering."
        canonical="/"
      />

      {/* ========================================================================= */}
      {/* 1. HERO CAROUSEL SECTION */}
      {/* ========================================================================= */}
      <section
        className="relative bg-deep-navy-950 text-white overflow-hidden py-12 sm:py-16 lg:py-20 border-b border-deep-navy-800 select-none"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1268e818,transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Left Column: Hero Content */}
              <div className="lg:col-span-7 space-y-5 text-left">
                {/* Value Proposition Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-royal-blue-900/70 border border-royal-blue-500/40 rounded-full text-royal-blue-300 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-royal-blue-400" />
                  <span>{currentHero.badge}</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white leading-[1.12] tracking-tight">
                  {currentHero.title}
                </h1>

                {/* Subtitle */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  {currentHero.subtitle}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    to={currentHero.primaryLink}
                    className="btn-primary px-6 py-3 text-xs sm:text-sm font-bold rounded-xl shadow-lg flex items-center gap-2"
                  >
                    <span>{currentHero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => openEnquiryModal()}
                    className="btn-secondary bg-white/10 hover:bg-white/15 text-white border-white/20 hover:border-white/30 px-6 py-3 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all"
                  >
                    <PhoneCall className="w-4 h-4 text-royal-blue-300" />
                    <span>{currentHero.secondaryCta}</span>
                  </button>
                </div>

                {/* Trust Points */}
                <div className="pt-4 border-t border-deep-navy-800/80 flex flex-wrap gap-y-2 gap-x-6">
                  {currentHero.trustPoints.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-royal-blue-400 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Hero Image with Overlay Stat Badge */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-deep-navy-700/80 shadow-2xl bg-deep-navy-900">
                  <img
                    src={currentHero.image}
                    alt={currentHero.title}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
                    loading="eager"
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Trust Indicator on image */}
                  <div className="absolute bottom-4 left-4 right-4 bg-deep-navy-900/90 backdrop-blur-md border border-deep-navy-700/80 rounded-xl p-3 shadow-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-royal-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block leading-tight">
                        {currentHero.statBadge.value}
                      </span>
                      <span className="text-[10px] text-slate-300 block mt-0.5">
                        {currentHero.statBadge.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Navigation Bar: Arrows + Dot Indicators */}
          <div className="mt-8 pt-4 border-t border-deep-navy-800/60 flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? 'w-8 bg-royal-blue-500' : 'w-2 bg-deep-navy-700 hover:bg-deep-navy-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg bg-deep-navy-900 border border-deep-navy-700 text-slate-300 hover:text-white hover:border-royal-blue-500 transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg bg-deep-navy-900 border border-deep-navy-700 text-slate-300 hover:text-white hover:border-royal-blue-500 transition-colors"
                aria-label="Next Slide"
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
      <section className="bg-deep-navy-50 border-b border-deep-navy-200/80 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left flex-shrink-0">
              <span className="text-[11px] font-extrabold text-royal-blue-700 uppercase tracking-widest block">
                LEARNING EXCELLENCE
              </span>
              <p className="text-xs font-bold text-deep-navy-900 mt-0.5">
                Programs Engineered to Industry Standards
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-xs font-bold text-deep-navy-800">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-deep-navy-200 rounded-lg shadow-2xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                100% Practical Labs
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-deep-navy-200 rounded-lg shadow-2xs">
                <BadgeCheck className="w-4 h-4 text-royal-blue-600" />
                Verified Digital Credentials
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-deep-navy-200 rounded-lg shadow-2xs">
                <Users className="w-4 h-4 text-royal-blue-600" />
                Practitioner Mentorship
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-deep-navy-200 rounded-lg shadow-2xs">
                <Briefcase className="w-4 h-4 text-royal-blue-600" />
                Capstone Portfolios
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POPULAR PROGRAMS (Category Sidebar + Program Cards) */}
      {/* ========================================================================= */}
      <section id="programs" className="section-padding bg-white">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-royal-blue-600 text-xs font-extrabold tracking-widest uppercase block">
            EXPLORE CURRICULUM
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-deep-navy-900">
            Featured Professional Programs
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Select a specialized technology domain to explore comprehensive, lab-oriented certificate programs.
          </p>
        </div>

        {/* 2-Column Grid: Left Category Sidebar + Right Course Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Category Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 bg-deep-navy-50/70 border border-deep-navy-200 rounded-2xl p-2.5 shadow-2xs sticky top-20">
            <div className="px-3 py-2 border-b border-deep-navy-200/80 mb-2">
              <span className="text-[11px] font-extrabold text-deep-navy-900 uppercase tracking-wider block">
                Domains & Categories
              </span>
            </div>
            <div className="space-y-1">
              {categoryNav.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all text-left ${
                      isActive
                        ? 'bg-royal-blue-600 text-white shadow-sm'
                        : 'text-deep-navy-800 hover:bg-white hover:text-royal-blue-600'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{cat.label}</span>
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Horizontal scrollable pills filter (Mobile / Tablet) */}
          <div className="lg:hidden w-full overflow-x-auto pb-2 scrollbar-none flex gap-2 mb-4">
            {categoryNav.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap border flex-shrink-0 flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-royal-blue-600 text-white border-royal-blue-600 shadow-sm'
                      : 'bg-white text-deep-navy-800 border-deep-navy-200 hover:bg-deep-navy-50'
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
            <div className="flex items-center justify-between border-b border-deep-navy-200 pb-3">
              <span className="text-xs font-bold text-slate-500">
                Showing <strong className="text-deep-navy-900">{displayedCourses.length}</strong> Programs
              </span>
              <Link
                to="/courses"
                className="text-xs font-bold text-royal-blue-600 hover:text-royal-blue-700 inline-flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayedCourses.map((course) => {
                const isComingSoon = course.status === 'coming-soon';
                return (
                  <div
                    key={course.id}
                    className="premium-card flex flex-col justify-between overflow-hidden group bg-white border border-deep-navy-200 rounded-2xl"
                  >
                    {/* Course Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-deep-navy-100">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-deep-navy-950/85 text-white text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-xs">
                        {course.category}
                      </span>
                      {isComingSoon && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-royal-blue-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                          Upcoming Batch
                        </span>
                      )}
                    </div>

                    {/* Card Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <h3 className="font-display font-bold text-sm text-deep-navy-900 group-hover:text-royal-blue-600 transition-colors line-clamp-1">
                          {isComingSoon ? (
                            course.title
                          ) : (
                            <Link to={`/courses/${course.slug}`}>{course.title}</Link>
                          )}
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
                            className="px-1.5 py-0.5 bg-deep-navy-50 border border-deep-navy-200/60 text-deep-navy-800 text-[9px] font-semibold rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {course.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-deep-navy-50 text-slate-400 text-[9px] font-medium rounded">
                            +{course.skills.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Course Metadata (Duration, Mode, Rating) */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-deep-navy-100 pt-2.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          Online
                        </span>
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {course.rating > 0 ? course.rating : '4.8'}
                        </span>
                      </div>

                      {/* Action & Pricing Footer */}
                      <div className="pt-3 border-t border-deep-navy-100 flex items-center justify-between gap-2">
                        {isComingSoon ? (
                          <>
                            <span className="text-[10px] font-bold text-royal-blue-600 uppercase">
                              Enrolment Opening
                            </span>
                            <button
                              type="button"
                              onClick={() => openEnquiryModal(course.title)}
                              className="btn-secondary px-3.5 py-1.5 text-[11px] font-bold rounded-lg"
                            >
                              Get Notified
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 line-through leading-none">
                                ₹{course.originalPrice}
                              </span>
                              <span className="text-deep-navy-900 font-extrabold text-sm leading-tight">
                                ₹{course.price}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEnquiryModal(course.title)}
                                className="px-2.5 py-1.5 text-[10px] font-bold text-slate-600 hover:text-royal-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                Enquire
                              </button>
                              <Link
                                to={`/courses/${course.slug}`}
                                className="btn-primary px-3.5 py-1.5 text-[11px] font-bold rounded-lg inline-flex items-center gap-1"
                              >
                                <span>Details</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ANIMATED STATISTICS SECTION */}
      {/* ========================================================================= */}
      <section
        ref={statsSectionRef}
        className="bg-royal-blue-600 text-white py-12 sm:py-16 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            
            {/* Stat 1 */}
            <div className="space-y-1.5 p-4 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-white mb-2">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white block">
                {statsAnimated ? '2,500+' : '0'}
              </span>
              <span className="text-xs font-semibold text-royal-blue-100 uppercase tracking-wider block">
                Active Learners
              </span>
            </div>

            {/* Stat 2 */}
            <div className="space-y-1.5 p-4 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-white mb-2">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white block">
                {statsAnimated ? '4.8 / 5.0' : '0.0'}
              </span>
              <span className="text-xs font-semibold text-royal-blue-100 uppercase tracking-wider block">
                Average Rating
              </span>
            </div>

            {/* Stat 3 */}
            <div className="space-y-1.5 p-4 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-white mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white block">
                {statsAnimated ? '15+ Labs' : '0'}
              </span>
              <span className="text-xs font-semibold text-royal-blue-100 uppercase tracking-wider block">
                Practical Labs Built
              </span>
            </div>

            {/* Stat 4 */}
            <div className="space-y-1.5 p-4 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-white mb-2">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white block">
                {statsAnimated ? '10+ Programs' : '0'}
              </span>
              <span className="text-xs font-semibold text-royal-blue-100 uppercase tracking-wider block">
                Industry-Mapped Tracks
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. "WHY CHOOSE US" / UNIQUE VALUE PROPOSITION */}
      {/* ========================================================================= */}
      <section className="bg-deep-navy-50 border-b border-deep-navy-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-royal-blue-600 text-xs font-extrabold tracking-widest uppercase block">
              OUR PEDAGOGY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-deep-navy-900">
              Discover What Makes Edqoo Unique
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              We focus on building functional ability rather than offering passive video lectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Expert Practitioner Mentors',
                icon: Users,
                desc: 'Learn directly from seasoned engineers and security professionals who guide enterprise architectures.'
              },
              {
                title: 'Practical Hands-On Labs',
                icon: Layers,
                desc: 'Execute direct terminal interactions, vulnerability audits, and python machine learning pipelines.'
              },
              {
                title: 'Career-Focused Curriculum',
                icon: TrendingUp,
                desc: 'Every syllabus module is audited against current production tooling and engineering job requirements.'
              },
              {
                title: 'Flexible Multi-Device Learning',
                icon: Clock,
                desc: 'Study at your own pace with lifetime access to materials, lab notes, and updated curriculum patches.'
              }
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-2xs hover:border-royal-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-royal-blue-50 border border-royal-blue-200 flex items-center justify-center text-royal-blue-600 mb-4 group-hover:scale-105 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-base text-deep-navy-900 mb-2">
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
      {/* 6. SKILLS FOR MODERN CAREERS SECTION */}
      {/* ========================================================================= */}
      <section className="section-padding bg-white">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-royal-blue-600 text-xs font-extrabold tracking-widest uppercase block">
            SKILL DIRECTORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-deep-navy-900">
            Skills for Modern Technology Careers
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Explore industry competencies in demand across modern engineering organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[
            { name: 'Cybersecurity & Defense Operations', icon: ShieldCheck, link: '/courses/cybersecurity', count: '45 Lessons' },
            { name: 'Data Science & Predictive Analytics', icon: BarChart3, link: '/courses/data-science', count: '40 Lessons' },
            { name: 'Artificial Intelligence & Generative AI', icon: BrainCircuit, link: '/courses', count: '50 Lessons' },
            { name: 'Full Stack Software Engineering', icon: Code2, link: '/courses', count: '65 Lessons' },
            { name: 'Cloud Solutions Architecture (AWS/Azure)', icon: Cloud, link: '/courses', count: '38 Lessons' },
            { name: 'DevOps & Site Reliability (SRE)', icon: GitBranch, link: '/courses', count: '40 Lessons' },
            { name: 'UI/UX Product Design & Figma', icon: Palette, link: '/courses', count: '32 Lessons' },
            { name: 'Growth Marketing & Analytics', icon: TrendingUp, link: '/courses', count: '25 Lessons' },
            { name: 'Mobile App Engineering (React Native)', icon: Smartphone, link: '/courses', count: '30 Lessons' }
          ].map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={idx}
                to={item.link}
                className="flex items-center justify-between p-4 bg-deep-navy-50/70 border border-deep-navy-200 rounded-xl hover:bg-royal-blue-50 hover:border-royal-blue-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-deep-navy-200 text-royal-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-royal-blue-600 group-hover:text-white transition-colors">
                    <ItemIcon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-deep-navy-900 group-hover:text-royal-blue-700 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">{item.count}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-royal-blue-600 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TESTIMONIAL SLIDER SECTION */}
      {/* ========================================================================= */}
      <section className="bg-deep-navy-950 text-white py-16 sm:py-20 border-y border-deep-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-royal-blue-400 text-xs font-extrabold tracking-widest uppercase block">
              ALUMNI OUTCOMES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white">
              What Our Learners Say
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Real accounts from professionals who pivoted into security and analytics roles.
            </p>
          </div>

          {/* Testimonial Presentation Card */}
          <div className="max-w-4xl mx-auto bg-deep-navy-900 border border-deep-navy-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Quote */}
              <div className="md:col-span-8 space-y-4 text-left">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
                  "{testimonials[activeTestimonial].content}"
                </p>

                <div className="pt-2 border-t border-deep-navy-800">
                  <h4 className="font-display font-bold text-base text-white">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-xs text-royal-blue-300 font-semibold">
                    {testimonials[activeTestimonial].role}
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-royal-blue-900/60 border border-royal-blue-500/30 text-royal-blue-200 text-[10px] font-bold rounded uppercase">
                    {testimonials[activeTestimonial].courseName}
                  </span>
                </div>
              </div>

              {/* Right Portrait */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-royal-blue-500/40 shadow-xl">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Testimonial Slider Controls */}
            <div className="mt-8 pt-4 border-t border-deep-navy-800 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeTestimonial === idx ? 'w-6 bg-royal-blue-500' : 'w-2 bg-deep-navy-700'
                    }`}
                    aria-label={`Testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                  className="p-2 rounded-lg bg-deep-navy-800 text-slate-300 hover:text-white border border-deep-navy-700"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
                  }
                  className="p-2 rounded-lg bg-deep-navy-800 text-slate-300 hover:text-white border border-deep-navy-700"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PROMOTIONAL FREE COURSE / LEAD BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-deep-navy-900 to-royal-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3.5 text-left">
            <span className="inline-block px-3 py-1 bg-royal-blue-800 border border-royal-blue-400/30 text-royal-blue-200 text-[10px] font-bold uppercase tracking-wider rounded-md">
              Career Advisory
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Start Learning Today — Accelerate Your Career
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Connect with our learning advisors for a personalized track assessment, course roadmap, and customized corporate training options.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="btn-primary bg-white text-royal-blue-700 border-white hover:bg-slate-100 hover:text-royal-blue-800 px-6 py-2.5 text-xs font-bold rounded-xl shadow-md"
              >
                Request Free Advisory Session
              </button>
              <Link
                to="/courses"
                className="btn-secondary bg-transparent text-white border-white/30 hover:bg-white/10 px-6 py-2.5 text-xs font-bold rounded-xl"
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
      {/* 9. LATEST MEDIA & INSIGHTS SPOTLIGHT */}
      {/* ========================================================================= */}
      <section className="bg-deep-navy-50 border-t border-deep-navy-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div className="text-left space-y-1">
              <span className="text-royal-blue-600 text-xs font-extrabold tracking-widest uppercase block">
                MEDIA & INSIGHTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-deep-navy-900">
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
                className="bg-white border border-deep-navy-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:border-royal-blue-500 hover:shadow-md transition-all group"
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
                    <span className="text-[10px] font-bold text-royal-blue-600 uppercase">
                      {post.category}
                    </span>
                    <h3 className="font-display font-bold text-sm text-deep-navy-900 group-hover:text-royal-blue-600 transition-colors line-clamp-2">
                      <Link to={`/resources/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-3 border-t border-deep-navy-100">
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
      {/* 10. FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="bg-deep-navy-950 text-white py-16 text-center border-t border-deep-navy-800 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white">
            Ready to Build Your Next Career Milestone?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Join ambitious learners building verified technological competencies. Explore our available tracks or speak with an advisor today.
          </p>
          <div className="flex justify-center gap-3.5 pt-2">
            <Link
              to="/courses"
              className="btn-primary px-8 py-3 text-xs sm:text-sm font-bold rounded-xl shadow-lg"
            >
              Explore Programs
            </Link>
            <button
              type="button"
              onClick={() => openEnquiryModal()}
              className="btn-secondary bg-white/10 hover:bg-white/15 text-white border-white/20 px-8 py-3 text-xs sm:text-sm font-bold rounded-xl"
            >
              Speak to Advisor
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
