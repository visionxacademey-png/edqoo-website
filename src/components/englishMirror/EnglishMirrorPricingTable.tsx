import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Clock, Video, Award, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnglishMirrorPricingTableProps {
  onEnquire: (programTitle: string, planHeadline?: string) => void;
}

export const EnglishMirrorPricingTable: React.FC<EnglishMirrorPricingTableProps> = ({
  onEnquire
}) => {
  const [selectedDurationIndex, setSelectedDurationIndex] = useState<number>(2); // Default to 3 Months (index 2)

  const durations = [
    { label: '1 Month', months: 1, tag: 'Standard' },
    { label: '2 Months', months: 2, tag: 'Extended Practice' },
    { label: '3 Months', months: 3, isRecommended: true, tag: 'Certificate Included' },
    { label: '6 Months', months: 6, tag: 'Popular Extended' },
    { label: '9 Months', months: 9, tag: 'Advanced Fluency' },
    { label: '12 Months', months: 12, tag: 'Comprehensive Fluency' }
  ];

  // Track matrix matching English Mirror catalogue
  const plans = [
    {
      id: 'pro-a',
      title: 'Pro Option A (Live 1:1)',
      subtitle: '30 Mins Live Google Meet Practice',
      badge: 'Most Popular Live',
      formatIcon: Video,
      sessionFormat: '30 Mins / Session',
      monthlySessions: '15 Live 1-to-1 Sessions / Month',
      scheduleSummary: 'Mon/Wed/Fri OR Tue/Thu/Sat',
      features: [
        '15 Live 1-1 Google Meet sessions / mo',
        '30-minute dedicated individual speaking',
        '15 HD Vocabulary Classes',
        '100+ intermediate to advanced words',
        '15 Educational Workbooks',
        'WhatsApp doubt clarification',
        'JAM activities & daily speaking prompts',
        'Certificate for 3+ months subscription'
      ]
    },
    {
      id: 'pro-b',
      title: 'Pro Option B (Live 1:1)',
      subtitle: '45 Mins Daily 1-1 Practice',
      badge: 'Intensive Track',
      formatIcon: Video,
      sessionFormat: '45 Mins / Session',
      monthlySessions: 'Live 1-to-1 Google Meet Sessions',
      scheduleSummary: 'Batch 1 (MWF) or Batch 2 (TTS)',
      features: [
        'Batch 1 (MWF) or Batch 2 (TTS)',
        'Live 1-1 Google Meet sessions',
        'HD Vocabulary Classes',
        '200+ intermediate to advanced words',
        'Educational workbooks',
        'WhatsApp dedicated support',
        'JAM activities & continuous assessment',
        'Certificate for 3+ months subscription'
      ]
    },
    {
      id: 'standard-a',
      title: 'Standard Plan (Telephonic)',
      subtitle: '15 Mins Daily Voice Practice',
      badge: 'High-Convenience Phone Track',
      formatIcon: Phone,
      sessionFormat: '15 Mins / Phone Call',
      monthlySessions: '25 Voice Calls / Month',
      scheduleSummary: 'Daily Calling (Mon – Sat)',
      features: [
        'Daily 1-to-1 voice calling (phone call)',
        '15-minute phone call session (25 calls/mo)',
        '25 Recorded HD Grammar Classes',
        '25 Vocabulary Classes (Lifetime Access)',
        '50 Educational E-PDFs & worksheets',
        'WhatsApp doubt clarification',
        'Daily JAM updates',
        'Certificate for 3+ months subscription'
      ]
    },
    {
      id: 'corp-track',
      title: 'Corporate Fluency Builder',
      subtitle: 'Elite Workplace Communication',
      badge: 'Executive Track',
      formatIcon: Video,
      sessionFormat: 'Live 1-to-1 Coaching',
      monthlySessions: '15 Executive Sessions / Month',
      scheduleSummary: 'Flexible Executive Time Slots',
      features: [
        '15 Live 1-1 Google Meet sessions / mo',
        'Professional pitch & office presentations',
        'Negotiation vocabulary & formal emailing',
        'Active boardroom listening drills',
        '15 HD Vocabulary Classes & workbooks',
        'Customized corporate JAM scenarios',
        'Flexible executive time slots',
        'Executive Certificate for 3+ months'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Duration Toggle Buttons */}
      <div className="flex flex-col items-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
         
          Select Your Target Learning Duration
        </span>

        {/* Scrollable Duration Pills on Mobile, Centered on Desktop */}
        <div className="w-full max-w-3xl overflow-x-auto pb-2 scrollbar-none flex items-center justify-start sm:justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-purple-900/40">
          {durations.map((dur, idx) => {
            const isSelected = selectedDurationIndex === idx;
            return (
              <button
                key={dur.months}
                type="button"
                onClick={() => setSelectedDurationIndex(idx)}
                className={`relative px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{dur.label}</span>
                {dur.isRecommended && (
                  <span className="hidden md:inline-block ml-1.5 text-[9px] px-1.5 py-0.2 bg-purple-400/20 text-purple-200 border border-purple-300/30 rounded">
                    Certificate
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-purple-200/70 text-center">
          Professional Course Completion Certificate is officially awarded for subscriptions of <strong>3 Months and above</strong>.
        </p>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const isThreeMonths = selectedDurationIndex >= 2;
          const FormatIcon = plan.formatIcon;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`relative rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left transition-all duration-300 ${
                isThreeMonths && plan.id === 'pro-a'
                  ? 'bg-gradient-to-b from-[#140C33] via-[#0F0B24] to-[#0A0718] border-2 border-purple-500/80 shadow-xl shadow-purple-950/50'
                  : 'bg-gradient-to-b from-slate-900/80 to-[#0A0718] border border-purple-900/40 hover:border-purple-500/40 shadow-lg'
              }`}
            >
              {/* Top Pill */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    {plan.badge}
                  </span>
                  {selectedDurationIndex >= 2 && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Certificate
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-display font-extrabold text-white">
                    {plan.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {plan.subtitle}
                  </p>
                </div>

                {/* Format & Schedule Overview */}
                <div className="py-3 border-y border-purple-900/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-purple-200 font-bold">
                    <FormatIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>{plan.sessionFormat}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <Clock className="w-3 h-3 text-purple-400" />
                    <span>{plan.scheduleSummary}</span>
                  </div>
                  <span className="text-[10px] text-purple-300/80 block pt-0.5 font-medium">
                    {durations[selectedDurationIndex].label} Enrolment Cohort
                  </span>
                </div>

                {/* Feature Bullets */}
                <ul className="space-y-2 pt-1 text-xs text-slate-300">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-purple-900/40">
                <button
                  type="button"
                  onClick={() => onEnquire(plan.title, `${durations[selectedDurationIndex].label} Plan`)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                    plan.id === 'pro-a'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/60'
                      : 'bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-800/60'
                  }`}
                >
                  <span>Enquire for Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
