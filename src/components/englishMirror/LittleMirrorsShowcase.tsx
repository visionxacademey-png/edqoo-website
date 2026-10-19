import React from 'react';
import {
  PhoneCall,
  Star,
  Smile,
  Video,
  MessageCircle,
  Gamepad2,
  BookOpen,
  TrendingUp,
  Heart
} from 'lucide-react';
import type { Course, CourseFeatureItem } from '../../types';
import type { SpokenTutorialSubCategory } from '../../pages/SpokenTutorial/data';

interface LittleMirrorsShowcaseProps {
  course?: Course | null;
  category?: SpokenTutorialSubCategory | null;
  onEnquire?: () => void;
  className?: string;
}

export const LITTLE_MIRRORS_DEFAULT_HIGHLIGHTS = [
  { value: '15', label: 'Live 1:1 sessions', bg: 'bg-[#FFE4EC]', border: 'border-[#FFD0DE]', text: 'text-[#E11D48]' },
  { value: '30', label: 'Mins per session', bg: 'bg-[#FFF2B3]', border: 'border-[#FFE885]', text: 'text-[#B45309]' },
  { value: 'Class 3–7 & 8–12', label: 'Eligible classes', bg: 'bg-[#EEE5FF]', border: 'border-[#DDD0FF]', text: 'text-[#8039E8]' }
];

export const LITTLE_MIRRORS_DEFAULT_FEATURES: CourseFeatureItem[] = [
  {
    id: 1,
    featureNumber: '01',
    title: '1:1 Live Classes',
    description: 'Personalised attention, no crowd and no comparison.'
  },
  {
    id: 2,
    featureNumber: '02',
    title: 'Speaking Practice',
    description: 'Builds the confidence to speak up in every session.'
  },
  {
    id: 3,
    featureNumber: '03',
    title: 'Fun & Interactive',
    description: 'Engaging activities, games and role play.'
  },
  {
    id: 4,
    featureNumber: '04',
    title: 'Customised Curriculum',
    description: "Paced to your child's level."
  },
  {
    id: 5,
    featureNumber: '05',
    title: 'Track Progress',
    description: 'Regular feedback, worksheets and an assessment.'
  },
  {
    id: 6,
    featureNumber: '06',
    title: 'Confident Kids',
    description: 'Better communication for school and life.'
  }
];

const FEATURE_THEME_CONFIG = [
  {
    bg: 'bg-[#FFE4EC]',
    border: 'border-[#FFD0DE]',
    badgeColor: 'text-[#E11D48]',
    Icon: Video
  },
  {
    bg: 'bg-[#FFF2B3]',
    border: 'border-[#FFE885]',
    badgeColor: 'text-[#B45309]',
    Icon: MessageCircle
  },
  {
    bg: 'bg-[#DFF3FF]',
    border: 'border-[#BAE6FD]',
    badgeColor: 'text-[#0284C7]',
    Icon: Gamepad2
  },
  {
    bg: 'bg-[#EEE5FF]',
    border: 'border-[#DDD0FF]',
    badgeColor: 'text-[#8039E8]',
    Icon: BookOpen
  },
  {
    bg: 'bg-[#DDF8E8]',
    border: 'border-[#BBF2CE]',
    badgeColor: 'text-[#16A34A]',
    Icon: TrendingUp
  },
  {
    bg: 'bg-[#FFE4EC]',
    border: 'border-[#FFD0DE]',
    badgeColor: 'text-[#E11D48]',
    Icon: Heart
  }
];

/**
 * Playful, child-friendly multicolored typography for Little Hearts course title
 * Inspired by the "Early Learn" reference image with thick, rounded letters
 */
