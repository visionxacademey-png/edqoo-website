import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PhoneCall,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Users,
  Video
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useEnquiry } from '../../context/EnquiryContext';
import { categoryService } from '../../services/categoryService';
import { courseService } from '../../services/courseService';
import type { Category, Course } from '../../types';
import {
  SPOKEN_TUTORIAL_SUBCATEGORIES,
  DEFAULT_ENGLISH_FALLBACK_IMAGE,
  getEnrolledStudentsForSubCategory,
  type SpokenTutorialSubCategory
} from './data';
import { getCacheBustedImageUrl } from '../../utils/imageUrl';
import { LanguageCoursesSection } from './LanguageCoursesSection';

export const SpokenTutorialLanding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openEnquiryModal } = useEnquiry();
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [dbCourses, setDbCourses] = useState<Course[]>([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      categoryService.getCategories().catch((err) => {
        console.warn('Could not fetch categories from server:', err);
        return [];
      }),
      courseService.getCourses({ category: 'Spoken Tutorial' }).catch((err) => {
        console.warn('Could not fetch spoken courses from server:', err);
        return [];
      })
    ]).then(([cats, courses]) => {
      if (isMounted) {
        if (Array.isArray(cats)) setDbCategories(cats);
        if (Array.isArray(courses)) setDbCourses(courses);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth scroll to the 6 Specialized Fluency Categories when hash is present
  useEffect(() => {
    if (
      location.hash === '#specialized-fluency-categories' ||
      location.hash === '#fluency-categories' ||
      window.location.hash === '#specialized-fluency-categories' ||
      window.location.hash === '#fluency-categories'
    ) {
      const scrollTimer = setTimeout(() => {
        const target =
          document.getElementById('specialized-fluency-categories') ||
          document.getElementById('fluency-categories');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(scrollTimer);
    }
  }, [location.hash]);

  // Canonical ordering for the 6 intended courses
  const CANONICAL_ORDER = [
    '1-to-1-live-spoken-english',
    'fluency-builder-plan',
    'corporate-english-fluency-builder',
    'little-mirrors',
    'executive-interview-preparation-track',
    'ielts-intensive'
  ];

  // Merge database courses and categories with rich poster definitions to ensure dynamic priority while preserving full poster details
  const subcategories: SpokenTutorialSubCategory[] = SPOKEN_TUTORIAL_SUBCATEGORIES.map((staticItem) => {
    const dbCourse = dbCourses.find(
      (c) =>
        c.id === staticItem.id ||
        c.slug === staticItem.slug ||
        c.title.toLowerCase().trim() === staticItem.title.toLowerCase().trim() ||
        (staticItem.id === '1-to-1-live-spoken-english' && (c.id === '1-to-1-live-spoken-english' || c.title.toLowerCase().includes('communicative'))) ||
        (staticItem.id === 'cat-corporate-english-fluency-builder' && c.id === 'elite-corporate-transformation-track') ||
        (staticItem.id === 'cat-little-mirrors' && c.id === 'kids-1-to-1-english-fluency-program') ||
        (staticItem.id === 'cat-executive-interview-prep-track' && c.id === 'targeted-interview-prep-masterclass') ||
        (staticItem.id === 'cat-ielts-intensive' && c.id === 'ielts-intensive-1-to-1-crash-training') ||
        (staticItem.id === 'cat-fluency-builder-plan' && c.id === 'standard-plan-telephonic-calling-sessions')
    );

    const dbMatch = dbCategories.find(
      (c) =>
        c.slug === staticItem.slug ||
        c.id === staticItem.id ||
        c.name.toLowerCase().trim() === staticItem.title.toLowerCase().trim()
    );

    const title = dbCourse?.title || dbMatch?.name || staticItem.title;
    const subtitle = dbMatch?.subtitle || staticItem.subtitle;
    const description = dbCourse?.description || dbCourse?.shortDescription || dbMatch?.description || staticItem.description;
    const supportingText = dbCourse?.supportingText || dbMatch?.supportingText || staticItem.supportingText;
    const image = staticItem.image || dbCourse?.image || dbMatch?.heroImage || '';
    const learningFormat = dbCourse?.liveHours || dbMatch?.learningFormat || staticItem.learningFormat;

    const rawFeatures = (Array.isArray(dbCourse?.features) && dbCourse.features.length > 0)
      ? dbCourse.features
      : (Array.isArray(dbMatch?.features) && dbMatch.features.length > 0)
      ? dbMatch.features
      : staticItem.features;

    const features = rawFeatures.map((f: any, idx: number) => ({
      id: f.id || idx + 1,
      title: f.title || f,
      description: f.description || ''
    }));

    const learningBenefits = (Array.isArray(dbCourse?.careerReadiness) && dbCourse.careerReadiness.length > 0)
      ? dbCourse.careerReadiness
      : (Array.isArray(dbMatch?.learningBenefits) && dbMatch.learningBenefits.length > 0)
      ? dbMatch.learningBenefits
      : staticItem.learningBenefits;

    return {
      ...staticItem,
      id: dbCourse?.id || staticItem.id,
      slug: staticItem.slug,
      title,
      subtitle,
      description,
      supportingText,
      image,
      learningFormat,
      features,
      learningBenefits,
      enrolledStudents: staticItem.enrolledStudents || getEnrolledStudentsForSubCategory(staticItem)
    };
  }).sort((a, b) => {
    const aIdx = CANONICAL_ORDER.findIndex((s) => a.slug === s || a.id.includes(s) || (s === '1-to-1-live-spoken-english' && a.id === '1-to-1-live-spoken-english'));
    const bIdx = CANONICAL_ORDER.findIndex((s) => b.slug === s || b.id.includes(s) || (s === '1-to-1-live-spoken-english' && b.id === '1-to-1-live-spoken-english'));
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
  });

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Spoken English', url: '/spoken-tutorial' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SEO
        title="Spoken English — English Mirror 1:1 English Fluency Programs | Edqoo"
        description="Master English communication with English Mirror Spoken English programs: 1:1 Communicative English Mastery, Fluency Builder Plan, Corporate English Fluency Builder, Little Mirrors for Kids, Executive Interview Preparation Track, and IELTS Intensive."
      />

      {/* Breadcrumbs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-1 sm:pb-1.5">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <LanguageCoursesSection />
      {/* Main 6 Subcategories Grid Section */}
      <section
        id="specialized-fluency-categories"
        className="py-12 sm:py-16 scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D22B5] block mb-1">
                Explore Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">
                6 Specialized Fluency Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Select your focus track to explore comprehensive course details, session highlights, curriculum benefits, and batch schedules.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#6D22B5] animate-pulse" />
              <span>All 6 Programs Available for Admission</span>
            </div>
          </div>

          {/* Grid of the 6 Subcategories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {subcategories.map((subcat, index) => {
              const detailsUrl = `/spoken-tutorial/${subcat.slug}`;

              return (
                <motion.div
                  key={subcat.id || subcat.slug}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  onClick={() => navigate(detailsUrl)}
                  className="cursor-pointer group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-[#6D22B5] hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Image Area with Poster Artwork */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img
                      src={getCacheBustedImageUrl(subcat.image || DEFAULT_ENGLISH_FALLBACK_IMAGE, '20261019_v3')}
                      alt={`${subcat.title} - English Mirror Spoken Tutorial`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== DEFAULT_ENGLISH_FALLBACK_IMAGE) {
                          target.src = DEFAULT_ENGLISH_FALLBACK_IMAGE;
                        }
                      }}
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Subtitle / Format Badge on Top */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#0A0D18]/85 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">
                        {subcat.subtitle || 'Spoken Tutorial'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#6D22B5] text-white text-[10px] font-extrabold shadow-sm">
                        Track {index + 1}
                      </span>
                    </div>

                    {/* Category Title floating on bottom of image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-display font-extrabold text-white tracking-tight drop-shadow-md group-hover:text-purple-200 transition-colors">
                        {subcat.title}
                      </h3>
                      {subcat.supportingText && (
                        <p className="text-[11px] font-medium text-purple-200 line-clamp-1 drop-shadow-xs">
                          {subcat.supportingText}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                    {/* Student Enrollment Count */}
                    <div className="flex items-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F1E8FA] text-[#6D22B5] border border-[#E0CEF5] text-xs font-bold tracking-tight shadow-2xs">
                        <Users className="w-3.5 h-3.5 text-[#6D22B5] shrink-0" />
                        <span>{subcat.enrolledStudents || getEnrolledStudentsForSubCategory(subcat)}</span>
                      </span>
                    </div>

                    {/* Short Description */}
                    <div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {subcat.description}
                      </p>
                    </div>

                    {/* 3 or 4 Key Feature Highlights */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Core Highlights
                      </span>
                      <ul className="space-y-1.5">
                        {subcat.features.slice(0, 4).map((feature) => (
                          <li
                            key={feature.id}
                            className="text-xs text-slate-700 flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#6D22B5] flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2 leading-snug font-medium break-words">{feature.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Learning Format */}
                    {subcat.learningFormat && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="px-2.5 py-1.5 rounded-lg bg-purple-50/70 border border-purple-100 flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-[#6D22B5] flex-shrink-0" />
                          <span className="text-[11px] font-semibold text-purple-950 line-clamp-1">
                            {subcat.learningFormat}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons: View Details & Enquire Now */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEnquiryModal(subcat.title, {
                            category: 'Spoken Tutorial',
                            courseId: subcat.id
                          });
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#6D22B5] hover:bg-[#5C1C9A] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Enquire Now</span>
                      </button>

                      <Link
                        to={detailsUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="py-2 px-3.5 rounded-xl border border-slate-200 hover:border-[#6D22B5] hover:bg-purple-50/50 text-slate-700 hover:text-[#6D22B5] text-xs font-bold inline-flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learn Spoken English in Your Language Section */}
      

      {/* Trust & Methodology Banner Section */}
      <section className="py-12 bg-white border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#6D22B5] text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                1-to-1 Dedicated Speaking Focus
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero crowding and zero fear of comparison. Every live session or telephonic call is 100% focused on your active speaking time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#6D22B5] text-white flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Blended Learning Methodology
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Combines real-time 1:1 expert guidance with HD recorded video masterclasses, educational E-PDFs, and daily JAM updates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#6D22B5] text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                English Mirror Certification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive verifiable certification upon completing your course tenure requirements, validating your conversational proficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-[#0A0D18] via-[#1E1138] to-[#0A0D18] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-[#6D22B5]/40 border border-purple-400/40 text-[11px] font-bold uppercase tracking-wider text-purple-200">
            Start Your Transformation
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Ready to Speak English with Absolute Confidence?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Submit an enquiry today. Our communication advisors will assess your current proficiency level and recommend the optimal batch schedule for you.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => openEnquiryModal('Spoken English', { category: 'Spoken English' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6D22B5] hover:bg-[#5C1C9A] text-white font-bold text-sm shadow-lg shadow-purple-900/50 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Enquire for Spoken English</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpokenTutorialLanding;
