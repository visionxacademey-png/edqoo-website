import React from 'react';
import {
  CheckCircle2,
  Video,
  BookOpen,
  Target,
  Lightbulb,
  Award,
  Calendar,
  Clock,
  UserCheck,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Layers,
  PhoneCall
} from 'lucide-react';
import type { Course, CourseFeatureItem } from '../../types';
import type { SpokenTutorialSubCategory } from '../../pages/SpokenTutorial/data';

interface IeltsIntensiveShowcaseProps {
  course?: Course | null;
  category?: SpokenTutorialSubCategory | any | null;
  onEnquire?: () => void;
  className?: string;
}

export const IELTS_INTENSIVE_DEFAULT_FEATURES: CourseFeatureItem[] = [
  {
    id: 1,
    featureNumber: '01',
    title: '1:1 Live Sessions',
    description: 'Personalized coaching on Google Meet.'
  },
  {
    id: 2,
    featureNumber: '02',
    title: 'Complete IELTS Preparation',
    description: 'Speaking, Reading, Writing & Listening.'
  },
  {
    id: 3,
    featureNumber: '03',
    title: 'Deep Dive Assessment',
    description: 'Identify strengths and focus areas.'
  },
  {
    id: 4,
    featureNumber: '04',
    title: 'Targeted Practice',
    description: 'Strategies, tips and feedback.'
  },
  {
    id: 5,
    featureNumber: '05',
    title: 'Higher Band Score',
    description: 'Guidance to help you achieve your target score.'
  }
];

export const IELTS_COURSE_DETAILS_LIST = [
  {
    title: '15 Live 1:1 Google Meet Sessions',
    description: '30 minutes per session, focused on academic or general training needs.'
  },
  {
    title: 'Deep Dive Assessment',
    description: 'Assessment covering Speaking, Reading, Writing, and Listening.'
  }
];

export const IELTS_SUPPORTING_VISUAL_TAGS = [
  'Study',
  'Practice',
  'Get Your Dream Score!'
];

export const IELTS_BOTTOM_BENEFITS = [
  {
    title: 'Expert Guidance',
    description: 'Certified IELTS mentors dedicated exclusively to your progress',
    icon: UserCheck
  },
  {
    title: 'Personalized Feedback',
    description: 'Instant rubrics and line-by-line correction after every session',
    icon: MessageSquare
  },
  {
    title: 'Flexible Batches',
    description: 'Alternate-day schedules fitting academic or job commitments',
    icon: Calendar
  },
  {
    title: 'Track Your Progress',
    description: 'Diagnostic scoring across Speaking, Reading, Writing & Listening',
    icon: TrendingUp
  }
];