export const LittleHeartsTitle: React.FC = () => {
  return (
    <h1
      className="font-kids-heading font-extrabold tracking-wide leading-tight sm:leading-[1.12] text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] drop-shadow-[0_2px_0px_rgba(0,0,0,0.03)]"
      style={{ fontFamily: "'Fredoka', 'Baloo 2', 'Nunito', system-ui, sans-serif" }}
      aria-label="Little Hearts"
    >
      <span aria-hidden="true" className="inline-flex flex-wrap items-center gap-x-3.5 sm:gap-x-4 gap-y-1">
        {/* Word 1: Little (Sky blue, Purple, Pink, Yellow) */}
        <span className="inline-flex whitespace-nowrap">
          <span className="text-[#0284C7] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">L</span>
          <span className="text-[#7C3AED] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">i</span>
          <span className="text-[#DB2777] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">t</span>
          <span className="text-[#D97706] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">t</span>
          <span className="text-[#0284C7] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">l</span>
          <span className="text-[#DB2777] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">e</span>
        </span>

        {/* Word 2: Hearts (Purple, Green, Orange, Sky Blue, Yellow, Pink) */}
        <span className="inline-flex whitespace-nowrap">
          <span className="text-[#7C3AED] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">H</span>
          <span className="text-[#16A34A] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">e</span>
          <span className="text-[#EA580C] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">a</span>
          <span className="text-[#0284C7] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">r</span>
          <span className="text-[#D97706] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">t</span>
          <span className="text-[#DB2777] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">s</span>
        </span>
      </span>
      <span className="sr-only">Little Hearts</span>
    </h1>
  );
};

/**
 * Playful, child-friendly multicolored typography for Little Mirrors course title
 * Inspired by the "Early Learn" reference image with thick, rounded letters
 */
export const LittleMirrorsTitle: React.FC = () => {
  return (
    <h1
      className="font-kids-heading font-extrabold tracking-wide leading-tight sm:leading-[1.12] text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] drop-shadow-[0_2px_0px_rgba(0,0,0,0.03)]"
      style={{ fontFamily: "'Fredoka', 'Baloo 2', 'Nunito', system-ui, sans-serif" }}
      aria-label="Little Mirrors"
    >
      <span aria-hidden="true" className="inline-flex flex-wrap items-center gap-x-3.5 sm:gap-x-4 gap-y-1">
        {/* Word 1: Little (Sky blue, Purple, Pink, Yellow) */}
        <span className="inline-flex whitespace-nowrap">
          <span className="text-[#0284C7] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">L</span>
          <span className="text-[#7C3AED] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">i</span>
          <span className="text-[#DB2777] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">t</span>
          <span className="text-[#D97706] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">t</span>
          <span className="text-[#0284C7] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">l</span>
          <span className="text-[#DB2777] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">e</span>
        </span>

        {/* Word 2: Mirrors (Purple, Green, Orange, Sky Blue, Pink, Yellow, Purple) */}
        <span className="inline-flex whitespace-nowrap">
          <span className="text-[#7C3AED] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">M</span>
          <span className="text-[#16A34A] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">i</span>
          <span className="text-[#EA580C] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">r</span>
          <span className="text-[#0284C7] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">r</span>
          <span className="text-[#DB2777] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">o</span>
          <span className="text-[#D97706] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">r</span>
          <span className="text-[#7C3AED] inline-block transition-transform hover:-translate-y-1 duration-200 select-none">s</span>
        </span>
      </span>
      <span className="sr-only">Little Mirrors</span>
    </h1>
  );
};

