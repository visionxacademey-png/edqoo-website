import React from 'react';
import { Link } from 'react-router-dom';

export interface LanguageTrackItem {
  id: string;
  number: string;
  badge: string;
  title: string;
  nativeScript: string;
  fontFamily: string;
  description: string;
  image: string;
  fallbackImage: string;
}

export const PROGRAM_TRACK_LANGUAGES: LanguageTrackItem[] = [
  {
    id: 'malayalam',
    number: '01',
    badge: 'MALAYALAM',
    title: 'മലയാളം → English',
    nativeScript: 'മലയാളം',
    fontFamily: "'Noto Sans Malayalam', 'Outfit', sans-serif",
    description: 'Learn to speak English confidently with explanations and guidance in Malayalam.',
    image: '/images/spoken-tutorial/languages/malayalam-english.webp',
    fallbackImage: '/images/spoken-tutorial/languages/malayalam-english.jpg',
  },
  {
    id: 'hindi',
    number: '02',
    badge: 'HINDI',
    title: 'हिन्दी → English',
    nativeScript: 'हिन्दी',
    fontFamily: "'Noto Sans Devanagari', 'Outfit', sans-serif",
    description: 'Learn spoken English confidently with clear explanations and guidance in Hindi.',
    image: '/images/spoken-tutorial/languages/hindi-english.webp',
    fallbackImage: '/images/spoken-tutorial/languages/hindi-english.jpg',
  },
  {
    id: 'tamil',
    number: '03',
    badge: 'TAMIL',
    title: 'தமிழ் → English',
    nativeScript: 'தமிழ்',
    fontFamily: "'Noto Sans Tamil', 'Outfit', sans-serif",
    description: 'Build English fluency step by step with clear explanations in Tamil.',
    image: '/images/spoken-tutorial/languages/tamil-english.webp',
    fallbackImage: '/images/spoken-tutorial/languages/tamil-english.jpg',
  },
  {
    id: 'kannada',
    number: '04',
    badge: 'KANNADA',
    title: 'ಕನ್ನಡ → English',
    nativeScript: 'ಕನ್ನಡ',
    fontFamily: "'Noto Sans Kannada', 'Outfit', sans-serif",
    description: 'Improve your English speaking skills through easy explanations in Kannada.',
    image: '/images/spoken-tutorial/languages/kannada-english.webp',
    fallbackImage: '/images/spoken-tutorial/languages/kannada-english.jpg',
  },
  {
    id: 'telugu',
    number: '05',
    badge: 'TELUGU',
    title: 'తెలుగు → English',
    nativeScript: 'తెలుగు',
    fontFamily: "'Noto Sans Telugu', 'Outfit', sans-serif",
    description: 'Improve your English communication skills with clear explanations in Telugu.',
    image: '/images/spoken-tutorial/languages/telugu-english.webp',
    fallbackImage: '/images/spoken-tutorial/languages/telugu-english.jpg',
  },
];

interface LanguageTrackCardProps {
  language: LanguageTrackItem;
}

export const LanguageTrackCard: React.FC<LanguageTrackCardProps> = ({ language }) => {
  return (
    <Link
      to="/spoken-tutorial#specialized-fluency-categories"
      onClick={(e) => {
        if (window.location.pathname === '/spoken-tutorial' || window.location.pathname === '/english-mirror') {
          e.preventDefault();
          const target =
            document.getElementById('specialized-fluency-categories') ||
            document.getElementById('fluency-categories');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', '#specialized-fluency-categories');
          }
        }
      }}
      className="group relative cursor-pointer rounded-[22px] sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-purple-300 flex flex-col justify-between min-h-[390px] sm:min-h-[430px] w-full bg-slate-100 select-none block"
      title={`Learn Spoken English in ${language.badge} - Click to explore 6 Specialized Fluency Categories`}
    >
      {/* Background Image */}
      <img
        src={language.image}
        alt={language.title}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== language.fallbackImage) {
            target.src = language.fallbackImage;
          }
        }}
      />

      {/* Top Badges */}
      <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-800 text-xs font-semibold tracking-wide shadow-sm">
          <span style={{ fontFamily: language.fontFamily }} className="text-[#6D22B5] font-bold">
            {language.nativeScript}
          </span>
          <span className="text-[#6D22B5] font-bold">→</span>
          <span className="text-slate-900 font-bold">English</span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-700 text-xs font-mono font-bold shadow-sm">
          {language.number}
        </span>
      </div>

      {/* Bottom Information Panel */}
      <div className="relative z-10 p-3 sm:p-3.5 w-full">
        <div className="bg-white/95 backdrop-blur-md rounded-[18px] sm:rounded-2xl p-4 sm:p-5 border border-white/80 shadow-md text-center flex flex-col items-center space-y-2 group-hover:border-purple-200 transition-colors">
          {/* Language Identifier */}
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6D22B5] flex items-center justify-center gap-1.5">
            <span>{language.badge}</span>
            <span className="text-purple-300">•</span>
            <span style={{ fontFamily: language.fontFamily }}>{language.nativeScript}</span>
          </div>

          {/* Main Heading with Native Characters and Purple Arrow */}
          <h3
            style={{ fontFamily: language.fontFamily }}
            className="text-xl sm:text-[22px] font-display font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#6D22B5] transition-colors inline-flex items-center justify-center gap-2"
          >
            <span>{language.nativeScript}</span>
            <span className="text-[#6D22B5] font-bold">→</span>
            <span>English</span>
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal line-clamp-3">
            {language.description}
          </p>

          {/* Bottom Accent Line */}
          <div className="pt-1">
            <div className="w-8 h-0.5 bg-[#6D22B5] group-hover:w-14 transition-all duration-300 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LanguageTrackCard;
