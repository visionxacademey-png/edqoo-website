import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  PhoneCall,
  CheckCircle2,
  Clock,
  Calendar,
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useEnquiry } from '../../context/EnquiryContext';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';
import {
  SPOKEN_TUTORIAL_SUBCATEGORIES,
  getSubCategoryBySlug,
  DEFAULT_ENGLISH_FALLBACK_IMAGE,
  type SpokenTutorialSubCategory
} from './data';
import { LittleMirrorsShowcase } from '../../components/englishMirror/LittleMirrorsShowcase';
import { CorporateEnglishShowcase } from '../../components/englishMirror/CorporateEnglishShowcase';
import { ExecutiveInterviewShowcase } from '../../components/englishMirror/ExecutiveInterviewShowcase';
import { IeltsIntensiveShowcase } from '../../components/englishMirror/IeltsIntensiveShowcase';

interface SubCategoryDetailProps {
  slugProp?: string;
}

export const SubCategoryDetail: React.FC<SubCategoryDetailProps> = ({ slugProp }) => {
  const { slug } = useParams<{ slug?: string }>();
  const { openEnquiryModal } = useEnquiry();

  const activeSlug = slugProp || slug || '';
  const [dbCategory, setDbCategory] = useState<Category | null>(null);

  // Static fallback data from poster definition
  const staticData = getSubCategoryBySlug(activeSlug);

  useEffect(() => {
    if (!activeSlug) return;
    let isMounted = true;

    categoryService
      .getCategoryBySlug(activeSlug)
      .then((cat) => {
        if (isMounted && cat) {
          setDbCategory(cat);
        }
      })
      .catch((err) => {
        console.warn(`Could not load category ${activeSlug} from database:`, err);
      });

    return () => {
      isMounted = false;
    };
  }, [activeSlug]);

  if (!staticData && !dbCategory) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">
          Category Not Found
        </h2>
        <p className="text-xs text-slate-500 mb-6 max-w-md">
          The requested Spoken English subcategory could not be found. Please check our full catalogue.
        </p>
        <Link
          to="/spoken-tutorial"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D22B5] text-white font-bold text-xs shadow-sm hover:bg-[#5C1C9A]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Spoken English Programs</span>
        </Link>
      </div>
    );
  }

  // Merge database category record if present with static poster data
  const category: SpokenTutorialSubCategory = {
    ...(staticData || SPOKEN_TUTORIAL_SUBCATEGORIES[0]),
    title: dbCategory?.name || staticData?.title || '',
    subtitle: dbCategory?.subtitle || staticData?.subtitle || '',
    description: dbCategory?.description || staticData?.description || '',
    supportingText: dbCategory?.supportingText || staticData?.supportingText || '',
    highlightText: dbCategory?.highlightText || staticData?.highlightText || 'Mirror your success with fluent English',
    image: staticData?.image || dbCategory?.heroImage || '',
    learningFormat: dbCategory?.learningFormat || staticData?.learningFormat || '',
    features: (Array.isArray(dbCategory?.features) && dbCategory.features.length > 0)
      ? dbCategory.features.map((f: any, idx: number) => ({
          id: f.id || idx + 1,
          title: f.title || f,
          description: f.description || ''
        }))
      : staticData?.features || [],
    learningBenefits: (Array.isArray(dbCategory?.learningBenefits) && dbCategory.learningBenefits.length > 0)
      ? dbCategory.learningBenefits
      : staticData?.learningBenefits || []
  };

  const isCorporateEnglish =
    category.id === 'cat-corporate-english-fluency-builder' ||
    category.slug === 'corporate-english-fluency-builder' ||
    activeSlug === 'corporate-english-fluency-builder' ||
    category.id === 'elite-corporate-transformation-track' ||
    category.slug === 'elite-corporate-transformation-track' ||
    activeSlug === 'elite-corporate-transformation-track' ||
    category.title.toLowerCase().includes('corporate english');

  const isExecutiveInterview =
    category.id === 'cat-executive-interview-prep-track' ||
    category.slug === 'executive-interview-preparation-track' ||
    category.slug === 'executive-interview-prep-track' ||
    activeSlug === 'executive-interview-preparation-track' ||
    activeSlug === 'executive-interview-prep-track' ||
    activeSlug === '1-to-1-executive-interview-preparation-track' ||
    category.id === 'targeted-interview-prep-masterclass' ||
    category.slug === 'targeted-interview-prep-masterclass' ||
    activeSlug === 'targeted-interview-prep-masterclass' ||
    category.title.toLowerCase().includes('interview preparation') ||
    category.title.toLowerCase().includes('interview prep');

  const isIeltsIntensive =
    category.id === 'cat-ielts-intensive' ||
    category.slug === 'ielts-intensive' ||
    activeSlug === 'ielts-intensive' ||
    category.id === 'ielts-intensive-1-to-1-crash-training' ||
    category.slug === 'ielts-intensive-1-to-1-crash-training' ||
    activeSlug === 'ielts-intensive-1-to-1-crash-training' ||
    category.title.toLowerCase().includes('ielts');

  const is1to1Mastery =
    category.id === '1-to-1-live-spoken-english' ||
    category.slug === '1-to-1-live-spoken-english' ||
    activeSlug === '1-to-1-live-spoken-english' ||
    category.slug === '1:1-communicative-english-mastery' ||
    activeSlug === '1:1-communicative-english-mastery' ||
    category.slug === '1-to-1-communicative-english-mastery' ||
    activeSlug === '1-to-1-communicative-english-mastery' ||
    category.title.toLowerCase().includes('communicative english');

  const isFluencyBuilder =
    !isCorporateEnglish &&
    !isExecutiveInterview &&
    !isIeltsIntensive &&
    !is1to1Mastery &&
    (category.id === 'cat-fluency-builder-plan' ||
      category.slug === 'fluency-builder-plan' ||
      activeSlug === 'fluency-builder-plan' ||
      category.title.toLowerCase().includes('fluency builder'));

  const isLittleHearts =
    category.id === 'cat-little-hearts' ||
    category.slug === 'little-hearts' ||
    activeSlug === 'little-hearts' ||
    category.title.toLowerCase().includes('little heart');

  const isLittleMirrors =
    !isLittleHearts &&
    (category.id === 'cat-little-mirrors' ||
      category.slug === 'little-mirrors' ||
      activeSlug === 'little-mirrors' ||
      category.title.toLowerCase().includes('little mirror'));

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Spoken English', url: '/spoken-tutorial' },
    { name: isLittleHearts ? 'Little Hearts' : category.title, url: `/spoken-tutorial/${isLittleHearts ? 'little-hearts' : category.slug}` }
  ];

  const handleEnquire = () => {
    openEnquiryModal(isLittleHearts ? 'Little Hearts' : category.title, {
      category: 'Spoken Tutorial',
      courseId: isCorporateEnglish
        ? 'elite-corporate-transformation-track'
        : isExecutiveInterview
        ? 'targeted-interview-prep-masterclass'
        : isIeltsIntensive
        ? 'ielts-intensive-1-to-1-crash-training'
        : is1to1Mastery
        ? '1-to-1-live-spoken-english'
        : isLittleHearts
        ? 'cat-little-hearts'
        : category.id
    });
  };

  return (
    <div className={`min-h-screen ${(isCorporateEnglish || isFluencyBuilder || isLittleMirrors || isLittleHearts || is1to1Mastery) ? 'bg-white text-slate-900' : (isExecutiveInterview || isIeltsIntensive) ? 'bg-[#FAF7FE] text-slate-900' : 'bg-[#FDFBF9] text-slate-900'} ${(isLittleMirrors || isLittleHearts) ? 'little-mirrors-page' : ''}`}>
      <SEO
        title={`${isLittleHearts ? 'Little Hearts' : category.title} — Spoken English | English Mirror & Edqoo`}
        description={`${category.description} ${category.supportingText || ''} Learn with dedicated 1-on-1 English Mirror language mentors.`}
      />

      {/* Navigation Breadcrumbs & Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Breadcrumbs
            items={breadcrumbItems}
            className={is1to1Mastery ? "text-[#333333] [&_a]:text-[#333333] [&_a:hover]:text-[#6D22B5] [&_span]:text-[#202020] [&_svg]:text-neutral-400" : ""}
          />
          <Link
            to="/spoken-tutorial"
            className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors self-start sm:self-auto text-[#6D22B5] hover:text-[#5C1C9A]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Spoken English Programs</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: HERO */}
      {/* ========================================================================= */}
      {isLittleHearts ? (
        <LittleMirrorsShowcase
          category={{
            ...category,
            title: 'Little Hearts',
            slug: 'little-hearts'
          }}
          onEnquire={handleEnquire}
        />
      ) : isLittleMirrors ? (
        <LittleMirrorsShowcase category={category} onEnquire={handleEnquire} />
      ) : isCorporateEnglish ? (
        <CorporateEnglishShowcase
          category={category}
          course={dbCategory as any}
          onEnquire={handleEnquire}
        />
      ) : isExecutiveInterview ? (
        <ExecutiveInterviewShowcase
          category={category}
          course={dbCategory as any}
          onEnquire={handleEnquire}
        />
      ) : isIeltsIntensive ? (
        <IeltsIntensiveShowcase
          category={category}
          course={dbCategory as any}
          onEnquire={handleEnquire}
        />
      ) : is1to1Mastery ? (
        <section className="relative overflow-hidden py-8 sm:py-14 border-b border-slate-100 bg-white text-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
            {/* Header Block: Supporting text, Main Heading, Description */}
            <div className="text-center max-w-3xl mx-auto space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F3FF] border border-[#E5D5FF] mb-2">
                <img
                  src="/englishclass.png"
                  alt="English Mirror"
                  className="w-4 h-4 object-contain rounded bg-purple-100 p-0.5"
                />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6D22B5]">
                  English Mirror Partner Track
                </span>
                <span className="text-slate-300 select-none">&bull;</span>
                <span className="text-[10px] font-semibold text-slate-600">
                  Spoken English
                </span>
              </div>

              {category.supportingText && (
                <div>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3FF] border border-[#E5D5FF] text-[#6D22B5] text-xs font-semibold tracking-wide shadow-2xs">
                    {category.supportingText}
                  </span>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[#202020] tracking-tight leading-tight">
                {category.title}
              </h1>

              <p className="text-[#555555] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
                {category.description}
              </p>
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {category.features.slice(0, 4).map((feature, idx) => {
                const featNum = feature.featureNumber || `0${idx + 1}`;
                return (
                  <div
                    key={feature.id || idx}
                    className="rounded-2xl bg-[#F7F3FF] border border-[#E5D5FF] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#6D22B5]/50 hover:shadow-sm transition-all duration-300 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E5D5FF] text-[#6D22B5] text-xs font-mono font-extrabold shadow-2xs tracking-wider">
                        FEATURE {featNum}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-base sm:text-lg font-display font-bold text-[#252525] leading-snug">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Closing Highlight in Purple, Bold Italic Typography */}
            <div className="pt-2 text-center">
              <p className="text-base sm:text-lg md:text-xl font-bold italic text-[#8B35D6] tracking-wide">
                "{category.highlightText || 'Mirror your success with fluent English'}"
              </p>
            </div>

            {/* Call to Action Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleEnquire}
                className="px-8 py-3.5 rounded-xl bg-[#6D22B5] hover:bg-[#5C1C9A] text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all duration-200 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Enquire for 1:1 Communicative English Mastery</span>
              </button>
            </div>
          </div>
        </section>
      ) : isFluencyBuilder ? (
        <section className="relative overflow-hidden py-8 sm:py-14 border-b border-slate-100 bg-white text-slate-900">
          {/* Subtle ambient background glow effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50/80 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Content Column matching reference image layout */}
              <div className="lg:col-span-7 space-y-5 text-left">
                {/* Partner Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 shadow-2xs">
                  <img
                    src="/englishclass.png"
                    alt="English Mirror"
                    className="w-4 h-4 object-contain rounded bg-purple-100 p-0.5"
                  />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED]">
                    English Mirror Partner Track
                  </span>
                  <span className="text-slate-300 select-none">&bull;</span>
                  <span className="text-[10px] font-semibold text-slate-600">
                    Spoken English
                  </span>
                </div>

                {/* 1. Course Title at the top */}
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[#111827] tracking-tight leading-tight">
                    {category.title}
                  </h1>
                </div>

                {/* 2. Purple TELEPHONIC SESSIONS badge beneath the title */}
                <div>
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#7C3AED] text-white text-xs font-mono font-extrabold tracking-wider uppercase shadow-xs">
                    TELEPHONIC SESSIONS
                  </span>
                </div>

                {/* 3. Description below the badge */}
                <p className="text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
                  {category.description}
                </p>

                {/* 4. Supporting text beneath the description */}
                {(category.supportingText || 'Voice Calls | Recorded Lessons | Daily Practice') && (
                  <div>
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#F5F0FF] border border-[#E5E7EB] text-[#374151] text-xs font-medium tracking-wide shadow-2xs">
                      {category.supportingText || 'Voice Calls | Recorded Lessons | Daily Practice'}
                    </span>
                  </div>
                )}

                {/* 5. Four vertically stacked feature cards */}
                <div className="space-y-3.5 pt-1">
                  {[
                    {
                      featNum: '01',
                      title: '25 Phone Call Sessions',
                      description: 'Daily 15-minute 1-1 voice calls with an expert trainer.'
                    },
                    {
                      featNum: '02',
                      title: '25 Grammar + 25 Vocabulary',
                      description: 'Recorded HD classes with lifetime access.'
                    },
                    {
                      featNum: '03',
                      title: '50 E-PDFs + Daily JAM Updates',
                      description: 'Educational resources with WhatsApp doubt support.'
                    },
                    {
                      featNum: '04',
                      title: 'Certification',
                      description: 'Earned for course tenures of 3 months and above.'
                    }
                  ].map((feat) => (
                    <div
                      key={feat.featNum}
                      className="rounded-2xl bg-[#F5F0FF] border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-[#7C3AED]/40 hover:shadow-md transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#7C3AED] text-white text-[11px] font-mono font-extrabold tracking-wider shadow-2xs">
                            FEATURE {feat.featNum}
                          </span>
                          <h3 className="text-sm sm:text-base font-display font-bold text-[#111827]">
                            {feat.title}
                          </h3>
                        </div>
                        <p className="text-xs text-[#374151] leading-relaxed pl-0.5">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 6. Closing highlight beneath the feature cards */}
                <div className="pt-2 text-center sm:text-left">
                  <p className="text-base sm:text-lg font-bold italic text-[#7C3AED] tracking-wide">
                    "{category.highlightText || 'Mirror your success with fluent English'}"
                  </p>
                </div>

                {/* 7. TELEPHONIC LEARNING information card at the bottom */}
                <div className="rounded-2xl bg-[#F5F0FF] border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-left">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#7C3AED] block">
                      TELEPHONIC LEARNING
                    </span>
                    <p className="text-sm sm:text-base font-bold text-[#111827]">
                      Daily 1-1 voice calls + self-paced learning
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#7C3AED] text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
                    Included
                  </span>
                </div>

                {/* Hero Call to Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleEnquire}
                    className="px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all duration-200 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Enquire Now</span>
                  </button>
                </div>
              </div>

              {/* Right Poster Artwork Column - Preserving existing course image */}
              <div className="lg:col-span-5 sticky top-24">
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-[#E5E7EB] shadow-md group">
                  <img
                    src={category.image || DEFAULT_ENGLISH_FALLBACK_IMAGE}
                    alt={`${category.title} Reference Poster`}
                    className="w-full h-auto object-cover max-h-[500px] transition-transform duration-500 group-hover:scale-102"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== DEFAULT_ENGLISH_FALLBACK_IMAGE) {
                        target.src = DEFAULT_ENGLISH_FALLBACK_IMAGE;
                      }
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-[#7C3AED] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                      Official Track
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/80 inline-block shadow-sm">
                      {category.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden py-8 sm:py-14 border-b border-purple-100 bg-gradient-to-b from-purple-50/80 via-white to-[#FDFBF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Content Column */}
              <div className="lg:col-span-7 space-y-5 text-left">
                {/* Partner Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200">
                  <img
                    src="/englishclass.png"
                    alt="English Mirror"
                    className="w-4 h-4 object-contain rounded bg-[#0A0D18] p-0.5"
                  />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6D22B5]">
                    English Mirror Partner Track
                  </span>
                  <span className="text-slate-300 select-none">&bull;</span>
                  <span className="text-[10px] font-semibold text-slate-600">
                    Spoken English
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-950 tracking-tight leading-tight">
                    {category.title}
                  </h1>
                  {category.subtitle && (
                    <p className="text-base sm:text-lg font-semibold text-[#6D22B5] mt-1.5">
                      {category.subtitle}
                    </p>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {category.description}
                </p>

                {/* Supporting Text Tagline */}
                {category.supportingText && (
                  <div className="inline-block px-3 py-1 rounded-lg bg-purple-50 border border-purple-200/80 text-xs font-bold text-purple-900">
                    {category.supportingText}
                  </div>
                )}

                {/* Additional Description for specific tracks */}
                {category.additionalDescription && (
                  <p className="text-xs sm:text-sm text-slate-600 italic bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                    {category.additionalDescription}
                  </p>
                )}

                {/* Visually Prominent Learning Highlights */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Learning Highlights:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {category.features.slice(0, 4).map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-purple-100 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#6D22B5] flex-shrink-0" />
                        <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {f.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hero Call to Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleEnquire}
                    className="px-6 py-3 rounded-xl bg-[#6D22B5] hover:bg-[#5C1C9A] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-900/20 transition-all duration-200 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Enquire Now</span>
                  </button>

                  <div className="text-xs text-slate-500 font-medium">
                    {category.highlightText}
                  </div>
                </div>
              </div>

              {/* Right Poster Artwork Column */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden bg-white border-2 border-purple-200 shadow-xl group">
                  <img
                    src={category.image || DEFAULT_ENGLISH_FALLBACK_IMAGE}
                    alt={`${category.title} Reference Poster`}
                    className="w-full h-auto object-cover max-h-[500px] transition-transform duration-500 group-hover:scale-102"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== DEFAULT_ENGLISH_FALLBACK_IMAGE) {
                        target.src = DEFAULT_ENGLISH_FALLBACK_IMAGE;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D18]/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-[#6D22B5] text-white text-[10px] font-extrabold uppercase tracking-wider">
                      Official Track
                    </span>
                    <p className="text-xs font-bold text-white mt-1">
                      {category.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isCorporateEnglish && !isExecutiveInterview && !isIeltsIntensive && (
        <>
          {/* ========================================================================= */}
          {/* SECTION 2 & 3: KEY HIGHLIGHTS & WHAT YOU WILL GET (for non-Little Mirrors & non-Little Hearts) */}
          {/* ========================================================================= */}
          {!isLittleMirrors && !isLittleHearts && (
            <>
              <section className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D22B5] block mb-1">
                  Overview At A Glance
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">
                  Key Highlights
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Important numerical highlights and course parameters from the verified curriculum.
                </p>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 ${category.keyHighlights.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 sm:gap-6`}>
                {category.keyHighlights.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -3 }}
                    className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100/90 text-left space-y-1.5 shadow-2xs"
                  >
                    <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#6D22B5]">
                      {stat.value}
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div className="text-[11px] text-slate-500 leading-tight">
                        {stat.description}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className={`py-12 sm:py-16 ${is1to1Mastery ? 'bg-white' : 'bg-[#FDFBF9]'} border-b border-slate-200/80`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-left max-w-2xl mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D22B5] block mb-1">
                  Curriculum Components
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">
                  What You Will Get
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Complete list of features and learning modules included in {category.title}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {category.features.map((feature) => (
                  <div
                    key={feature.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#6D22B5] transition-colors flex flex-col justify-between text-left space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#6D22B5] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {feature.id}
                      </div>
                      <h3 className="font-display font-bold text-sm text-slate-900 line-clamp-2">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: COURSE DETAILS */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D22B5] block">
                Session Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">
                Course Details &amp; Structure
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every session is structured to give you maximum conversational output, instant constructive feedback, and reliable habit formation.
              </p>

              {/* Learning Format Card */}
              {category.learningFormat && (
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6D22B5]">
                    Learning Format
                  </span>
                  <p className="text-xs font-semibold text-purple-950">
                    {category.learningFormat}
                  </p>
                </div>
              )}

              {/* Mentor Guarantee */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Mentor Standard
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  Certified English Mirror language experts trained in patient, individualized coaching.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3 text-left">
              <div className={`${is1to1Mastery ? 'bg-[#F7F3FF] border border-[#E5D5FF]' : 'bg-[#FDFBF9] border border-slate-200'} rounded-2xl p-6 space-y-3`}>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Detailed Inclusions
                </h3>
                <ul className="space-y-2.5">
                  {category.courseDetails.detailsList.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-[#6D22B5] text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-bold">
                        ✓
                      </div>
                      <span className="font-medium">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: LEARNING BENEFITS */}
      {/* ========================================================================= */}
      <section className={`py-12 sm:py-16 ${is1to1Mastery ? 'bg-white' : 'bg-[#FDFBF9]'} border-b border-slate-200/80`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D22B5] block mb-1">
              Measurable Outcomes
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">
              Learning Benefits &amp; Outcomes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              How this program will transform your English speaking confidence and career opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {category.learningBenefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3 text-left"
              >
                <CheckCircle2 className="w-5 h-5 text-[#6D22B5] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-800 font-medium leading-relaxed">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: BATCH TIMINGS */}
      {/* ========================================================================= */}
      {category.batchTimings && category.batchTimings.hasBatches && (
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D22B5] block mb-1">
                Flexible Scheduling
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">
                Batch Timings &amp; Schedules
              </h2>
              {category.batchTimings.note && (
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {category.batchTimings.note}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {category.batchTimings.batches.map((batch, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-purple-50/50 border-2 border-purple-200/80 text-left space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#6D22B5] text-white text-[10px] font-extrabold uppercase tracking-wider">
                      {batch.name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Flexible Timing
                    </span>
                  </div>
                  <div className="pt-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#6D22B5]" />
                      <span>{batch.days}</span>
                    </div>
                    {batch.timing && (
                      <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{batch.timing}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: ENQUIRY */}
      {/* ========================================================================= */}
      <section className={`py-14 sm:py-20 ${is1to1Mastery ? 'bg-white border-t border-slate-100 text-slate-900' : 'bg-gradient-to-r from-[#0A0D18] via-[#1E1138] to-[#0A0D18] text-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className={`inline-flex items-center px-3 py-1 rounded-full ${is1to1Mastery ? 'bg-[#F7F3FF] border border-[#E5D5FF] text-[#6D22B5]' : 'bg-[#6D22B5]/40 border border-purple-400/40 text-purple-200'} text-[11px] font-bold uppercase tracking-wider`}>
            <span>Admission &amp; Batch Consultation</span>
          </div>

          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight ${is1to1Mastery ? 'text-[#202020]' : 'text-white'}`}>
            Ready to Begin {category.title}?
          </h2>

          <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${is1to1Mastery ? 'text-[#555555]' : 'text-slate-300'}`}>
            Submit your enquiry today to discuss batch availability, diagnostic assessments, and mentor matching. Our English Mirror communication advisor will contact you directly via WhatsApp or phone call.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleEnquire}
              className="px-8 py-3.5 rounded-xl bg-[#6D22B5] hover:bg-[#5C1C9A] text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all duration-200 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Enquire for {category.title}</span>
            </button>

            <Link
              to="/spoken-tutorial"
              className={`px-6 py-3.5 rounded-xl border font-bold text-sm transition-all duration-200 ${is1to1Mastery ? 'border-slate-200 hover:bg-slate-50 text-slate-700' : 'border-white/20 hover:bg-white/10 text-white'}`}
            >
              Explore Other Categories
            </Link>
          </div>

          <p className={`text-[11px] pt-2 ${is1to1Mastery ? 'text-slate-500' : 'text-slate-400'}`}>
            No upfront payment required &bull; Dedicated 1:1 Trainer &bull; Flexible Batches
          </p>
        </div>
      </section>
        </>
      )}
    </div>
  );
};

export default SubCategoryDetail;
