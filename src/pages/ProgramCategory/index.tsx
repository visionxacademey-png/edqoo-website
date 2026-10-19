import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  Clock,
  CheckCircle2,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { categoryService } from '../../services/categoryService';
import type { Course, Category } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Accordion } from '../../components/ui/Accordion';
import { useEnquiry } from '../../context/EnquiryContext';
import { getCacheBustedImageUrl, DEFAULT_ENGLISH_COURSE_FALLBACK } from '../../utils/imageUrl';
import { CourseSkeleton } from '../../components/ui/CourseSkeleton';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { EnglishMirrorCategoryCard } from '../../components/englishMirror/EnglishMirrorCategoryCard';
import { LanguageTrackCard, PROGRAM_TRACK_LANGUAGES } from '../../components/common/LanguageTrackCard';

export const ProgramCategory: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const location = useLocation();
  const { openEnquiryModal } = useEnquiry();

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Normalize slug from route
  const targetSlug = useMemo(() => {
    if (location.pathname === '/tools-and-upskills' || location.pathname === '/tools-and-upskills/') {
      return 'tools-and-upskills';
    }
    if (
      location.pathname === '/english-mirror' ||
      location.pathname === '/english-mirror/' ||
      location.pathname === '/englishmirror' ||
      location.pathname === '/programs/english-mirror'
    ) {
      return 'english-mirror';
    }
    if (location.pathname === '/programs' || location.pathname === '/programs/') {
      return 'all';
    }
    return categorySlug || 'data-science-and-ai';
  }, [categorySlug, location.pathname]);

  // Load categories and courses from database
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      setLoadingCategories(true);
      setLoadingCourses(true);
      setError(null);

      try {
        const [cats, courses] = await Promise.all([
          categoryService.getCategories(controller.signal),
          courseService.getCourses({ signal: controller.signal })
        ]);

        if (isMounted) {
          if (Array.isArray(cats)) {
            setCategories(cats);
          }
          if (Array.isArray(courses)) {
            setCourseList(courses);
          }
        }
      } catch (err: any) {
        if (err?.name !== 'CanceledError' && err?.name !== 'AbortError' && isMounted) {
          console.error('Failed to load category data:', err);
          setError(err?.message || 'Unable to load data from database.');
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
          setLoadingCourses(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Find active category by slug or id
  const activeCategory = useMemo(() => {
    if (targetSlug === 'all') return null;
    return (
      categories.find(
        (c) =>
          c.slug.toLowerCase() === targetSlug.toLowerCase() ||
          c.id === targetSlug ||
          c.name.toLowerCase().replace(/\s+/g, '-') === targetSlug.toLowerCase()
      ) || null
    );
  }, [categories, targetSlug]);

  // Filter courses for active category
  const categoryCourses = useMemo(() => {
    if (!activeCategory) return courseList;

    return courseList.filter((course) => {
      // 1. Check direct categoryId match
      if (course.categoryId && course.categoryId === activeCategory.id) {
        return true;
      }
      // 2. Check categoryIds array match
      if (Array.isArray(course.categoryIds) && course.categoryIds.includes(activeCategory.id)) {
        return true;
      }
      // 3. Check exact name match
      if (course.category && course.category.trim().toLowerCase() === activeCategory.name.trim().toLowerCase()) {
        return true;
      }
      // 4. Check categories array match
      if (
        Array.isArray(course.categories) &&
        course.categories.some((cat) => cat.trim().toLowerCase() === activeCategory.name.trim().toLowerCase())
      ) {
        return true;
      }
      // 5. Check slug match
      if (
        course.category &&
        course.category
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') === activeCategory.slug.toLowerCase()
      ) {
        return true;
      }
      // 6. Handle python specific match
      if (activeCategory.slug === 'python') {
        return (
          course.title.toLowerCase().includes('python') ||
          course.slug.includes('python') ||
          (course.skills && course.skills.some((s) => s.toLowerCase().includes('python')))
        );
      }
      return false;
    });
  }, [courseList, activeCategory]);

  // If viewing the general /programs overview hub
  if (targetSlug === 'all') {
    return (
      <div className="bg-white min-h-screen text-left">
        <SEO
          title="Edqoo Programs | Professional Program Tracks & Certifications"
          description="Explore Edqoo's professional program tracks in Data Science, Artificial Intelligence, Python, Machine Learning, Data Analytics, and Tools & Upskills."
          canonical="/programs"
          keywords="Edqoo programs, Edqoo Data Science, Edqoo AI, Edqoo Python, Edqoo Data Analytics, online learning platform"
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Edqoo Programs', url: '/programs' }
          ]}
        />

        {/* Hero */}
        <section className="bg-[#F1E8FA]/40 text-slate-950 py-14 sm:py-20 border-b border-slate-200 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
            <span className="px-3.5 py-1.5 bg-[#F1E8FA] border border-[#E0CEF5] text-[#6D22B5] rounded-full text-xs font-bold uppercase tracking-wider inline-block">
              Career-Focused Learning Paths
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950">
              Explore Our Programs
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Choose from structured master programs, specialized tracks, and executive upskilling courses designed to build verified industry skills.
            </p>
          </div>
        </section>

        {/* Breadcrumb Bar */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <Breadcrumbs items={[{ name: 'Programs', url: '/programs' }]} />
          </div>
        </div>

        {/* Program Track Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {loadingCategories ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-pulse">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-white border border-rose-200 rounded-2xl space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-rose-600 font-bold">{error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs bg-white border border-slate-200 rounded-2xl">
              No program tracks currently available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((item) => {
                const isEnglishMirror = item.slug === 'english-mirror' || item.isPartner;
                const linkUrl = item.slug === 'tools-and-upskills'
                  ? '/tools-and-upskills'
                  : item.slug === 'english-mirror'
                  ? '/english-mirror'
                  : `/programs/${item.slug}`;

                return (
                  <div
                    key={item.id || item.slug}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-[#6D22B5] transition-all flex flex-col justify-between group"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        {isEnglishMirror ? (
                          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform overflow-hidden">
                            <img src="/englishclass.png" alt="English Mirror Logo" className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#F1E8FA] border border-[#E0CEF5] flex items-center justify-center text-[#6D22B5] group-hover:scale-105 transition-transform">
                            {getCategoryIcon(item.icon, 'w-6 h-6')}
                          </div>
                        )}
                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                          {item.badge || (isEnglishMirror ? 'Partner Track' : 'Track')}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h2 className="text-xl font-display font-extrabold text-slate-900 group-hover:text-[#6D22B5] transition-colors">
                          <Link to={linkUrl}>{item.name}</Link>
                        </h2>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {item.subtitle || item.description}
                        </p>
                      </div>

                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                          {item.highlights.slice(0, 2).map((hl, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-[#6D22B5] flex-shrink-0 mt-0.5" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={linkUrl}
                        className="text-xs font-bold text-[#6D22B5] hover:text-[#381061] inline-flex items-center gap-1.5"
                      >
                        <span>Explore {item.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  // Loading category state
  if (loadingCategories) {
    return (
      <div className="bg-white min-h-screen py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="w-32 h-6 bg-slate-200 rounded-full mx-auto" />
          <div className="w-3/4 h-12 bg-slate-200 rounded-xl mx-auto" />
          <div className="w-1/2 h-6 bg-slate-100 rounded-lg mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Category not found
  if (!activeCategory) {
    return (
      <div className="bg-white min-h-screen py-24 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-[#6D22B5] mx-auto" />
          <h1 className="text-2xl font-black text-slate-900">Program Track Not Found</h1>
          <p className="text-xs text-slate-600">
            The program track you are looking for does not exist or has been updated.
          </p>
          <div className="pt-4">
            <Link
              to="/programs"
              className="btn-primary px-5 py-2.5 text-xs font-bold rounded-xl inline-flex items-center gap-2"
            >
              <span>View All Programs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryName = activeCategory.name || 'Program Track';
  const categoryTitle = activeCategory.title || `${categoryName} Courses & Certifications`;
  const categoryH1 = categoryName;
  const categorySubtitle =
    activeCategory.subtitle ||
    activeCategory.description ||
    `Master ${categoryName} with hands-on projects, industry curriculum, and dedicated faculty mentorship.`;
  const categoryHeroBadge = activeCategory.heroBadge || (activeCategory.isPartner ? 'Partner Track' : 'Comprehensive Industry Track');
  const canonicalUrl =
    activeCategory.slug === 'tools-and-upskills'
      ? '/tools-and-upskills'
      : activeCategory.slug === 'english-mirror'
      ? '/english-mirror'
      : `/programs/${activeCategory.slug}`;

  const breadcrumbItems = [
    { name: 'Programs', url: '/programs' },
    { name: categoryH1, url: canonicalUrl }
  ];

  const highlights = activeCategory.highlights || [
    'Full industry-aligned syllabus and structured learning path',
    'Hands-on lab assignments with real-world enterprise datasets',
    'Faculty mentorship, code reviews, and live interactive sessions',
    'Verifiable professional certification on completion'
  ];

  const curriculumPillars = activeCategory.curriculumPillars || [
    { title: 'Core Foundations & Principles', desc: 'Syntax, environment setups, core theoretical concepts, and standard tooling.' },
    { title: 'Applied Engineering & Techniques', desc: 'Practical methodologies, real-world case analysis, and hands-on laboratory exercises.' },
    { title: 'Advanced Production Workflows', desc: 'Complex problem solving, performance optimization, and architectural best practices.' },
    { title: 'Capstone Implementation & Portfolio', desc: 'End-to-end portfolio projects verified by industry mentors.' }
  ];

  const faqs = activeCategory.faqs || [
    {
      question: `What is included in the ${categoryName} program?`,
      answer: 'The program includes live interactive classes, on-demand session recordings, complete LMS access, industry capstone projects, 1-on-1 mentorship, and placement guidance.'
    },
    {
      question: `Who is this ${categoryName} track designed for?`,
      answer: 'It is designed for students, graduates, software developers, analysts, and working professionals looking to advance their career with verified technical expertise.'
    },
    {
      question: 'Do I need prior experience before enrolling?',
      answer: 'Our curriculum starts from core fundamentals and progressively advances to sophisticated real-world applications with dedicated mentor guidance.'
    },
    {
      question: 'What certification is provided upon completion?',
      answer: 'Graduates receive the verified Edqoo Professional Certificate highlighting practical portfolio projects completed during the course.'
    }
  ];

  const accordionFaqs = faqs.map((f, i) => ({
    id: `faq-${i + 1}`,
    title: f.question,
    content: <p className="text-xs leading-relaxed text-slate-600">{f.answer}</p>
  }));

  const isEnglishMirror =
    activeCategory.slug === 'english-mirror' ||
    activeCategory.slug === 'spoken-tutorial' ||
    activeCategory.slug === 'spoken-english' ||
    activeCategory.id === 'cat-spoken-tutorial' ||
    activeCategory.id === 'cat-english-mirror' ||
    activeCategory.name.toLowerCase().includes('spoken english') ||
    activeCategory.name.toLowerCase().includes('spoken tutorial') ||
    activeCategory.name.toLowerCase().includes('english mirror') ||
    Boolean(activeCategory.isPartner);

  return (
    <div className="bg-white min-h-screen text-slate-900 text-left">
      <SEO
        title={activeCategory.seoTitle || `${categoryTitle} | Edqoo`}
        description={activeCategory.seoDescription || categorySubtitle}
        canonical={canonicalUrl}
        keywords={activeCategory.metaKeywords || [`Edqoo ${categoryName}`, `${categoryName} course`, 'online certification']}
        breadcrumbs={[{ name: 'Home', url: '/' }, ...breadcrumbItems]}
        faqs={faqs}
        ogImage={activeCategory.heroImage}
        ogImageAlt={`Edqoo ${categoryH1} Online Course`}
      />

      {/* Hero Banner */}
      <section className="bg-white text-slate-950 py-12 sm:py-16 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading & Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F1E8FA] border border-[#E0CEF5] text-[#6D22B5] rounded-full text-xs font-bold uppercase tracking-wider">
                {getCategoryIcon(activeCategory.icon, 'w-4 h-4 text-[#6D22B5]')}
                <span>{categoryHeroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
                {categoryH1}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                {categorySubtitle}
              </p>

              {/* Highlights Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 pb-2">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#6D22B5] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openEnquiryModal(`Program Category: ${categoryH1}`)}
                  className="btn-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Enquire for Next Batch</span>
                </button>
                <Link
                  to="/courses"
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <span>View All {categoryCourses.length} Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md">
                <div
                  className={
                    isEnglishMirror && !activeCategory.heroImage?.startsWith('http')
                      ? 'p-8 flex items-center justify-center bg-purple-50/50 aspect-[4/3]'
                      : ''
                  }
                >
                  <img
                    src={getCacheBustedImageUrl(activeCategory.heroImage, undefined, DEFAULT_ENGLISH_COURSE_FALLBACK)}
                    alt={`Edqoo ${categoryH1} course`}
                    className={`w-full ${
                      isEnglishMirror && !activeCategory.heroImage?.startsWith('http')
                        ? 'h-full object-contain max-h-48'
                        : 'aspect-[4/3] object-cover'
                    }`}
                    loading="eager"
                    fetchPriority="high"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== DEFAULT_ENGLISH_COURSE_FALLBACK) {
                        target.src = DEFAULT_ENGLISH_COURSE_FALLBACK;
                      }
                    }}
                  />
                </div>
                <div className="p-4 bg-white/95 backdrop-blur-xs border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6D22B5] block">
                      {isEnglishMirror ? 'Partner Program' : 'Accredited Learning'}
                    </span>
                    <span className="font-bold text-slate-900">
                      {isEnglishMirror ? '1-to-1 Live & Telephonic' : 'Industry-Aligned Projects'}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-50 text-[#6D22B5] font-bold rounded-lg border border-[#E0CEF5] text-[11px]">
                    Live + Flexible
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Courses in this Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#6D22B5] uppercase tracking-wider block">
            Featured Offerings
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            {isEnglishMirror ? 'Available Language Options' : `Available Courses in ${categoryH1}`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            {isEnglishMirror
              ? 'Select your native language to learn spoken English step-by-step with dedicated 1:1 coaching.'
              : 'Each program includes hands-on labs, real-world projects, dedicated faculty mentorship, and verifiable certification.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingCourses ? (
            <CourseSkeleton count={3} className="col-span-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
          ) : error ? (
            <div className="col-span-full py-10 px-4 text-center bg-white border border-rose-200 rounded-2xl space-y-3">
              <p className="text-xs text-rose-600 font-bold">{error}</p>
            </div>
          ) : isEnglishMirror ? (
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROGRAM_TRACK_LANGUAGES.map((lang) => (
                <LanguageTrackCard key={lang.id} language={lang} />
              ))}
            </div>
          ) : categoryCourses.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-white border border-slate-200 rounded-2xl">
              No courses currently listed under {categoryH1}.
            </div>
          ) : (
            <>
              {categoryCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-[#6D22B5] transition-all flex flex-col justify-between group"
                >
                  {/* Course Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img
                      src={getCacheBustedImageUrl(course.image, course.updatedAt || course.imageUpdatedAt, DEFAULT_ENGLISH_COURSE_FALLBACK)}
                      alt={`${course.title} - Edqoo online course`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== DEFAULT_ENGLISH_COURSE_FALLBACK) {
                          target.src = DEFAULT_ENGLISH_COURSE_FALLBACK;
                        }
                      }}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 border border-slate-200 shadow-2xs">
                      <Clock className="w-3 h-3 text-[#6D22B5]" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{course.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({course.students}+ enrolled)</span>
                      </div>

                      <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-black transition-colors line-clamp-2">
                        <Link to={`/courses/${course.slug}`}>{course.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {course.shortDescription || course.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600">
                        {course.level || 'Beginner to Advanced'}
                      </span>
                      <Link
                        to={`/courses/${course.slug}`}
                        className="px-3 py-1.5 bg-[#F1E8FA] hover:bg-[#E0CEF5]/60 text-[#6D22B5] text-xs font-bold rounded-lg border border-[#E0CEF5] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>View Syllabus</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* English Mirror card if relevant */}
              {!isEnglishMirror && activeCategory.slug !== 'english-mirror' && (
                <EnglishMirrorCategoryCard variant="home_grid" />
              )}
            </>
          )}
        </div>
      </section>

      {/* Curriculum Pillars Section */}
      <section className="bg-white border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#6D22B5] uppercase tracking-wider block">
              Core Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              What You Will Learn in {categoryH1}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A structured progression designed by enterprise architects and academic leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculumPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 hover:border-[#6D22B5] transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-[#F1E8FA] text-[#6D22B5] border border-[#E0CEF5] font-bold text-xs flex items-center justify-center font-display">
                  0{idx + 1}
                </span>
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#6D22B5] uppercase tracking-wider block">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Frequently Asked Questions — {categoryH1}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Find immediate answers about batch schedules, course prerequisites, and certification.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs">
          <Accordion items={accordionFaqs} />
        </div>
      </section>

      {/* Final Advisory CTA - White + Purple theme */}
      <section className="bg-white text-slate-950 py-12 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">
            Start Your Journey in {categoryH1} Today
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Speak with an Edqoo senior academic counselor to discuss batch schedules, career roadmaps, and student offers.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => openEnquiryModal(`Category CTA: ${categoryH1}`)}
              className="btn-primary px-6 py-3 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>Request Free Counseling Callback</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramCategory;
