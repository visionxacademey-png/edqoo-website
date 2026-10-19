import React from 'react';
import type { Course, CourseFeatureItem } from '../../types';

interface CommunicativeEnglishMasteryShowcaseProps {
  course?: Course | null;
  className?: string;
}

const DEFAULT_FEATURES: CourseFeatureItem[] = [
  {
    id: 1,
    featureNumber: '01',
    title: '15 Live 1:1 Sessions',
    description: 'Expert-led speaking practice'
  },
  {
    id: 2,
    featureNumber: '02',
    title: '25 Grammar + 25 Vocabulary + 25 Habits',
    description: 'HD lessons with lifetime access and daily fluency habituation'
  },
  {
    id: 3,
    featureNumber: '03',
    title: '50+ E-PDFs + 200+ Power Words',
    description: 'Study resources for confident communication'
  },
  {
    id: 4,
    featureNumber: '04',
    title: 'Certification',
    description: 'Course completion certification for 3+ months enrollments'
  }
];

export const CommunicativeEnglishMasteryShowcase: React.FC<CommunicativeEnglishMasteryShowcaseProps> = ({
  course,
  className = ''
}) => {
  const mainHeading = course?.title || '1:1 Communicative English Mastery';
  const description = course?.description || 'Your Complete Path to Confident English Communication';
  const supportingText = course?.supportingText || 'Live Coaching | Video Lessons | Daily Practice';
  const closingHighlight = course?.highlightText || 'Mirror your success with fluent English';

  // Extract structured features from course (supporting DB records)
  const features: CourseFeatureItem[] = Array.isArray(course?.features) && course.features.length > 0
    ? course.features.map((f: any, idx: number) => {
        if (typeof f === 'object' && f !== null && 'title' in f) {
          return {
            id: f.id || idx + 1,
            featureNumber: f.featureNumber || `0${idx + 1}`,
            title: f.title,
            description: f.description || DEFAULT_FEATURES[idx]?.description || ''
          };
        }
        return DEFAULT_FEATURES[idx] || {
          id: idx + 1,
          featureNumber: `0${idx + 1}`,
          title: String(f),
          description: ''
        };
      })
    : DEFAULT_FEATURES;

  return (
    <section
      aria-label="1:1 Communicative English Mastery Curriculum Features"
      className={`rounded-3xl bg-white border border-[#E5D5FF] p-6 sm:p-8 md:p-10 text-slate-900 shadow-sm overflow-hidden relative ${className}`}
    >
      <div className="relative z-10 space-y-8 max-w-full">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {/* Supporting Text Tagline Badge */}
          {supportingText && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3FF] border border-[#E5D5FF] text-[#6D22B5] text-xs font-semibold tracking-wide shadow-2xs">
              <span>{supportingText}</span>
            </div>
          )}

          {/* Main Heading in Dark Charcoal */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#202020] tracking-tight leading-tight">
            {mainHeading}
          </h2>

          {/* Description in Dark Grey */}
          <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Four Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.slice(0, 4).map((feature, idx) => {
            const featNum = feature.featureNumber || `0${idx + 1}`;
            return (
              <div
                key={feature.id || idx}
                className="rounded-2xl bg-[#F7F3FF] border border-[#E5D5FF] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#6D22B5]/50 hover:shadow-sm transition-all duration-300 text-left"
              >
                {/* Numbered Feature Badge with Purple Accent */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E5D5FF] text-[#6D22B5] text-xs font-mono font-extrabold shadow-2xs tracking-wider">
                    FEATURE {featNum}
                  </span>
                </div>

                {/* Card Title & Description */}
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
            "{closingHighlight}"
          </p>
        </div>
      </div>
    </section>
  );
};

export default CommunicativeEnglishMasteryShowcase;
