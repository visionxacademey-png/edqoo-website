import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface LanguageCourseContainer {
  id: string;
  number: string;
  badge: string;
  title: string;
  subtitle?: string;
  nativeScript: string;
  fontFamily: string;
  directionIndicator: string;
  description: string;
  image: string;
  fallbackImage: string;
}

export const LANGUAGE_COURSE_CONTAINERS: LanguageCourseContainer[] = [
  {
    id: 'malayalam',
    number: '01',
    badge: 'MALAYALAM',
    title: 'മലയാളം → English',
    nativeScript: 'മലയാളം',
    fontFamily: "'Noto Sans Malayalam', 'Outfit', sans-serif",
    directionIndicator: 'മലയാളം → English',
    description: 'Learn to speak English confidently with explanations and guidance in Malayalam.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'hindi',
    number: '02',
    badge: 'HINDI',
    title: 'हिन्दी → English',
    nativeScript: 'हिन्दी',
    fontFamily: "'Noto Sans Devanagari', 'Outfit', sans-serif",
    directionIndicator: 'हिन्दी → English',
    description: 'Learn spoken English confidently with explanations and guidance in Hindi.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'tamil',
    number: '03',
    badge: 'TAMIL',
    title: 'தமிழ் → English',
    nativeScript: 'தமிழ்',
    fontFamily: "'Noto Sans Tamil', 'Outfit', sans-serif",
    directionIndicator: 'தமிழ் → English',
    description: 'Build English fluency step by step with clear explanations in Tamil.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'kannada',
    number: '04',
    badge: 'KANNADA',
    title: 'ಕನ್ನಡ → English',
    nativeScript: 'ಕನ್ನಡ',
    fontFamily: "'Noto Sans Kannada', 'Outfit', sans-serif",
    directionIndicator: 'ಕನ್ನಡ → English',
    description: 'Improve your English speaking skills through easy explanations in Kannada.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'telugu',
    number: '05',
    badge: 'TELUGU',
    title: 'తెలుగు → English',
    nativeScript: 'తెలుగు',
    fontFamily: "'Noto Sans Telugu', 'Outfit', sans-serif",
    directionIndicator: 'తెలుగు → English',
    description: 'Learn everyday English conversations with guidance in Telugu.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
  },
];

// Compatibility exports
export const CLASSIC_LANGUAGES = LANGUAGE_COURSE_CONTAINERS;
export const LANGUAGE_PANELS_DATA = LANGUAGE_COURSE_CONTAINERS;


export const LanguageCoursesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const handleCardClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const target =
      document.getElementById('specialized-fluency-categories') ||
      document.getElementById('fluency-categories');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#specialized-fluency-categories');
    }
  };

  return (
    <motion.section
      aria-label="Learn Spoken English in Your Language"
      initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: 'easeOut' as const }}
      className="bg-white pt-4 sm:pt-5 lg:pt-6 pb-16 sm:pb-20 lg:pb-24 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* 1. SECTION HEADING & INTRODUCTION (Clean, Modern, Centered Typography)    */}
        {/* ========================================================================= */}
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-[11px] font-bold text-[#6D22B5] uppercase tracking-widest mb-3.5 select-none">
            <span>Language-Based Learning</span>
          </div>

          {/* Section Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            Learn Spoken English{' '}
            <span className="text-[#6D22B5]">in Your Language</span>
          </h2>

          {/* Co-Branding Lockup: EDQOO × English Mirror */}
          <div className="mt-3.5 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50/60 border border-purple-100/80 text-xs sm:text-[13px] tracking-wide select-none">
              <span className="font-bold text-[#6D22B5]">EDQOO</span>
              <span className="text-slate-400 font-light select-none">×</span>
              <span className="font-semibold text-slate-800">English Mirror</span>
            </div>
          </div>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mt-3.5">
            Start speaking English with confidence. Learn step by step in the language you understand best.
          </p>

          {/* Subtle Purple Accent Line beneath Heading */}
          <div className="flex items-center justify-center gap-2 mt-4 mb-12 sm:mb-16 select-none" aria-hidden="true">
            <div className="w-12 h-1 bg-[#6D22B5] rounded-full" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. FIVE LANGUAGE CONTAINERS (Informational Display, Centered Layout)       */}
        {/* Desktop: 3 cards row 1 + 2 centered cards row 2                           */}
        {/* Tablet: 2 cards per row centered                                          */}
        {/* Mobile: 1 card per row centered                                           */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-6xl mx-auto">
          {LANGUAGE_COURSE_CONTAINERS.map((item) => {
            return (
              <motion.div
                key={item.id}
                whileHover={shouldReduceMotion ? {} : { y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' as const }}
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick();
                  }
                }}
                className="group relative cursor-pointer rounded-[22px] sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-purple-300 flex flex-col justify-between min-h-[390px] sm:min-h-[430px] w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] max-w-[380px] bg-slate-100 select-none"
              >
                {/* Full Bright Background Image - No dark tint, original vibrant colors */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== item.fallbackImage) {
                      target.src = item.fallbackImage;
                    }
                  }}
                />

                {/* Top Badges: Bright, clean frosted pills */}
                <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-800 text-xs font-semibold tracking-wide shadow-sm">
                    <span style={{ fontFamily: item.fontFamily }} className="text-[#6D22B5] font-bold">
                      {item.nativeScript}
                    </span>
                    <span className="text-slate-400 font-bold">→</span>
                    <span className="text-slate-900 font-bold">English</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-700 text-xs font-mono font-bold shadow-sm">
                    {item.number}
                  </span>
                </div>

                {/* Bottom Content Area: Clean Frosted Light Panel Inside Image */}
                <div className="relative z-10 p-3 sm:p-3.5 w-full">
                  <div className="bg-white/95 backdrop-blur-md rounded-[18px] sm:rounded-2xl p-4 sm:p-5 border border-white/80 shadow-md text-center flex flex-col items-center space-y-2 group-hover:border-purple-200 transition-colors">
                    {/* Language Identifier */}
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6D22B5] flex items-center justify-center gap-1.5">
                      <span>{item.badge}</span>
                      <span className="text-purple-300">&bull;</span>
                      <span style={{ fontFamily: item.fontFamily }}>{item.nativeScript}</span>
                    </div>

                    {/* Prominent Native-Language Heading in Charcoal with Arrow */}
                    <h3
                      style={{ fontFamily: item.fontFamily }}
                      className="text-xl sm:text-[23px] font-display font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#6D22B5] transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <span>{item.nativeScript}</span>
                      <span className="text-[#6D22B5] font-bold">→</span>
                      <span>English</span>
                    </h3>

                    {/* Short Description in Slate-600 */}
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal line-clamp-3">
                      {item.description}
                    </p>

                    {/* Subtle Purple Accent Line */}
                    <div className="pt-1">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-[#6D22B5] group-hover:w-14 transition-all duration-300 rounded-full mx-auto" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. SUBTLE FOOTNOTE                                                        */}
        {/* ========================================================================= */}
        <div className="mt-12 sm:mt-16 text-center select-none">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Structured bilingual instruction &bull; Dedicated 1:1 speaking focus &bull; Verifiable English Mirror Certification
          </p>
        </div>

      </div>
    </motion.section>
  );
};