export const LittleMirrorsShowcase: React.FC<LittleMirrorsShowcaseProps> = ({
  course,
  category,
  onEnquire,
  className = ''
}) => {
  const title = category?.title || course?.title || 'Little Mirrors';
  const subtitle = category?.subtitle || course?.supportingText || '1:1 English Fluency for Kids';
  const description =
    category?.description ||
    course?.description ||
    'Fun learning today, confident communicators tomorrow.';
  const whyDescription =
    category?.supportingText && category.supportingText !== subtitle
      ? category.supportingText
      : 'Confidence first, fluency next — every child gets a trainer entirely to themselves.';
  const closingDescription =
    category?.highlightText ||
    course?.highlightText ||
    'Each 30-minute class blends a simple concept, a fun speaking activity and a short worksheet.';

  // Image resolution: preserve verified course image
  const heroImage =
    category?.image ||
    course?.image ||
    course?.heroImage ||
    '/images/spoken-tutorial/little-mirrors.jpg';

  // Extract highlights
  const highlights = LITTLE_MIRRORS_DEFAULT_HIGHLIGHTS.map((item, idx) => {
    const rawHighlights = category?.keyHighlights || course?.programHighlights;
    if (Array.isArray(rawHighlights) && rawHighlights[idx]) {
      const h = rawHighlights[idx];
      return {
        ...item,
        value: typeof h === 'object' ? h.value || item.value : String(h),
        label: typeof h === 'object' ? h.label || item.label : item.label
      };
    }
    return item;
  });

  // Extract 6 features
  const featuresSource = category?.features || course?.features;
  const features: CourseFeatureItem[] =
    Array.isArray(featuresSource) && featuresSource.length > 0
      ? featuresSource.slice(0, 6).map((f: any, idx: number) => {
          if (typeof f === 'object' && f !== null && 'title' in f) {
            return {
              id: f.id || idx + 1,
              featureNumber: f.featureNumber || `0${idx + 1}`,
              title: f.title,
              description: f.description || LITTLE_MIRRORS_DEFAULT_FEATURES[idx]?.description || ''
            };
          }
          return LITTLE_MIRRORS_DEFAULT_FEATURES[idx] || {
            id: idx + 1,
            featureNumber: `0${idx + 1}`,
            title: String(f),
            description: ''
          };
        })
      : LITTLE_MIRRORS_DEFAULT_FEATURES;

  return (
    <div className={`space-y-0 text-left bg-white text-[#29234A] little-mirrors-scope font-kids-body ${className}`}>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Cheerful pastel palette with gentle decorations */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden py-10 sm:py-16 bg-gradient-to-b from-[#EEE5FF]/50 via-[#FFE4EC]/35 to-white border-b border-purple-100/70">
        {/* Playful pastel floating shapes */}
        <div className="absolute top-6 left-8 w-28 h-28 rounded-full bg-[#FFE4EC]/70 blur-2xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-36 h-36 rounded-full bg-[#FFF2B3]/60 blur-2xl pointer-events-none" />
        <div className="absolute bottom-6 right-8 w-40 h-40 rounded-full bg-[#DFF3FF]/60 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-[#DDF8E8]/60 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Cheerful English Mirror Young Learners pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#DDD0FF] shadow-xs">
                <img
                  src="/englishclass.png"
                  alt="English Mirror"
                  className="w-4 h-4 object-contain rounded bg-purple-50 p-0.5"
                />
                <span className="text-[11px] font-kids-heading font-bold uppercase tracking-wider text-[#8039E8]">
                  English Mirror
                </span>
                <span className="text-purple-300 select-none">&bull;</span>
                <span className="text-[11px] font-kids-heading font-bold text-[#F472B6]">
                  {title.trim().toLowerCase() === 'little hearts' ? 'Young Learners (Class 3–7)' : 'Young Learners (Class 3–7 & 8–12)'}
                </span>
              </div>

              {/* Course Title Heading: Multicolored for Little Mirrors & Little Hearts */}
              <div>
                {title.trim().toLowerCase() === 'little hearts' ? (
                  <LittleHeartsTitle />
                ) : title.trim().toLowerCase() === 'little mirrors' ? (
                  <LittleMirrorsTitle />
                ) : (
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-kids-heading font-bold text-[#8039E8] tracking-tight leading-tight">
                    {title}
                  </h1>
                )}
              </div>

              {/* Highlight Banner: Rounded Pastel Yellow */}
              <div>
                <span className="inline-flex items-center gap-2 bg-[#FFF2B3] text-[#29234A] px-4 py-2 rounded-2xl font-kids-heading font-bold text-sm sm:text-base md:text-lg shadow-xs border border-[#FFE885]">
                  <Star className="w-4 h-4 text-[#D97706] fill-[#D97706]" />
                  <span>{subtitle}</span>
                  <Smile className="w-4 h-4 text-[#8039E8]" />
                </span>
              </div>

              {/* Cheerful Description */}
              <p className="text-base sm:text-lg text-[#374151] font-kids-body font-medium leading-relaxed max-w-xl">
                {description}
              </p>

              {/* Three Highlight Cards (Light Pink, Pastel Yellow, Light Lavender) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
                {highlights.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl ${item.bg} ${item.border} border shadow-xs text-center sm:text-left flex flex-col justify-between space-y-1 hover:-translate-y-1 hover:shadow-md transition-all duration-300`}
                  >
                    <span className={`${item.value.length > 7 ? 'text-lg sm:text-xl lg:text-[1.6rem] leading-tight py-1' : 'text-3xl sm:text-4xl'} font-kids-heading font-bold ${item.text} block tracking-tight`}>
                      {item.value}
                    </span>
                    <span className="text-xs sm:text-sm font-kids-body font-semibold text-[#29234A] leading-snug block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Call to Action Button with friendly hover animation */}
              {onEnquire && (
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={onEnquire}
                    className="px-7 py-3.5 rounded-2xl bg-[#8039E8] hover:bg-[#6D28D9] text-white font-kids-heading font-bold text-sm shadow-md shadow-purple-500/25 transition-all duration-200 hover:scale-102 active:scale-95 inline-flex items-center gap-2.5 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Book a Free 1:1 Trial / Enquire</span>
                  </button>
                  <span className="text-xs text-[#29234A] font-kids-body font-semibold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#F472B6] fill-[#F472B6]" />
                    <span>Dedicated 1:1 trainer for your child</span>
                  </span>
                </div>
              )}
            </div>

            {/* Right Course Image Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-white border-2 border-white shadow-xl shadow-purple-900/10 group">
                <img
                  src={heroImage}
                  alt={title}
                  className="w-full h-72 sm:h-96 lg:h-[420px] object-cover group-hover:scale-102 transition-transform duration-500"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallbackUrl = '/images/spoken-tutorial/little-mirrors.jpg';
                    if (target.src !== fallbackUrl) {
                      target.src = fallbackUrl;
                    }
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-[#8039E8] text-white text-xs font-kids-heading font-bold uppercase tracking-wider shadow-sm inline-flex items-center">
                    <span>1:1 Kids Mentorship</span>
                  </span>
                  <p className="text-xs font-kids-body font-bold text-[#29234A] mt-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-purple-100 shadow-sm inline-block">
                    {subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. "WHY LITTLE MIRRORS?" SECTION: Six Cheerful Pastel Cards */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#EEE5FF] text-[#8039E8] text-xs font-kids-heading font-bold tracking-wider uppercase mb-1">
              <span>Personalised Early Learning</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-kids-heading font-bold text-[#29234A] tracking-tight">
              {title.trim().toLowerCase() === 'little hearts' ? 'Why Little Hearts?' : 'Why Little Mirrors?'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-kids-body leading-relaxed font-normal">
              {whyDescription}
            </p>
          </div>

          {/* Six Pastel Feature Cards Grid (3 cols desktop, 2 tablet, 1 mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.slice(0, 6).map((feat, idx) => {
              const featNum = feat.featureNumber || `0${idx + 1}`;
              const theme = FEATURE_THEME_CONFIG[idx] || FEATURE_THEME_CONFIG[0];
              const { bg, border, badgeColor, Icon } = theme;

              return (
                <div
                  key={feat.id || idx}
                  className={`rounded-2xl ${bg} ${border} border p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/90 text-[#29234A] text-[11px] font-kids-heading font-bold shadow-2xs tracking-wider">
                      FEATURE {featNum}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white shadow-2xs flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-4 h-4 ${badgeColor}`} />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-base sm:text-lg font-kids-heading font-bold text-[#29234A] leading-snug">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#374151] font-kids-body font-medium leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Closing Description Strip: Subtle pastel yellow rounded strip */}
          <div className="pt-4 max-w-3xl mx-auto text-center">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF2B3]/90 border border-[#FFE885] shadow-xs">
              <p className="text-sm sm:text-base text-[#29234A] font-kids-body font-semibold leading-relaxed text-center">
                <span>"{closingDescription}"</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LittleMirrorsShowcase;
