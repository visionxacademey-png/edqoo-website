import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnglishMirrorCategoryCardProps {
  variant?: 'home_grid' | 'sidebar' | 'featured_banner';
  className?: string;
}

export const EnglishMirrorCategoryCard: React.FC<EnglishMirrorCategoryCardProps> = ({
  variant = 'home_grid',
  className = ''
}) => {
  if (variant === 'featured_banner') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-slate-900 border border-purple-200 shadow-sm group ${className}`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-[#F1E8FA] text-[#6D22B5] border border-[#E0CEF5]">
                Strategic Partner Program
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Powered in partnership with English Mirror
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src="/englishclass.png"
                alt="English Mirror Logo"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-950 tracking-tight">
                  ENGLISH MIRROR
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#6D22B5]">
                  Habit-Based English Learning
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6D22B5]" />
                Build Confidence
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6D22B5]" />
                Improve Communication
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6D22B5]" />
                Speak with Clarity
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              1-to-1 Communicative English Mastery sessions, telephonic voice calling, IELTS coaching, corporate fluency, and executive interview preparation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <Link
              to="/spoken-tutorial"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#6D22B5] hover:bg-[#5C1C9A] text-white font-bold text-xs shadow-sm transition-all duration-300 active:scale-95 group/btn cursor-pointer"
            >
              <span>Explore Spoken English</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
            <span className="text-[10px] text-center text-slate-500">
              Dedicated 1:1 Trainers &bull; Flexible Batches
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default Home Grid / Catalog Card
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6 text-slate-900 border border-purple-200 shadow-2xs hover:border-[#6D22B5] hover:shadow-md transition-all duration-300 flex flex-col justify-between group ${className}`}
    >
      {/* Top section with partner badge & logo */}
      <div className="relative z-10 space-y-4 text-left">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#F1E8FA] border border-[#E0CEF5] text-[10px] font-extrabold uppercase tracking-wider text-[#6D22B5]">
            
            Partner Experience
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Edqoo &times; English Mirror
          </span>
        </div>

        {/* English Mirror Official Logo */}
        <div className="pt-1 flex items-center gap-3">
          <img
            src="/englishclass.png"
            alt="English Mirror"
            className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
          />
          <div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              ENGLISH MIRROR
            </span>
            <span className="text-[11px] text-[#6D22B5] font-semibold block leading-tight">
              Habit-Based English Learning
            </span>
          </div>
        </div>

        {/* Value bullet points */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6D22B5] flex-shrink-0" />
            Build confidence.
          </p>
          <p className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6D22B5] flex-shrink-0" />
            Improve communication.
          </p>
          <p className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6D22B5] flex-shrink-0" />
            Speak with clarity.
          </p>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
          1-to-1 Live Google Meet sessions, Daily Telephonic Calling, IELTS coaching, Kids Fluency, and Corporate English.
        </p>
      </div>

      {/* Action Button */}
      <div className="relative z-10 pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#6D22B5]">
          6 Specialized Programs
        </span>
        <Link
          to="/spoken-tutorial"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6D22B5] hover:bg-[#5C1C9A] text-white font-bold text-xs shadow-2xs transition-all duration-200 cursor-pointer"
        >
          <span>Explore Spoken English</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
};
