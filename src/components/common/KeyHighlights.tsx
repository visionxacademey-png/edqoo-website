import React from 'react';
import {
  GraduationCap,
  Clock,
  Video,
  FolderGit2,
  Headphones,
  Briefcase,
  CheckCircle
} from 'lucide-react';

export interface KeyHighlightItem {
  id: string;
  category: string;
  badgeColor: string;
  iconBg: string;
  iconHoverBg: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  microAccent: string;
}

export const KEY_HIGHLIGHTS_DATA: KeyHighlightItem[] = [
  {
    id: 'highlight-faculty',
    category: 'Faculty & Mentors',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-50 text-purple-600',
    iconHoverBg: 'group-hover:bg-purple-600 group-hover:text-white',
    icon: GraduationCap,
    title: 'Learn from NIT Faculty & Industry Practitioners',
    description: 'Learn from experienced faculty members and industry practitioners with practical knowledge and real-world exposure.',
    microAccent: 'Academic & Industry Rigor'
  },
  {
    id: 'highlight-self-paced',
    category: 'Flexible Learning',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50 text-blue-600',
    iconHoverBg: 'group-hover:bg-blue-600 group-hover:text-white',
    icon: Clock,
    title: '218+ Hours of Self-Paced Learning',
    description: 'Access structured self-paced learning content designed to help you build concepts step by step.',
    microAccent: 'Step-by-Step Mastery'
  },
  {
    id: 'highlight-live-sessions',
    category: 'Live Masterclasses',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    iconBg: 'bg-sky-50 text-sky-600',
    iconHoverBg: 'group-hover:bg-sky-600 group-hover:text-white',
    icon: Video,
    title: '100+ Live Learning Sessions',
    description: 'Participate in live sessions for concept clarification, practical learning, discussions, and expert guidance.',
    microAccent: 'Interactive Expert Guidance'
  },
  {
    id: 'highlight-projects',
    category: 'Practical Portfolio',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600',
    iconHoverBg: 'group-hover:bg-emerald-600 group-hover:text-white',
    icon: FolderGit2,
    title: '50+ Industry Projects & Case Studies',
    description: 'Work on practical projects and industry-oriented case studies to apply your skills to real-world scenarios.',
    microAccent: 'Production-Grade Capstones'
  },
  {
    id: 'highlight-support',
    category: 'Continuous Assistance',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600',
    iconHoverBg: 'group-hover:bg-amber-600 group-hover:text-white',
    icon: Headphones,
    title: '24×7 Learning Support',
    description: 'Get continuous learning support whenever you need help with course content, projects, or technical concepts.',
    microAccent: 'Instant Mentor Guidance'
  },
  {
    id: 'highlight-career',
    category: 'Career Support',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600',
    iconHoverBg: 'group-hover:bg-rose-600 group-hover:text-white',
    icon: Briefcase,
    title: '3 Guaranteed Job Interviews',
    description: 'Get opportunities for 3 job interviews as part of the program’s career-support offering.',
    microAccent: 'Placement Pool Pathway'
  }
];

export const KeyHighlights: React.FC<{
  title?: string;
  subtitle?: string;
  badgeText?: string;
  className?: string;
}> = ({
  title = 'Key Highlights',
  subtitle = 'Experience an unmatched standard of practical technology education designed with academic rigor and enterprise outcomes.',
  badgeText = 'PROGRAM PILLARS',
  className = ''
}) => {
  return (
    <section id="highlights" className={`section-padding bg-gradient-to-b from-white via-purple-50/20 to-slate-50 border-b border-slate-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          {badgeText && (
            <span className="text-purple-600 text-xs font-extrabold tracking-widest uppercase block">
              {badgeText}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* 6 Key Highlights Cards Grid: 3 columns on Desktop, 2 columns on Tablet, 1 column on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {KEY_HIGHLIGHTS_DATA.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between h-full group"
              >
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Card Header: Category Badge & Icon */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${item.badgeColor}`}>
                      {item.category}
                    </span>
                    <div className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconHoverBg} flex items-center justify-center transition-colors shadow-2xs`}>
                      <ItemIcon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Highlight Title */}
                  <h3 className="text-base sm:text-lg font-display font-bold text-slate-950 leading-snug tracking-tight">
                    {item.title}
                  </h3>

                  {/* Highlight Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-grow">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer: Micro Accent */}
                <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-purple-700">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{item.microAccent}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
