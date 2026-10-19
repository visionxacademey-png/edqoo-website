import React from 'react';
import type { Course, CourseFeatureItem } from '../../types';

interface FluencyBuilderShowcaseProps {
  course?: Course | null;
  className?: string;
  isStackedLayout?: boolean;
}

export const FLUENCY_BUILDER_DEFAULT_FEATURES: CourseFeatureItem[] = [
  {
    id: 1,
    featureNumber: '01',
    title: '25 Phone Call Sessions',
    description: 'Daily 15-minute 1-1 voice calls with an expert trainer.'
  },
  {
    id: 2,
    featureNumber: '02',
    title: '25 Grammar + 25 Vocabulary',
    description: 'Recorded HD classes with lifetime access.'
  },
  {
    id: 3,
    featureNumber: '03',
    title: '50 E-PDFs + Daily JAM Updates',
    description: 'Educational resources with WhatsApp doubt support.'
  },
  {
    id: 4,
    featureNumber: '04',
    title: 'Certification',
    description: 'Earned for course tenures of 3 months and above.'
  }
];

export const FluencyBuilderShowcase: React.FC<FluencyBuilderShowcaseProps> = ({
  course,
  className = '',
  isStackedLayout = false
}) => {
  const mainHeading = course?.title || 'Fluency Builder Plan';
  const description = course?.description || 'Your Complete Path to Confident English Communication';
  const supportingText = course?.supportingText || 'Voice Calls | Recorded Lessons | Daily Practice';
  const closingHighlight = course?.highlightText || 'Mirror your success with fluent English';

  // Extract structured features (prefer course.features from DB, fallback to reference items)
  const features: CourseFeatureItem[] = Array.isArray(course?.features) && course.features.length > 0
    ? course.features.map((f: any, idx: number) => {
        if (typeof f === 'object' && f !== null && 'title' in f) {
          return {
            id: f.id || idx + 1,
            featureNumber: f.featureNumber || `0${idx + 1}`,
            title: f.title,
            description: f.description || FLUENCY_BUILDER_DEFAULT_FEATURES[idx]?.description || ''
          };
        }
        return FLUENCY_BUILDER_DEFAULT_FEATURES[idx] || {
          id: idx + 1,
          featureNumber: `0${idx + 1}`,
          title: String(f),
          description: ''
        };
      })
    : FLUENCY_BUILDER_DEFAULT_FEATURES;

  return (
    <section
      aria-label="Fluency Builder Plan Curriculum Features"
      className={`rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-8 md:p-10 text-slate-900 shadow-md overflow-hidden relative ${className}`}
    >
      {/* Subtle ambient background glow effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-50/80 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-7 max-w-full">
        {/* Header Block matching reference layout:
            1. Course Title at the top
            2. Purple TELEPHONIC SESSIONS badge beneath the title
            3. Description below the badge
            4. Supporting text beneath the description */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {/* 1. Course Title at top */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#111827] tracking-tight leading-tight">
            {mainHeading}
          </h2>

          {/* 2. Purple TELEPHONIC SESSIONS badge beneath the title */}
          <div>
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#7C3AED] text-white text-xs font-mono font-extrabold tracking-wider uppercase shadow-xs">
              TELEPHONIC SESSIONS
            </span>
          </div>

          {/* 3. Description below the badge */}
          <p className="text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
            {description}
          </p>

          {/* 4. Supporting text beneath the description */}
          {supportingText && (
            <div className="pt-1">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#F5F0FF] border border-[#E5E7EB] text-[#374151] text-xs font-medium tracking-wide shadow-2xs">
                {supportingText}
              </span>
            </div>
          )}
        </div>

        {/* Four Feature Cards */}
        <div
          className={
            isStackedLayout
              ? 'space-y-4'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'
          }
        >
          {features.slice(0, 4).map((feature, idx) => {
            const featNum = feature.featureNumber || `0${idx + 1}`;
            return (
              <div
                key={feature.id || idx}
                className="rounded-2xl bg-[#F5F0FF] border border-[#E5E7EB] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-[#7C3AED]/40 hover:shadow-md transition-all duration-300 text-left"
              >
                {/* Purple Numbered Feature Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-[#7C3AED] text-white text-xs font-mono font-extrabold shadow-2xs tracking-wider">
                    FEATURE {featNum}
                  </span>
                </div>

                {/* Dark Navy Title & Dark Grey Description */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base sm:text-lg font-display font-bold text-[#111827] leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing Highlight in Purple, Bold Italic Typography */}
        <div className="pt-2 pb-1 text-center">
          <p className="text-base sm:text-lg md:text-xl font-bold italic text-[#7C3AED] tracking-wide">
            "{closingHighlight}"
          </p>
        </div>

        {/* TELEPHONIC LEARNING Information Card */}
        <div className="rounded-2xl bg-[#F5F0FF] border border-[#E5E7EB] p-4 sm:p-5 shadow-xs max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#7C3AED] block">
              TELEPHONIC LEARNING
            </span>
            <p className="text-sm sm:text-base font-bold text-[#111827]">
              Daily 1-1 voice calls + self-paced learning
            </p>
          </div>
          <span className="inline-flex items-center justify-center self-center sm:self-auto px-3 py-1 rounded-md bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#7C3AED] text-xs font-bold uppercase tracking-wider">
            Included
          </span>
        </div>
      </div>
    </section>
  );
};

export default FluencyBuilderShowcase;
