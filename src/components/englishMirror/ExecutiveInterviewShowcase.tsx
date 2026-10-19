import React from 'react';
import {
  CheckCircle2,
  Video,
  Users,
  FileText,
  Lightbulb,
  Briefcase,
  Calendar,
  Clock,
  TrendingUp,
  ShieldCheck,
  Award,
  Compass,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import type { Course, CourseFeatureItem } from '../../types';
import type { SpokenTutorialSubCategory } from '../../pages/SpokenTutorial/data';

interface ExecutiveInterviewShowcaseProps {
  course?: Course | null;
  category?: SpokenTutorialSubCategory | any | null;
  onEnquire?: () => void;
  className?: string;
}

export const EXECUTIVE_INTERVIEW_DEFAULT_FEATURES: CourseFeatureItem[] = [
  {
    id: 1,
    featureNumber: '01',
    title: '12 Live 1:1 Sessions',
    description: 'Personalized coaching on Google Meet.'
  },
  {
    id: 2,
    featureNumber: '02',
    title: 'Mock Interviews',
    description: 'Practice with real interview questions and feedback.'
  },
  {
    id: 3,
    featureNumber: '03',
    title: 'Resume & Self-Introduction',
    description: 'Learn to present yourself effectively.'
  },
  {
    id: 4,
    featureNumber: '04',
    title: 'Answer Strategy & Communication',
    description: 'Structure your answers with clarity and confidence.'
  },
  {
    id: 5,
    featureNumber: '05',
    title: 'Industry-Specific Preparation',
    description: 'Tailored guidance based on your domain and goals.'
  }
];

export const EXECUTIVE_INTERVIEW_DETAILS_LIST = [
  '12 Live 1:1 Sessions (Google Meet)',
  '30 Minutes per Live Session',
  'Personalized feedback and improvement plan',
  'Mock interview practice (HR + Technical)',
  'Resume building and self-introduction training',
  'Body language, confidence & professional etiquette',
  'Tips and strategies to answer commonly asked questions'
];

export const EXECUTIVE_HERO_CHECKLIST = [
  'Speak Confidently',
  'Answer Smartly',
  'Make a Lasting Impression',
  'Get Your Dream Job'
];

export const EXECUTIVE_BOTTOM_BENEFITS = [
  {
    title: 'Career Growth',
    description: 'Accelerate promotions and high-impact job opportunities',
    icon: TrendingUp
  },
  {
    title: 'Build Confidence',
    description: 'Overcome hesitation and speak with executive authority',
    icon: ShieldCheck
  },
  {
    title: 'Professional Success',
    description: 'Command respect across senior panels and leadership rounds',
    icon: Award
  },
  {
    title: 'Personalized Guidance',
    description: '1-on-1 mentorship customized to your industry domain',
    icon: Compass
  }
];

export const ExecutiveInterviewShowcase: React.FC<ExecutiveInterviewShowcaseProps> = ({
  course,
  category,
  onEnquire,
  className = ''
}) => {
  // Course titles and text
  const mainHeading = '1:1 Executive Interview Preparation Track';
  const highlightText = category?.highlightText || course?.highlightText || 'Crack Interviews with Confidence';
  const description =
    category?.description ||
    course?.description ||
    course?.shortDescription ||
    'Personalized coaching to help you succeed in job interviews, career growth, and professional opportunities.';
  const visualTagText = category?.supportingText || course?.supportingText || 'Be Interview Ready!';

  // Assigned course image (preserve existing assigned course image)
  const heroImage =
    category?.hero_image ||
    category?.heroImage ||
    category?.image ||
    course?.image ||
    course?.heroImage ||
    '/images/spoken-tutorial/executive-interview.jpg';

  // Feature icons mapping for the 5 features
  const featureIcons = [Video, Users, FileText, Lightbulb, Briefcase];

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
              description: f.description || EXECUTIVE_INTERVIEW_DEFAULT_FEATURES[idx]?.description || ''
            };
          }
          return EXECUTIVE_INTERVIEW_DEFAULT_FEATURES[idx] || {
            id: idx + 1,
            featureNumber: `0${idx + 1}`,
            title: String(f),
            description: ''
          };
        })
      : EXECUTIVE_INTERVIEW_DEFAULT_FEATURES;

  const anyCourse = course as any;
  const anyCategory = category as any;
  const activeDetailsList: string[] =
    Array.isArray(anyCategory?.course_details?.detailsList) && anyCategory.course_details.detailsList.length > 0
      ? anyCategory.course_details.detailsList
      : Array.isArray(anyCategory?.courseDetails?.detailsList) && anyCategory.courseDetails.detailsList.length > 0
      ? anyCategory.courseDetails.detailsList
      : Array.isArray(anyCourse?.course_details?.detailsList) && anyCourse.course_details.detailsList.length > 0
      ? anyCourse.course_details.detailsList
      : Array.isArray(anyCourse?.courseDetails?.detailsList) && anyCourse.courseDetails.detailsList.length > 0
      ? anyCourse.courseDetails.detailsList
      : EXECUTIVE_INTERVIEW_DETAILS_LIST;

  const sessionSummaryText: string =
    anyCategory?.course_details?.sessionSummary ||
    anyCategory?.courseDetails?.sessionSummary ||
    anyCourse?.course_details?.sessionSummary ||
    anyCourse?.courseDetails?.sessionSummary ||
    '12 Live Sessions | 30 Minutes Each';

  return (
    <div
      className={`bg-gradient-to-b from-[#FAF7FE] via-[#FFFFFF] to-[#FAF7FE] text-slate-900 selection:bg-[#6D22B5] selection:text-white relative overflow-hidden text-left ${className}`}
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-indigo-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION & BRANDING */}
        {/* ========================================================================= */}
        <section aria-label="Course Hero" className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              {/* English Mirror Branding Badge */}
              <div className="flex flex-wrap items-center gap-2">
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

                {/* Additional Visual Text Yellow Badge: Be Interview Ready! */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-300 text-amber-950 border border-amber-400 font-extrabold text-xs tracking-wide shadow-xs">
                  <span>{visualTagText}</span>
                </div>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[#0B132B] tracking-tight leading-[1.15]">
                  {mainHeading}
                </h1>
                {/* Highlight Text */}
                <p className="text-lg sm:text-xl font-bold text-[#6D22B5] mt-2">
                  {highlightText}
                </p>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                {description}
              </p>

              {/* Checklist Beside / Beneath Hero Content */}
              <div className="pt-2 pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Core Coaching Outcomes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EXECUTIVE_HERO_CHECKLIST.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-purple-100 shadow-2xs hover:border-purple-300 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#6D22B5] flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Hero CTA Button */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onEnquire}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#6D22B5] hover:bg-[#5A189A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <PhoneCall className="w-4 h-4 text-white" />
                  <span>Start Your Interview Preparation Today!</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border-2 border-purple-200/80 shadow-2xl group">
                <img
                  src={heroImage}
                  alt={mainHeading}
                  className="w-full h-72 sm:h-96 lg:h-[460px] object-cover object-center transition-transform duration-700 group-hover:scale-102"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== '/images/spoken-tutorial/executive-interview.jpg') {
                      target.src = '/images/spoken-tutorial/executive-interview.jpg';
                    }
                  }}
                />

                {/* Subtle soft gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/85 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Image Badge */}
                <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none flex items-end justify-between gap-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#6D22B5] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      Official 1:1 Track
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white mt-1 drop-shadow-sm">
                      Executive Interview Coaching
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-200 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                    {course?.liveHours || '12 Live Sessions'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. FIVE KEY FEATURE HIGHLIGHTS */}
        {/* ========================================================================= */}
        <section aria-label="Five Key Features" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#6D22B5]">
              Curriculum Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0B132B] tracking-tight">
              Five Key Feature Highlights
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Personalized modules designed to prepare you comprehensively for executive career growth.
            </p>
          </div>

          {/* Desktop horizontal row / 5-column responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {features.map((feature, idx) => {
              const IconComponent = featureIcons[idx] || Briefcase;
              return (
                <div
                  key={feature.id || idx}
                  className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group text-left relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-[#6D22B5] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-3">
                    {/* Header badge & icon */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-[#6D22B5] text-[10px] font-mono font-bold uppercase tracking-wider">
                        FEATURE {feature.featureNumber || `0${idx + 1}`}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6D22B5] flex items-center justify-center flex-shrink-0 group-hover:bg-[#6D22B5] group-hover:text-white transition-colors">
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
        {/* 3. COURSE DETAILS & FLEXIBLE BATCH TIMINGS */}
        {/* Two-column layout side-by-side on desktop */}
        {/* ========================================================================= */}
        <section aria-label="Course Details and Timings">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Course Details (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D22B5]">
                  Comprehensive Syllabus Checklist
                </span>
                <h3 className="text-2xl font-display font-extrabold text-[#0B132B]">
                  Course Details
                </h3>
                <p className="text-xs text-slate-500">
                  All 7 verified components included in your personalized 1:1 coaching.
                </p>
              </div>

              {/* All 7 Details as prominent checklist */}
              <div className="space-y-3.5 pt-1">
                {activeDetailsList.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF7FE] border border-purple-100/80 hover:border-purple-200 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#6D22B5] mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flexible Batch Timings (5 cols) */}
            <div className="lg:col-span-5 bg-[#FAF5FF] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 text-[#6D22B5] text-[11px] font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Flexible Scheduling</span>
                </div>
                <h3 className="text-2xl font-display font-extrabold text-[#0B132B]">
                  Batch Timings (Flexible)
                </h3>
                <p className="text-xs text-slate-600">
                  Choose the schedule that fits your current professional workload:
                </p>
              </div>

              {/* Batch 1 and Batch 2 separate rows */}
              <div className="space-y-4 my-auto">
                {/* Batch 1 */}
                <div className="p-4 rounded-xl bg-white border border-purple-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-[#6D22B5] text-white text-xs font-extrabold uppercase tracking-wide">
                      Batch 1
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
                    Sessions are flexibly scheduled directly with your personal mentor.
                  </p>
                </div>

                {/* Batch 2 */}
                <div className="p-4 rounded-xl bg-white border border-purple-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-[#6D22B5] text-white text-xs font-extrabold uppercase tracking-wide">
                      Batch 2
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
                    Alternate-day practice rhythm allowing adequate preparation between sessions.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-200/70 text-xs text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6D22B5] flex-shrink-0" />
                <span>30 minutes per live session &bull; Timings coordinated via Google Meet.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SESSION SUMMARY CARD */}
        {/* Prominent purple background with white text, NO PRICING */}
        {/* ========================================================================= */}
        <section aria-label="Session Summary" className="pt-2">
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#6D22B5] via-[#7B2CBF] to-[#5A189A] text-white p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden text-center">
            {/* Background shimmer effect */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-900/30 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold uppercase tracking-wider text-purple-100 border border-white/20">
                Track Summary
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white">
                {sessionSummaryText}
              </h3>
              <p className="text-xs sm:text-sm text-purple-100 max-w-xl mx-auto leading-relaxed">
                Focused one-on-one sessions with expert trainers dedicated exclusively to your interview success and career milestones.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. BOTTOM BENEFITS SECTION & FINAL CALL TO ACTION */}
        {/* ========================================================================= */}
        <section aria-label="Bottom Benefits and Call to Action" className="space-y-8 pt-2">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D22B5]">
              Core Advantages
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0B132B]">
              Key Benefits of This Program
            </h3>
          </div>

          {/* 4 Items Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {EXECUTIVE_BOTTOM_BENEFITS.map((benefit, idx) => {
              const IconComp = benefit.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-purple-100 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all text-center space-y-2.5 flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6D22B5] flex items-center justify-center shadow-xs">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-base text-[#0B132B]">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Prominent Call-to-Action Below the Benefits Strip */}
          <div className="pt-4 text-center">
            <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-purple-200 via-purple-300 to-indigo-200 shadow-md">
              <button
                type="button"
                onClick={onEnquire}
                className="px-8 sm:px-12 py-4 rounded-xl bg-[#6D22B5] hover:bg-[#5A189A] text-white font-display font-extrabold text-sm sm:text-base tracking-wide shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PhoneCall className="w-5 h-5 text-white" />
                <span>Start Your Interview Preparation Today!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Click to enquire with our academic advisors and schedule your batch
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