export const IeltsIntensiveShowcase: React.FC<IeltsIntensiveShowcaseProps> = ({
  course,
  category,
  onEnquire,
  className = ''
}) => {
  // Titles and Texts
  const subtitle = '1:1 Crash Training';
  const highlightText = category?.highlightText || course?.highlightText || 'Your Fast Track to a Higher Band Score';

  // Hero image (Preserve existing assigned course image)
  const heroImage =
    category?.hero_image ||
    category?.heroImage ||
    category?.image ||
    course?.image ||
    course?.heroImage ||
    '/images/spoken-tutorial/ielts-intensive.jpg';

  // Feature icons mapping for the 5 features
  const featureIcons = [Video, BookOpen, Target, Lightbulb, Award];

  // Extract features (from DB course/category if available, fallback to defaults)
  const rawFeatures = category?.features || course?.features;
  const features: CourseFeatureItem[] =
    Array.isArray(rawFeatures) && rawFeatures.length > 0
      ? rawFeatures.slice(0, 5).map((f: any, idx: number) => {
          if (typeof f === 'object' && f !== null && 'title' in f) {
            return {
              id: f.id || idx + 1,
              featureNumber: f.featureNumber || `0${idx + 1}`,
              title: f.title,
              description: f.description || IELTS_INTENSIVE_DEFAULT_FEATURES[idx]?.description || ''
            };
          }
          return IELTS_INTENSIVE_DEFAULT_FEATURES[idx] || {
            id: idx + 1,
            featureNumber: `0${idx + 1}`,
            title: String(f),
            description: ''
          };
        })
      : IELTS_INTENSIVE_DEFAULT_FEATURES;

  return (
    <div
      className={`bg-gradient-to-b from-[#FAF7FE] via-[#FFFFFF] to-[#FAF7FE] text-slate-900 selection:bg-[#E11D48] selection:text-white relative overflow-hidden text-left ${className}`}
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section aria-label="IELTS Hero" className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Top Branding & Subtitle Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* English Mirror Branding Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 shadow-xs">
                  <img
                    src="/englishclass.png"
                    alt="English Mirror"
                    className="w-4 h-4 object-contain rounded bg-[#0A0D18] p-0.5"
                  />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6D22B5]">
                    English Mirror Partner Track
                  </span>
                  <span className="text-purple-300 select-none">&bull;</span>
                  <span className="text-[11px] font-semibold text-slate-700">
                    Spoken English
                  </span>
                </div>

                {/* Subtitle Inside Yellow Rounded Badge: 1:1 Crash Training */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#FACC15] text-[#1E293B] border border-amber-400 font-extrabold text-xs tracking-wide shadow-xs">
                  <span>{subtitle}</span>
                </div>
              </div>

              {/* Main Heading: "IELTS" in Pink/Magenta, "Intensive" in Dark Navy */}
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-[1.1]">
                  <span className="text-[#E11D48] drop-shadow-xs">IELTS</span>{' '}
                  <span className="text-[#0B132B]">Intensive</span>
                </h1>
                {/* Highlight Text */}
                <p className="text-lg sm:text-xl font-bold text-[#6D22B5] mt-2.5">
                  {highlightText}
                </p>
              </div>

              {/* Supporting Visual Text: Study • Practice • Get Your Dream Score! */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {IELTS_SUPPORTING_VISUAL_TAGS.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-purple-200 text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E11D48]" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                Personalized 1:1 coaching on Google Meet designed to fast-track your band score. Comprehensive preparation across Speaking, Reading, Writing, and Listening with diagnostic error analysis.
              </p>

              {/* Hero CTA Button: Yellow pill with dark navy text and arrow icon */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onEnquire}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0B132B] font-display font-extrabold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <PhoneCall className="w-4 h-4 text-[#0B132B]" />
                  <span>Start Your IELTS Journey Today!</span>
                  <ArrowRight className="w-4 h-4 text-[#0B132B]" />
                </button>
              </div>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border-2 border-purple-200/80 shadow-2xl group">
                <img
                  src={heroImage}
                  alt="IELTS Intensive Candidate Preparation"
                  className="w-full h-72 sm:h-96 lg:h-[460px] object-cover object-center transition-transform duration-700 group-hover:scale-102"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== '/images/spoken-tutorial/ielts-intensive.jpg') {
                      target.src = '/images/spoken-tutorial/ielts-intensive.jpg';
                    }
                  }}
                />

                {/* Professional image overlay gradient at bottom to enhance readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/85 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Image Badges */}
                <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none flex items-end justify-between gap-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#E11D48] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      1:1 Live Coaching
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white mt-1 drop-shadow-sm">
                      Speaking &bull; Reading &bull; Writing &bull; Listening
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-300 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-md border border-amber-300/30">
                    Band 7+ Target
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. FIVE KEY FEATURE HIGHLIGHTS */}
        {/* ========================================================================= */}
        <section aria-label="Five Key Feature Highlights" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E11D48]">
              Targeted Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0B132B] tracking-tight">
              Five Key Feature Highlights
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Strategic one-on-one modules crafted to diagnose recurring errors and maximize your band score.
            </p>
          </div>

          {/* Desktop horizontal row / 5-column responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {features.map((feature, idx) => {
              const IconComponent = featureIcons[idx] || BookOpen;
              return (
                <div
                  key={feature.id || idx}
                  className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group text-left relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-[#E11D48] to-[#6D22B5] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-3">
                    {/* Header badge & icon */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-[#6D22B5] text-[10px] font-mono font-bold uppercase tracking-wider">
                        FEATURE {feature.featureNumber || `0${idx + 1}`}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#E11D48] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E11D48] group-hover:text-white transition-colors">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#0B132B] leading-snug group-hover:text-[#6D22B5] transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. BATCH TIMINGS & COURSE DETAILS */}
        {/* Side-by-side on desktop */}
        {/* ========================================================================= */}
        <section aria-label="Batch Timings and Course Details">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Batch Timings Section (5 cols) */}
            <div className="lg:col-span-5 bg-[#FAF5FF] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 text-[#6D22B5] text-[11px] font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Flexible Schedules</span>
                </div>
                <h3 className="text-2xl font-display font-extrabold text-[#0B132B]">
                  Batch Timings
                </h3>
                <p className="text-xs text-slate-600">
                  Select the alternate-day batch schedule that fits your daily routine:
                </p>
              </div>

              {/* BATCH 1 and BATCH 2 in separate rows */}
              <div className="space-y-4 my-auto">
                {/* BATCH 1 */}
                <div className="p-4 rounded-xl bg-white border border-purple-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-[#6D22B5] text-white text-xs font-extrabold uppercase tracking-wide">
                      BATCH 1
                    </span>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      Live 1:1 Track
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-slate-900 font-bold text-sm sm:text-base">
                    <Calendar className="w-4 h-4 text-[#6D22B5]" />
                    <span>Monday / Wednesday / Friday</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Dedicated 1:1 coaching slots scheduled with your personal IELTS mentor.
                  </p>
                </div>

                {/* BATCH 2 */}
                <div className="p-4 rounded-xl bg-white border border-purple-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-[#6D22B5] text-white text-xs font-extrabold uppercase tracking-wide">
                      BATCH 2
                    </span>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      Live 1:1 Track
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-slate-900 font-bold text-sm sm:text-base">
                    <Calendar className="w-4 h-4 text-[#6D22B5]" />
                    <span>Tuesday / Thursday / Saturday</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Ideal preparation cadence giving you study days between live sessions.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-200/70 text-xs text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6D22B5] flex-shrink-0" />
                <span>30 minutes per live session &bull; Google Meet links shared per class.</span>
              </div>
            </div>

            {/* Course Details Section (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
                  Verified Curriculum Structure
                </span>
                <h3 className="text-2xl font-display font-extrabold text-[#0B132B]">
                  Course Details
                </h3>
                <p className="text-xs text-slate-500">
                  Core components engineered for accelerated band score growth.
                </p>
              </div>

              {/* The 2 Core Details with clear headings, check icons, and descriptions */}
              <div className="space-y-4 my-auto">
                {IELTS_COURSE_DETAILS_LIST.map((detail, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#FAF7FE] border border-purple-100 hover:border-purple-200 transition-colors space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-pink-100 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h4 className="font-display font-bold text-base text-[#0B132B]">
                        {detail.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
                      {detail.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* All 4 IELTS skills highlight bar */}
              <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
                <span className="font-bold text-[#6D22B5] flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>All 4 IELTS Skills Covered:</span>
                </span>
                <div className="flex flex-wrap gap-2 text-[11px] font-extrabold text-slate-800">
                  <span className="bg-white px-2 py-0.5 rounded shadow-2xs">Speaking</span>
                  <span className="bg-white px-2 py-0.5 rounded shadow-2xs">Reading</span>
                  <span className="bg-white px-2 py-0.5 rounded shadow-2xs">Writing</span>
                  <span className="bg-white px-2 py-0.5 rounded shadow-2xs">Listening</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SESSION SUMMARY CARD */}
        {/* Purple background with white text, yellow accent, NO PRICING */}
        {/* ========================================================================= */}
        <section aria-label="Session Summary" className="pt-2">
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#6D22B5] via-[#7B2CBF] to-[#5A189A] text-white p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden text-center">
            {/* Background shimmer effect */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-900/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FACC15] text-[#1E293B] text-xs font-extrabold uppercase tracking-wider shadow-sm">
                Track Summary
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white">
                15 Live Sessions | 30 Minutes Each
              </h3>
              <p className="text-xs sm:text-sm text-purple-100 max-w-xl mx-auto leading-relaxed">
                Focused one-to-one mentoring covering Academic &amp; General Training requirements with continuous error diagnosis and scoring feedback.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CALL TO ACTION & BOTTOM BENEFITS SECTION */}
        {/* ========================================================================= */}
        <section aria-label="Bottom Benefits and Call to Action" className="space-y-8 pt-2">
          {/* Prominent Call to Action */}
          <div className="text-center pt-2">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-amber-300 via-[#FACC15] to-amber-400 shadow-md">
              <button
                type="button"
                onClick={onEnquire}
                className="px-8 sm:px-12 py-4 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0B132B] font-display font-extrabold text-sm sm:text-base tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PhoneCall className="w-5 h-5 text-[#0B132B]" />
                <span>Start Your IELTS Journey Today!</span>
                <ArrowRight className="w-5 h-5 text-[#0B132B]" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Click to enquire with our IELTS advisors and reserve your preferred batch
            </p>
          </div>

          {/* Bottom Benefits Strip in Purple Area */}
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#241442] to-[#160B2C] text-white p-6 sm:p-8 border border-purple-900/60 shadow-xl space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Core Advantages
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Key Benefits of This Program
              </h3>
            </div>

            {/* 4 Benefits Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {IELTS_BOTTOM_BENEFITS.map((benefit, idx) => {
                const IconComp = benefit.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white/5 backdrop-blur-xs rounded-2xl p-5 border border-purple-700/40 hover:border-pink-500/50 hover:bg-white/10 transition-all text-center space-y-2.5 flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center shadow-xs">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-base text-white">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
