import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
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
  BadgeCheck
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
    launchBadge: 'Practical Cybersecurity & Defense Operations',
    accentLine: 'Defend Live Systems.',
    mainLine: 'Master Ethical Hacking from Day 1',
    pills: ['SOC Simulation Labs', 'Threat Hunting', 'Verifiable Credentials'],
    primaryCta: 'View Cybersecurity Track',
    primaryLink: '/courses/cybersecurity',
    secondaryCta: 'Request Syllabus',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop',
    statHighlight: '94% of alumni report direct career advancement in cybersecurity operations*',
    partnerLogo: 'Accredited Labs'
  },
  {
    id: 'slide-3',
    launchBadge: 'Data Science & Predictive Analytics Track',
    accentLine: 'Engineer Real AI.',
    mainLine: 'Deploy Predictive Models from Day 1',
    pills: ['Python & PyTorch', 'MLOps Pipelines', '1:1 Mentor Reviews'],
    primaryCta: 'View Data Science Track',
    primaryLink: '/courses/data-science',
    secondaryCta: 'Book Advisory Call',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop',
    statHighlight: 'Over 2,500+ active practitioners enrolled across modern engineering tracks*',
    partnerLogo: 'Global Standards'
  },
  {
    id: 'slide-4',
    launchBadge: 'Cloud Computing & Full Stack Engineering',
    accentLine: 'Master Modern Code.',
    mainLine: 'Architect Microservices from Day 1',
    pills: ['Docker & Kubernetes', 'AWS / Azure Cloud', 'Capstone Portfolios'],
    primaryCta: 'Explore Software Tracks',
    primaryLink: '/courses',
    secondaryCta: 'Enquire for Teams',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
    statHighlight: '100% lab-driven curriculum audited and verified by enterprise architects*',
    partnerLogo: 'Industry Verified'
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
        title="Edqoo | Your Skill Partner - Professional Tech Education" 
        description="Accelerate your career with industry-aligned certification programs in Cybersecurity, Data Science, AI, Cloud, and Software Engineering."
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
              className="w-full h-full object-cover object-center lg:object-right"
            />
          </AnimatePresence>

          {/* Seamless Left Fade Mask directly into pure white background */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 lg:w-1/2 bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-none" />
          {/* Seamless Bottom Fade Mask */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          {/* Mobile backdrop tint for crisp legibility */}
          <div className="absolute inset-0 bg-white/85 lg:hidden pointer-events-none" />
        </div>

        {/* Hero Text Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-4 flex-1 flex flex-col justify-center">
          <div className="max-w-2xl text-left space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Top Subhead with EDQOO Purple Accent Underline */}
                <div>
                  <span className="inline-block border-b-2 border-purple-600 pb-1 font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
                    {currentHero.launchBadge}
                  </span>
                </div>

                {/* Headline: Purple line 1 + Solid Dark line 2 */}
                <h1 className="font-display tracking-tight leading-[1.12]">
                  <span className="text-purple-600 block font-black text-3xl sm:text-4xl lg:text-[3.25rem]">
                    {currentHero.accentLine}
                  </span>
                  <span className="text-slate-950 block font-black text-3xl sm:text-4xl lg:text-[3.25rem] mt-1">
                    {currentHero.mainLine}
                  </span>
                </h1>

                {/* Feature Pills Row */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {currentHero.pills.map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex items-center px-4 py-1.5 rounded-full border border-slate-300 text-xs sm:text-[13px] font-semibold text-slate-800 bg-white shadow-2xs"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    to={currentHero.primaryLink}
                    className="btn-primary px-7 py-3.5 text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <span>{currentHero.primaryCta}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => openEnquiryModal()}
                    className="btn-secondary px-6 py-3.5 text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition-all flex items-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 text-purple-600" />
                    <span>{currentHero.secondaryCta}</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Centered Dots Pagination */}
          <div className="flex justify-center items-center gap-2 pt-8 sm:pt-12">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  activeSlide === idx
                    ? 'w-3 h-3 bg-purple-600 ring-2 ring-purple-400/40'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Process Advisors / Outcome Highlight Strip */}
        <div className="w-full bg-purple-50/70 border-t border-purple-100 mt-6 py-3 px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            
            {/* Left: Process Advisors logo mark */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 rounded bg-purple-600 text-white font-black text-[11px] flex items-center justify-center shadow-2xs">
                ▲
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
                  Process Advisors
                </span>
                <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                  {currentHero.partnerLogo}
                </span>
              </div>
            </div>

            {/* Center: Stat Statement with smooth text transition */}
            <div className="flex-1 text-center px-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentHero.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug"
                >
                  {currentHero.statHighlight}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Right: Next / Prev Arrow Controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
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
                Verified Digital Credentials
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <Users className="w-4 h-4 text-purple-600" />
                Practitioner Mentorship
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <Briefcase className="w-4 h-4 text-purple-600" />
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
          <span className="text-purple-600 text-xs font-extrabold tracking-widest uppercase block">
            EXPLORE CURRICULUM
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
            Featured Professional Programs
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Select a specialized technology domain to explore comprehensive, lab-oriented certificate programs.
          </p>
        </div>

        {/* 2-Column Grid: Left Category Sidebar + Right Course Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Category Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-2.5 shadow-2xs sticky top-20">
            <div className="px-3 py-2 border-b border-slate-200/80 mb-2">
              <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider block">
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
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-white hover:text-purple-600'
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
                Showing <strong className="text-slate-900">{displayedCourses.length}</strong> Programs
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
                const isComingSoon = course.status === 'coming-soon';
                return (
                  <div
                    key={course.id}
                    className="premium-card flex flex-col justify-between overflow-hidden group bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    {/* Course Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-purple-100 border border-purple-200/60 text-purple-800 text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-xs">
                        {course.category}
                      </span>
                      {isComingSoon && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                          Upcoming Batch
                        </span>
                      )}
                    </div>

                    {/* Card Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-left">
                      <div className="space-y-1.5">
                        <h3 className="font-display font-bold text-sm text-slate-950 group-hover:text-purple-600 transition-colors line-clamp-1">
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
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          Online
                        </span>
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {course.rating > 0 ? course.rating : '4.8'}
                        </span>
                      </div>

                      {/* Action & Pricing Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {isComingSoon ? (
                          <>
                            <span className="text-[10px] font-bold text-purple-600 uppercase">
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
                              <span className="text-slate-950 font-extrabold text-sm leading-tight">
                                ₹{course.price}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEnquiryModal(course.title)}
                                className="btn-primary px-3 py-1.5 text-[10px] font-bold rounded-lg inline-flex items-center gap-1 shadow-2xs"
                              >
                                <PhoneCall className="w-3 h-3" />
                                <span>Enquire Now</span>
                              </button>
                              <Link
                                to={`/courses/${course.slug}`}
                                className="px-2.5 py-1.5 text-[10px] font-bold text-slate-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 border border-slate-200 transition-colors inline-flex items-center gap-1"
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
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white block">
                {statsAnimated ? '15+ Labs' : '0'}
              </span>
              <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider block">
                Practical Labs Built
              </span>
            </div>

            {/* Stat 4 */}
            <div className="space-y-1.5 p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto text-white mb-2">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white block">
                {statsAnimated ? '10+ Programs' : '0'}
              </span>
              <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider block">
                Industry-Mapped Tracks
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. "WHY CHOOSE US" / UNIQUE VALUE PROPOSITION */}
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
      {/* 6. SKILLS FOR MODERN CAREERS SECTION */}
      {/* ========================================================================= */}
      {/* <section className="section-padding bg-white">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-purple-600 text-xs font-extrabold tracking-widest uppercase block">
            SKILL DIRECTORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950">
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
                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <ItemIcon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">{item.count}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </section> */}

      {/* ========================================================================= */}
      {/* 7. TESTIMONIAL SLIDER SECTION */}
      {/* ========================================================================= */}
      {/* <section className="bg-gradient-to-b from-slate-50 to-white text-slate-900 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-purple-600 text-xs font-extrabold tracking-widest uppercase block">
              ALUMNI OUTCOMES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
              What Our Learners Say
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Real accounts from professionals who pivoted into security and analytics roles.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-8 space-y-4 text-left">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed font-medium">
                  "{testimonials[activeTestimonial].content}"
                </p>

                <div className="pt-3 border-t border-slate-100">
                  <h4 className="font-display font-bold text-base text-slate-950">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-xs text-purple-600 font-semibold">
                    {testimonials[activeTestimonial].role}
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold rounded uppercase">
                    {testimonials[activeTestimonial].courseName}
                  </span>
                </div>
              </div>

              <div className="md:col-span-4 flex justify-center">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-purple-400/40 shadow-lg">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeTestimonial === idx ? 'w-6 bg-purple-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
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
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-purple-600 hover:bg-purple-50 border border-slate-200 transition-colors"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
                  }
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-purple-600 hover:bg-purple-50 border border-slate-200 transition-colors"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section> */}

      {/* ========================================================================= */}
      {/* 8. PROMOTIONAL FREE COURSE / LEAD BANNER */}
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
      {/* 9. LATEST MEDIA & INSIGHTS SPOTLIGHT */}
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
      {/* 10. FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-white via-purple-50/40 to-slate-50 text-slate-950 py-16 text-center border-t border-slate-200 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
            Ready to Build Your Next Career Milestone?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-normal">
            Join ambitious learners building verified technological competencies. Explore our available tracks or speak with an advisor today.
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
