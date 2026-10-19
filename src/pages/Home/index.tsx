import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Users,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Wrench,
  CheckCircle,
  Briefcase,
  BarChart3,
  Code2
} from 'lucide-react';
import {
  filterCoursesByCategory,
  DATA_SCIENCE_AI_PROJECTS,
  isEnglishMirrorCourse
} from '../../data/courses';
import { courseService } from '../../services/courseService';
import { categoryService } from '../../services/categoryService';
import { getCategoryIcon } from '../../utils/categoryIcons';
import type { Course, Category } from '../../types';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';
import { KeyHighlights } from '../../components/common/KeyHighlights';
import { Accordion } from '../../components/ui/Accordion';
import { getCacheBustedImageUrl } from '../../utils/imageUrl';
import { CourseSkeleton } from '../../components/ui/CourseSkeleton';
import { CourseCard } from '../../components/common/CourseCard';
import { EnglishMirrorCategoryCard } from '../../components/englishMirror/EnglishMirrorCategoryCard';
import { LanguageTrackCard, PROGRAM_TRACK_LANGUAGES } from '../../components/common/LanguageTrackCard';

// Hero slide definitions matching EDQOO visual identity
const heroSlides = [
  {
    id: 'slide-1',
    launchBadge: 'Enterprise Technology Masterclasses & Live Hybrid Tracks',
    accentLine: 'Learn With Purpose.',
    mainLine: 'Build With Confidence',
    pills: ['AI-Age Curriculum', 'Hands-on Cloud Labs', 'Real-World Projects', 'Placement Assistance in India'],
    primaryCta: 'Explore All Programs',
    primaryLink: '/programs',
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
    pills: ['Python & PyTorch', 'LLMs & RAG Architectures', '1:1 Mentor Reviews', 'Kerala & Pan-India Batches'],
    primaryCta: 'View Data Science and AI',
    primaryLink: '/programs/data-science-and-ai',
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
    primaryCta: 'View AI & Machine Learning Track',
    primaryLink: '/programs/ai-and-machine-learning',
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
    mainLine: 'Master Python, Power BI, Excel & Prompt Engineering',
    pills: ['Flexible Duration', 'Executive Certificate', 'Instant Workplace Impact'],
    primaryCta: 'Explore Tools & Upskills',
    primaryLink: '/tools-and-upskills',
    secondaryCta: 'Enquire for Teams',
    desktopImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1080&h=1920&auto=format&fit=crop',
    statHighlight: '100% lab-driven curriculum audited and verified by enterprise architects*',
    partnerLogo: 'Industry Verified'
  }
];

const homeFaqs = [
  {
    question: 'What is Edqoo?',
    answer:
      'Edqoo is an online learning platform focused on practical, industry-oriented education in Data Science, Artificial Intelligence, Python, Data Analytics and professional upskilling.'
  },
  {
    question: 'What courses does Edqoo offer?',
    answer:
      'Edqoo offers comprehensive online courses in Data Science and AI, Python Programming, Artificial Intelligence and Machine Learning, Data Analytics with Power BI, and executive Tools & Upskills including Excel, Power BI, MS Office, and Prompt Engineering.'
  },
  {
    question: 'Is Edqoo an online learning platform?',
    answer:
      'Yes, Edqoo is an online learning platform delivering live interactive sessions, hands-on cloud labs, real-world project portfolios, and dedicated 1-on-1 mentorship.'
  },
  {
    question: 'What can I learn on Edqoo?',
    answer:
      'You can learn in-demand technology and data skills including Python programming, machine learning algorithms, deep learning neural networks, SQL querying, Power BI dashboards, advanced Excel modeling, and prompt engineering.'
  },
  {
    question: 'Does Edqoo offer Data Science courses?',
    answer:
      'Yes, Edqoo offers practical Data Science courses covering Python, statistical foundations, exploratory data analysis, predictive modeling, machine learning, and hands-on capstone projects using real-world datasets.'
  },
  {
    question: 'Does Edqoo offer Python courses?',
    answer:
      'Yes, Edqoo provides dedicated Python courses covering syntax fundamentals, data structures, object-oriented programming, automation, and data handling libraries like NumPy and Pandas.'
  },
  {
    question: 'Does Edqoo offer AI and Machine Learning courses?',
    answer:
      'Yes, Edqoo offers specialized AI and Machine Learning courses covering supervised learning, deep neural networks, computer vision, natural language processing (NLP), Large Language Models (LLMs), and Generative AI.'
  },
  {
    question: 'Who are Edqoo courses designed for?',
    answer:
      'Edqoo courses are designed for students, job seekers, software developers, data analysts, and career transitioners looking to build verified, hands-on competencies in data and technology.'
  },
  {
    question: 'How can I contact Edqoo?',
    answer:
      'You can contact Edqoo by submitting an enquiry on our website, emailing support@edqoo.com, or calling +91 90744 50935.'
  }
];

