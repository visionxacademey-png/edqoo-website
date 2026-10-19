import React from 'react';
import { PhoneCall } from 'lucide-react';
import type { Course, CourseFeatureItem } from '../../types';
import type { SpokenTutorialSubCategory } from '../../pages/SpokenTutorial/data';

interface CorporateEnglishShowcaseProps {
  course?: Course | null;
  category?: SpokenTutorialSubCategory | any | null;
  onEnquire?: () => void;
  className?: string;
}

export const CORPORATE_ENGLISH_DEFAULT_FEATURES: CourseFeatureItem[] = [
  {
    id: 1,
    featureNumber: '01',
    title: '15 Live 1:1 Google Meet Sessions',
    description: '30 min individual practice with an expert.'
  },
  {
    id: 2,
    featureNumber: '02',
    title: '15 HD Vocabulary Classes',
    description: 'Lifetime premium access.'
  },
  {
    id: 3,
    featureNumber: '03',
    title: '100+ Vocabulary Words',
    description: 'Intermediate to advanced level.'
  },
  {
    id: 4,
    featureNumber: '04',
    title: '15 E-Books + WhatsApp Support',
    description: 'Doubt clarification & JAM activities.'
  }
];

export const CorporateEnglishShowcase: React.FC<CorporateEnglishShowcaseProps> = ({
  course,
  category,
  onEnquire,
  className = ''
}) => {
  const title = category?.title || category?.name || course?.title || 'Corporate English Fluency Builder';
  const description = category?.description || course?.shortDescription || course?.description || 'Your Complete Path to Confident English Communication';
  const supportingText = category?.supportingText || course?.supportingText || 'Live Coaching | Video Lessons | Daily Practice';
  const closingHighlight = category?.highlightText || course?.highlightText || 'Mirror your success with fluent English';
  const learningFormat = category?.learningFormat || category?.learning_format || 'Live 1:1 coaching + self-paced learning';
  const durationDetail = '1 Month \u2022 30 Minutes per Live Session';

  // Resolved image - preserving existing assigned course image
  const heroImage =
    category?.hero_image ||
    category?.heroImage ||
    category?.image ||
    course?.image ||
    course?.heroImage ||
    '/images/spoken-tutorial/corporate-english.jpg';

  // Extract 4 features (from DB course/category if available, fallback to defaults)
  const rawFeatures = category?.features || course?.features;
  const features: CourseFeatureItem[] = Array.isArray(rawFeatures) && rawFeatures.length > 0
    ? rawFeatures.slice(0, 4).map((f: any, idx: number) => {
        if (typeof f === 'object' && f !== null && 'title' in f) {
          return {
            id: f.id || idx + 1,
            featureNumber: f.featureNumber || `0${idx + 1}`,
            title: f.title,
            description: f.description || CORPORATE_ENGLISH_DEFAULT_FEATURES[idx]?.description || ''
          };
        }
        return CORPORATE_ENGLISH_DEFAULT_FEATURES[idx] || {
          id: idx + 1,
          featureNumber: `0${idx + 1}`,
          title: String(f),
          description: ''
        };
      })
    : CORPORATE_ENGLISH_DEFAULT_FEATURES;

  return (
    <div className={`bg-white text-slate-900 selection:bg-[#F1E8FA] selection:text-[#6D22B5] relative overflow-hidden text-left ${className}`}>
      {/* Subtle ambient lavender wash */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-slate-50/80 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION AND IMAGE */}
        {/* Large, professional hero image with clean light border, blending with white background */}
        {/* ========================================================================= */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-[#E5E7EB] shadow-md group">
          <img
            src={heroImage}
            alt={title}
            className="w-full h-64 sm:h-80 md:h-[420px] lg:h-[480px] object-cover object-center transition-transform duration-700 group-hover:scale-101"
            loading="eager"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== '/images/spoken-tutorial/corporate-english.jpg') {
                target.src = '/images/spoken-tutorial/corporate-english.jpg';
              }
            }}
          />

          {/* Top English Mirror Branding Badge with clean light glassmorphism */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md">
              <img
                src="/englishclass.png"
                alt="English Mirror"
                className="w-4 h-4 object-contain rounded bg-purple-50 p-0.5"
              />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C3AED]">
                English Mirror
              </span>
              <span className="text-slate-300 select-none">&bull;</span>
              <span className="text-[11px] font-semibold text-slate-700">
                Corporate Track
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. COURSE TITLE AND DESCRIPTION & 3. SUPPORTING TEXT */}
        {/* Dark navy headings, dark grey body, readable secondary descriptions */}
        {/* ========================================================================= */}
        <div className="space-y-4 max-w-4xl text-left">
          {/* Course Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[#111827] tracking-tight leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-[#374151] leading-relaxed font-normal">
            {description}
          </p>

          {/* Supporting Text */}
          {supportingText && (
            <div className="pt-1">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#F5F0FF] border border-[#E5E7EB] text-[#374151] text-xs sm:text-sm font-medium tracking-wide shadow-2xs">
                {supportingText}
              </span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. FOUR NUMBERED FEATURE CARDS (Two-column grid on desktop) */}
        {/* Background: light lavender (#F5F0FF), Border: #E5E7EB, Dark navy heading, Dark grey description */}
        {/* Purple numbered badges with white numbers */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
          {features.slice(0, 4).map((feature, idx) => {
            const featNum = feature.featureNumber || `0${idx + 1}`;
            return (
              <div
                key={feature.id || featNum}
                className="rounded-2xl bg-[#F5F0FF] border border-[#E5E7EB] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-[#7C3AED]/40 hover:shadow-md transition-all duration-300 text-left"
              >
                {/* Purple numbered badge with white text */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-[#7C3AED] text-white text-xs font-mono font-extrabold shadow-2xs tracking-wider">
                    FEATURE {featNum}
                  </span>
                </div>

                {/* Dark navy feature title and dark grey description */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base sm:text-lg font-display font-bold text-[#111827] leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#374151] leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 4. CLOSING HIGHLIGHT */}
        {/* Bold italic typography in purple text (#7C3AED) on white background */}
        {/* ========================================================================= */}
        <div className="py-4 sm:py-6 text-center">
          <p className="text-base sm:text-lg md:text-xl font-bold italic text-[#7C3AED] tracking-wide">
            &ldquo;{closingHighlight}&rdquo;
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 5. BLENDED LEARNING SECTION */}
        {/* Background: light lavender (#F5F0FF), Border: subtle light grey (#E5E7EB) */}
        {/* Category label: purple (#7C3AED), Heading: dark navy (#111827), Supporting text: dark grey (#374151) */}
        {/* ========================================================================= */}
        <div className="rounded-2xl bg-[#F5F0FF] border border-[#E5E7EB] p-5 sm:p-7 shadow-xs w-full flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-left">
          <div className="space-y-2 flex-1">
            {/* Category label */}
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#7C3AED] block">
              BLENDED LEARNING
            </span>
            {/* Main description */}
            <h4 className="text-lg sm:text-xl font-display font-bold text-[#111827] leading-snug">
              {learningFormat}
            </h4>
            {/* Additional details */}
            <p className="text-xs sm:text-sm text-[#374151] font-medium">
              {durationDetail}
            </p>
          </div>

          {/* Action button preserving enquiry functionality */}
          {onEnquire && (
            <div className="flex-shrink-0 self-start md:self-center pt-1 md:pt-0">
              <button
                type="button"
                onClick={onEnquire}
                className="px-6 py-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all duration-200 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Enquire Now</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CorporateEnglishShowcase;