export const Home: React.FC = () => {
  const { openEnquiryModal } = useEnquiry();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Course[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState<string | null>(null);
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
    const deltaX = touchStartX.current - touchEndX;
    if (deltaX > 40) {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    } else if (deltaX < -40) {
      setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
    touchStartX.current = null;
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const loadHomePrograms = (signal?: AbortSignal) => {
    setProgramsLoading(true);
    setProgramsError(null);
    courseService
      .getCourses({ signal })
      .then((data) => {
        if (Array.isArray(data)) {
          setPrograms(data);
          setProgramsError(null);
        }
      })
      .catch((err) => {
        if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
          console.error('Failed to load programs on homepage:', err);
          setProgramsError(err?.message || 'Unable to load programs from the database.');
        }
      })
      .finally(() => setProgramsLoading(false));
  };

  const loadCategories = (signal?: AbortSignal) => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    categoryService
      .getCategories(signal)
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
          setCategoriesError(null);
        }
      })
      .catch((err) => {
        if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
          console.error('Failed to load categories on homepage:', err);
          setCategoriesError(err?.message || 'Unable to load categories from database.');
        }
      })
      .finally(() => setCategoriesLoading(false));
  };

  useEffect(() => {
    const controller = new AbortController();
    loadHomePrograms(controller.signal);
    loadCategories(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const dynamicCategoryNav = useMemo(() => {
    interface CategoryNavItem extends Partial<Category> {
      id: string;
      slug: string;
      name: string;
      displayName: string;
      icon?: string;
      isPartner?: boolean;
      badge?: string;
    }

    const allItem: CategoryNavItem = {
      id: 'all',
      slug: 'all',
      name: 'All Categories',
      displayName: 'All Categories',
      icon: 'layers',
      isPartner: false,
      badge: undefined
    };
    const parentCategories = categories.filter((c) => !c.parentId && !c.parentSlug);
    const seen = new Set<string>();
    const navItems: CategoryNavItem[] = [allItem];

    for (const c of parentCategories) {
      const isEnglish =
        c.name.toLowerCase().includes('spoken tutorial') ||
        c.name.toLowerCase().includes('spoken english') ||
        c.name.toLowerCase().includes('english mirror') ||
        c.slug === 'english-mirror' ||
        c.slug === 'spoken-tutorial' ||
        c.slug === 'spoken-english' ||
        c.id === 'cat-spoken-tutorial' ||
        c.id === 'cat-english-mirror';
      const displayName = isEnglish ? 'Spoken English' : c.name;
      const key = displayName.toLowerCase().trim();
      if (seen.has(key)) continue;
      seen.add(key);

      navItems.push({
        ...c,
        slug: isEnglish ? 'spoken-tutorial' : c.slug,
        displayName,
        icon: isEnglish ? 'message-circle' : c.icon,
        isPartner: isEnglish ? false : Boolean(c.isPartner),
        badge: isEnglish ? undefined : c.badge
      });
    }

    return navItems;
  }, [categories]);

  const isSpokenEnglishSelected = useMemo(() => {
    return (
      selectedCategory === 'cat-spoken-tutorial' ||
      selectedCategory === 'spoken-tutorial' ||
      selectedCategory === 'cat-english-mirror' ||
      selectedCategory === 'english-mirror' ||
      selectedCategory === 'spoken-english' ||
      selectedCategory.toLowerCase() === 'spoken english' ||
      selectedCategory.toLowerCase() === 'spoken tutorial' ||
      selectedCategory.toLowerCase() === 'english mirror'
    );
  }, [selectedCategory]);

  // Filter courses based on active category (database ID/slug/name relationship)
  const displayedPrograms = useMemo(() => {
    if (selectedCategory === 'all' || selectedCategory === 'All Categories') {
      return programs;
    }

    if (isSpokenEnglishSelected) {
      return programs.filter(isEnglishMirrorCourse);
    }

    const matchedCategory = categories.find(
      (c) => c.id === selectedCategory || c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
    );

    if (matchedCategory) {
      if (
        matchedCategory.id === 'cat-spoken-tutorial' ||
        matchedCategory.slug === 'spoken-tutorial' ||
        matchedCategory.slug === 'spoken-english' ||
        matchedCategory.name.toLowerCase().includes('spoken english') ||
        matchedCategory.name.toLowerCase().includes('spoken tutorial') ||
        matchedCategory.name.toLowerCase().includes('english mirror')
      ) {
        return programs.filter(isEnglishMirrorCourse);
      }

      return programs.filter((course) => {
        if (course.categoryId && course.categoryId === matchedCategory.id) return true;
        if (Array.isArray(course.categoryIds) && course.categoryIds.includes(matchedCategory.id)) return true;
        if (course.category && course.category.trim().toLowerCase() === matchedCategory.name.trim().toLowerCase()) return true;
        if (
          Array.isArray(course.categories) &&
          course.categories.some((cat) => cat.trim().toLowerCase() === matchedCategory.name.trim().toLowerCase())
        ) {
          return true;
        }
        return false;
      });
    }

    return filterCoursesByCategory(programs, selectedCategory);
  }, [programs, selectedCategory, categories]);

  const standardHomePrograms = useMemo(() => {
    return displayedPrograms.filter((c) => !isEnglishMirrorCourse(c));
  }, [displayedPrograms]);

  const hasEnglishInHome = useMemo(() => {
    if (isSpokenEnglishSelected) return true;
    if (selectedCategory === 'all' || selectedCategory === 'All Categories' || !selectedCategory) return true;
    return displayedPrograms.some(isEnglishMirrorCourse);
  }, [isSpokenEnglishSelected, selectedCategory, displayedPrograms]);

  const totalHomeCount = isSpokenEnglishSelected
    ? PROGRAM_TRACK_LANGUAGES.length
    : standardHomePrograms.length + (hasEnglishInHome ? PROGRAM_TRACK_LANGUAGES.length : 0);

  const currentHero = heroSlides[activeSlide];

  const accordionHomeFaqs = homeFaqs.map((f, i) => ({
    id: `faq-home-${i + 1}`,
    title: f.question,
    content: <p className="text-xs leading-relaxed text-slate-600">{f.answer}</p>
  }));

  return (
    <div className="space-y-0 text-left bg-white">
      <SEO
        title="Edqoo | Online Learning Platform for AI, Data Science & More"
        description="Edqoo is an online learning platform offering practical courses in Data Science, Artificial Intelligence, Machine Learning, Python, Data Analytics and professional upskilling."
        canonical="/"
        keywords={[
          'Edqoo',
          'edqoo',
          'Edqoo online',
          'Edqoo courses',
          'Edqoo learning',
          'Edqoo e-learning',
          'Edqoo India',
          'Edqoo courses India',
          'Edqoo Data Science',
          'Edqoo Python',
          'Edqoo AI',
          'online courses',
          'online certification courses',
          'data science course',
          'data science and AI course',
          'artificial intelligence course',
          'machine learning course',
          'python course',
          'data analytics course',
          'power BI course',
          'excel course',
          'prompt engineering course',
          'professional upskilling',
          'online learning platform'
        ]}
        includeWebsiteSchema={true}
        includeOrgSchema={true}
        faqs={homeFaqs}
      />

      {/* ========================================================================= */}
      {/* 1A. MOBILE HERO SLIDER                                                    */}
      {/* ========================================================================= */}
      <section
        className="flex md:hidden relative bg-white text-slate-900 overflow-hidden w-full max-w-full select-none min-h-[calc(100svh-64px)] flex-col justify-between border-b border-slate-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentHero.id}
              src={getCacheBustedImageUrl(currentHero.mobileImage)}
              alt={currentHero.mainLine}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 top-[28%] bg-gradient-to-t from-white via-white/95 to-transparent" />
        </div>

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
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F1E8FA] border border-[#E0CEF5] text-[#6D22B5] text-[11px] font-bold tracking-wide shadow-2xs backdrop-blur-xs max-w-full">
                <span className="truncate">{currentHero.launchBadge}</span>
              </div>

              <div className="space-y-1">
                <span className="block text-[#6D22B5] font-display font-extrabold text-xs sm:text-sm tracking-tight">
                  {currentHero.accentLine}
                </span>
                <h1 className="text-[23px] sm:text-2xl font-display font-black text-slate-950 tracking-tight leading-[1.16]">
                  {currentHero.mainLine}
                </h1>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Edqoo is an online learning platform for building practical skills in Data Science, AI, Python, Data Analytics and other in-demand technologies.
              </p>

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
                  className="btn-secondary w-full py-3 text-xs font-bold rounded-xl shadow-2xs text-center cursor-pointer"
                >
                  {currentHero.secondaryCta}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

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
              <span className="w-2 h-2 rounded-full bg-[#6D22B5] animate-pulse flex-shrink-0 mt-0.5" />
              <p>
                <span className="font-bold text-slate-900">{currentHero.partnerLogo}: </span>
                <span>{currentHero.statHighlight}</span>
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? 'w-6 bg-[#6D22B5]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1B. DESKTOP & TABLET HERO SLIDER SECTION (100% Viewport Height & Width)   */}
      {/* ========================================================================= */}
      <section
        className="hidden md:flex hero-slider relative bg-slate-900 text-slate-900 overflow-hidden w-full select-none flex-col justify-between border-b border-slate-200"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full Viewport Background Image Slider */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden hero-slide">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentHero.id}
              src={getCacheBustedImageUrl(currentHero.desktopImage || currentHero.image)}
              alt={currentHero.mainLine}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </AnimatePresence>
          {/* Dual Multi-Stop Gradient Overlays for High Legibility & Premium Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/20 lg:from-white/95 lg:via-white/80 lg:to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent z-10" />
        </div>

        {/* Vertically Centered Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 flex-1 flex flex-col justify-center py-4 sm:py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="max-w-2xl space-y-3.5 sm:space-y-4"
            >
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#F1E8FA] border border-[#E0CEF5] text-[#6D22B5] text-xs font-bold tracking-wide shadow-2xs backdrop-blur-xs">
                <span>{currentHero.launchBadge}</span>
              </div>

              <div className="space-y-1">
                <span className="block text-[#6D22B5] font-display font-extrabold text-base sm:text-xl lg:text-2xl tracking-tight">
                  {currentHero.accentLine}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight leading-[1.12]">
                  {currentHero.mainLine}
                </h1>
              </div>

              <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed max-w-xl font-medium">
                Edqoo is an online learning platform for building practical skills in Data Science, AI, Python, Data Analytics and other in-demand technologies.
              </p>

              <div className="flex flex-wrap gap-2 pt-0.5">
                {currentHero.pills.map((pill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/90 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 backdrop-blur-xs shadow-2xs"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-3">
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
                  className="btn-secondary px-6 py-3 text-xs sm:text-sm font-bold rounded-xl shadow-2xs cursor-pointer"
                >
                  {currentHero.secondaryCta}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pinned Bottom Bar: Trust highlight, slide indicators, and navigation buttons */}
        <div className="relative z-20 bg-white/90 backdrop-blur-md border-t border-slate-200/80 py-3 px-4 sm:px-6 lg:px-8 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 text-slate-700 font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-[#6D22B5] animate-pulse flex-shrink-0" />
                <span className="font-bold text-slate-950">{currentHero.partnerLogo}:</span>
                <span className="truncate max-w-xs sm:max-w-md md:max-w-xl">
                  {currentHero.statHighlight}
                </span>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex gap-1.5 mr-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeSlide === idx ? 'w-7 bg-[#6D22B5]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={prevSlide}
                className="p-1.5 rounded-lg bg-white hover:bg-[#F1E8FA] text-slate-700 hover:text-black border border-slate-200 hover:border-[#6D22B5] transition-colors shadow-2xs cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 rounded-lg bg-white hover:bg-[#F1E8FA] text-slate-700 hover:text-black border border-slate-200 hover:border-[#6D22B5] transition-colors shadow-2xs cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST & ENTERPRISE STANDARDS SECTION                                   */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left flex-shrink-0">
              <span className="text-[11px] font-extrabold text-[#6D22B5] uppercase tracking-widest block">
                LEARNING EXCELLENCE
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                Programs Engineered to Industry Standards
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <CheckCircle className="w-4 h-4 text-[#6D22B5]" />
                100% Practical Labs
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <Briefcase className="w-4 h-4 text-[#6D22B5]" />
                3 Guaranteed Job Interviews*
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                India &amp; Kerala Focus
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. KEY HIGHLIGHTS SECTION: LEARN IN-DEMAND SKILLS                         */}
      {/* ========================================================================= */}
      <KeyHighlights
        title="Learn In-Demand Skills"
        subtitle="Experience practical technology education with expert faculty, hands-on lab environments, and verified industry credentials in India."
        badgeText="WHY CHOOSE EDQOO"
      />

      {/* ========================================================================= */}
      {/* 4. EXPLORE OUR PROGRAMS SECTION                                           */}
      {/* ========================================================================= */}
      <section id="programs" className="section-padding bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[#6D22B5] text-xs font-extrabold tracking-widest uppercase block">
              CURATED LEARNING PATHS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
              Explore Our Programs
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Explore career-oriented online courses in <strong>Data Science and AI</strong>, <strong>Python</strong>, <strong>AI and Machine Learning</strong>, <strong>Data Analytics and AI</strong>, and executive <strong>Tools &amp; Upskills</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Category Sidebar (Desktop) */}
            <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs sticky top-20">
              <div className="px-3 py-2 border-b border-slate-200/80 mb-2">
                <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider block">
                  Program Tracks
                </span>
              </div>
              <div className="space-y-1.5">
                {categoriesLoading ? (
                  <div className="space-y-2 p-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-9 bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : categoriesError ? (
                  <div className="p-3 text-center text-xs text-rose-500">
                    <span>Unable to load categories.</span>
                    <button
                      onClick={() => loadCategories()}
                      className="block mx-auto mt-2 text-[11px] font-bold text-[#6D22B5] underline cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  dynamicCategoryNav.map((cat: any) => {
                    const isEnglishCat =
                      cat.id === 'cat-spoken-tutorial' ||
                      cat.slug === 'spoken-tutorial' ||
                      cat.slug === 'spoken-english' ||
                      cat.displayName === 'Spoken English';
                    const isEnglishSelected =
                      selectedCategory === 'cat-spoken-tutorial' ||
                      selectedCategory === 'spoken-tutorial' ||
                      selectedCategory === 'spoken-english' ||
                      selectedCategory === 'Spoken English' ||
                      selectedCategory === 'Spoken Tutorial';
                    const isActive = isEnglishCat
                      ? isEnglishSelected
                      : selectedCategory === cat.id || selectedCategory === cat.slug || selectedCategory === cat.name;
                    const isPartner = isEnglishCat ? false : Boolean(cat.isPartner || cat.badge === 'PARTNER');
                    const label = cat.displayName || cat.name;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-bold rounded-xl transition-all text-left cursor-pointer border ${
                          isActive
                            ? 'bg-[#6D22B5] text-white border-[#6D22B5] shadow-sm'
                            : isPartner
                            ? 'bg-white text-[#6D22B5] border-[#6D22B5] hover:bg-purple-50'
                            : 'bg-white text-slate-800 border-transparent hover:bg-purple-50 hover:text-[#6D22B5]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {getCategoryIcon(cat.icon, `w-4 h-4 ${isActive ? 'text-white' : 'text-[#6D22B5]'}`)}
                          <span>{label}</span>
                        </div>
                        {isPartner && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-tight ${
                            isActive ? 'bg-white text-[#6D22B5]' : 'bg-[#6D22B5] text-white'
                          }`}>
                            {cat.badge || 'Partner'}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Horizontal scrollable pills filter (Mobile / Tablet) */}
            <div className="lg:hidden w-full overflow-x-auto pb-2 scrollbar-none flex gap-2 mb-2">
              {categoriesLoading ? (
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-24 bg-slate-100 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : (
                dynamicCategoryNav.map((cat: any) => {
                  const isEnglishCat =
                    cat.id === 'cat-spoken-tutorial' ||
                    cat.slug === 'spoken-tutorial' ||
                    cat.slug === 'spoken-english' ||
                    cat.displayName === 'Spoken English';
                  const isEnglishSelected =
                    selectedCategory === 'cat-spoken-tutorial' ||
                    selectedCategory === 'spoken-tutorial' ||
                    selectedCategory === 'spoken-english' ||
                    selectedCategory === 'Spoken English' ||
                    selectedCategory === 'Spoken Tutorial';
                  const isActive = isEnglishCat
                    ? isEnglishSelected
                    : selectedCategory === cat.id || selectedCategory === cat.slug || selectedCategory === cat.name;
                  const isPartner = isEnglishCat ? false : Boolean(cat.isPartner || cat.badge === 'PARTNER');
                  const label = cat.displayName || cat.name;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border flex-shrink-0 ${
                        isActive
                          ? 'bg-[#6D22B5] text-white border-[#6D22B5] shadow-sm'
                          : isPartner
                          ? 'bg-white text-[#6D22B5] border-[#6D22B5] hover:bg-purple-50'
                          : 'bg-white text-slate-800 border-slate-200 hover:bg-purple-50 hover:text-[#6D22B5]'
                      }`}
                    >
                      {getCategoryIcon(cat.icon, `w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#6D22B5]'}`)}
                      <span>{label}</span>
                      {isPartner && (
                        <span className={`text-[8px] px-1 py-0.2 rounded font-extrabold uppercase ${
                          isActive ? 'bg-white text-[#6D22B5]' : 'bg-[#6D22B5] text-white'
                        }`}>
                          {cat.badge || 'Partner'}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Right Courses Cards Grid */}
            <div className="lg:col-span-9 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 min-h-[32px]">
                {programsLoading ? (
                  <span className="flex items-center gap-2 text-[#6D22B5] font-bold text-xs">
                    <span className="w-3.5 h-3.5 border-2 border-[#6D22B5] border-t-transparent rounded-full animate-spin" />
                    <span>Loading programs...</span>
                  </span>
                ) : programsError ? (
                  <span className="text-xs font-bold text-rose-600">Unable to load programs</span>
                ) : (
                  <span className="text-xs font-bold text-slate-500">
                    Showing <strong className="text-slate-900">{totalHomeCount}</strong> {isSpokenEnglishSelected ? 'Language Options' : 'Programs'} in{' '}
                    <span className="text-[#6D22B5]">
                      {selectedCategory === 'all'
                        ? 'All Categories'
                        : isSpokenEnglishSelected
                        ? 'Spoken English'
                        : (categories.find(c => c.id === selectedCategory)?.name || selectedCategory)}
                    </span>
                  </span>
                )}
                <Link
                  to={isSpokenEnglishSelected ? "/spoken-tutorial" : "/courses"}
                  className="text-xs font-bold text-black hover:text-[#6D22B5] inline-flex items-center gap-1"
                >
                  <span>{isSpokenEnglishSelected ? 'Explore Spoken English' : 'View Full Catalog'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {programsLoading ? (
                <CourseSkeleton count={6} />
              ) : programsError ? (
                <div className="py-10 px-4 text-center bg-white border border-rose-200 rounded-2xl space-y-3">
                  <p className="text-xs text-rose-600 font-bold">Unable to load programs</p>
                  <p className="text-[11px] text-slate-500">{programsError}</p>
                  <button
                    onClick={() => loadHomePrograms()}
                    className="btn-primary px-4 py-2 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                  >
                 
                    <span>Try Again</span>
                  </button>
                </div>
              ) : isSpokenEnglishSelected ? (
                /* When Spoken English is selected in Program Tracks, display the 5 language options */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                  {PROGRAM_TRACK_LANGUAGES.map((lang) => (
                    <LanguageTrackCard key={lang.id} language={lang} />
                  ))}
                </div>
              ) : standardHomePrograms.length === 0 && !hasEnglishInHome ? (
                <div className="py-12 text-center text-slate-500 text-xs bg-slate-50 border border-slate-200 rounded-2xl">
                  No courses available in this category.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {standardHomePrograms.map((course: Course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      selectedCategory={selectedCategory}
                      onEnquire={(title, details) => openEnquiryModal(title, details)}
                    />
                  ))}

                  {/* Replace the individual Spoken English course cards with the 5 language options */}
                  {hasEnglishInHome &&
                    PROGRAM_TRACK_LANGUAGES.map((lang) => (
                      <LanguageTrackCard key={lang.id} language={lang} />
                    ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BUILD REAL-WORLD PROJECTS SHOWCASE SECTION                             */}
      {/* ========================================================================= */}
      <section className="section-padding bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[#6D22B5] text-xs font-extrabold tracking-widest uppercase block">
              PORTFOLIO-FIRST LEARNING
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
              Build Real-World Projects
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Every course emphasizes production implementation. Build high-impact capstone projects across Data Science, AI, Power BI, and NLP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DATA_SCIENCE_AI_PROJECTS.slice(0, 6).map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-[#6D22B5] transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={proj.image || proj.imageUrl}
                    alt={proj.imageAlt || proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg uppercase">
                    {proj.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-base text-slate-900 leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                    {proj.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-[#F1E8FA] text-[#6D22B5] text-[10px] font-semibold rounded-md border border-[#E0CEF5]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/programs/data-science-and-ai"
              className="btn-primary px-6 py-3 text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-2"
            >
              <span>Explore All Capstone Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LEARN FROM INDUSTRY EXPERTS & STATISTICS (EVION Black & Green)          */}
      {/* ========================================================================= */}
      <section
        ref={statsSectionRef}
        className="bg-[#050505] border-y border-slate-800 text-white py-14 sm:py-18 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#6D22B5] text-xs font-bold tracking-wider uppercase block">
              WORLD-CLASS MENTORSHIP
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white">
              Learn From Industry Experts
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Our faculty members and mentors bring decades of engineering, AI research, and data architecture expertise to your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center pt-4">
            <div className="space-y-1.5 p-5 rounded-2xl bg-[#141414] border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto text-[#6D22B5] mb-2">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white block">
                {statsAnimated ? '2,500+' : '0'}
              </span>
              <span className="text-xs font-semibold text-[#6D22B5] uppercase tracking-wider block">
                Active Learners
              </span>
            </div>

            <div className="space-y-1.5 p-5 rounded-2xl bg-[#141414] border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto text-amber-400 mb-2">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white block">
                {statsAnimated ? '4.9 / 5.0' : '0.0'}
              </span>
              <span className="text-xs font-semibold text-[#6D22B5] uppercase tracking-wider block">
                Average Rating
              </span>
            </div>

            <div className="space-y-1.5 p-5 rounded-2xl bg-[#141414] border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto text-[#6D22B5] mb-2">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white block">
                {statsAnimated ? '3 Guaranteed' : '0'}
              </span>
              <span className="text-xs font-semibold text-[#6D22B5] uppercase tracking-wider block">
                Placement Interviews*
              </span>
            </div>

            <div className="space-y-1.5 p-5 rounded-2xl bg-[#141414] border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto text-[#6D22B5] mb-2">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white block">
                {statsAnimated ? '100% Practical' : '0'}
              </span>
              <span className="text-xs font-semibold text-[#6D22B5] uppercase tracking-wider block">
                Lab-Driven Curriculum
              </span>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/instructors"
              className="btn-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition-colors inline-flex items-center gap-1.5"
            >
              <span>Meet Our Faculty &amp; Mentors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TOOLS & UPSKILLS SECTION                                               */}
      {/* ========================================================================= */}
      <section className="section-padding bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[#6D22B5] text-xs font-bold tracking-widest uppercase block">
                EXECUTIVE FAST-TRACKS
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950">
                Tools &amp; Upskills
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
                Master Python, Generative AI, Excel, Power BI, MS Office, and Prompt Engineering in focused, practical modules.
              </p>
            </div>
            <Link
              to="/tools-and-upskills"
              className="btn-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-2xs inline-flex items-center gap-1.5"
            >
              <span>View Tools &amp; Upskills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Python', desc: 'Syntax & Automation', link: '/programs/python', icon: Code2 },
              { name: 'Generative AI', desc: 'ChatGPT & Workflows', link: '/courses/generative-ai-chatgpt' },
              { name: 'Excel', desc: 'Formulas & Models', link: '/courses/advance-executive-excel', icon: BarChart3 },
              { name: 'Power BI', desc: 'KPI Dashboards', link: '/courses/advance-executive-power-bi', icon: BarChart3 },
              { name: 'MS Office', desc: 'Productivity Suite', link: '/courses/advance-executive-ms-office', icon: Wrench },
              { name: 'Prompt Eng.', desc: 'AI Engineering', link: '/courses/advance-executive-prompt-engineering' }
            ].map((tool, idx) => {
              const ToolIcon = 'icon' in tool ? tool.icon : undefined;
              return (
                <Link
                  key={idx}
                  to={tool.link}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#6D22B5] hover:bg-[#F1E8FA]/40 hover:shadow-xs transition-all text-center space-y-2 group flex flex-col justify-center items-center min-h-[120px]"
                >
                  {ToolIcon && (
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-[#6D22B5] group-hover:scale-105 transition-transform">
                      <ToolIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="font-display font-bold text-xs text-slate-900 block group-hover:text-black transition-colors">
                      {tool.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {tool.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7B. ENGLISH MIRROR PARTNER SPOTLIGHT BANNER                               */}
      {/* ========================================================================= */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnglishMirrorCategoryCard variant="featured_banner" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FREQUENTLY ASKED QUESTIONS SECTION (FAQ SEO)                           */}
      {/* ========================================================================= */}
      <section className="section-padding bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-[#6D22B5] text-xs font-bold tracking-widest uppercase block">
              HAVE QUESTIONS?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
              Get answers to common queries regarding course structure, batch timings, hands-on projects, and placement assistance.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs">
            <Accordion items={accordionHomeFaqs} />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. START YOUR LEARNING JOURNEY (FINAL CALL TO ACTION - EVION Dark)         */}
      {/* ========================================================================= */}
      <section className="bg-[#050505] text-white py-16 text-center border-t border-slate-800 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <span className="px-3 py-1 bg-[#F1E8FA] text-[#6D22B5] border border-[#E0CEF5] text-xs font-bold rounded-full uppercase tracking-wider inline-block">
            Take the Next Step
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white">
            Start Your Learning Journey
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-normal">
            Join ambitious learners building verified technological competencies across Data Science, Artificial Intelligence, Python, and Data Analytics.
          </p>
          <div className="flex justify-center gap-3.5 pt-2">
            <Link
              to="/programs"
              className="btn-primary px-8 py-3.5 text-xs sm:text-sm font-bold rounded-xl shadow-md"
            >
              Explore Programs
            </Link>
            <button
              type="button"
              onClick={() => openEnquiryModal()}
              className="px-8 py-3.5 text-xs sm:text-sm font-bold text-white border border-slate-700 hover:border-[#6D22B5] hover:text-[#6D22B5] rounded-xl transition-colors cursor-pointer"
            >
              Speak to Advisor
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
