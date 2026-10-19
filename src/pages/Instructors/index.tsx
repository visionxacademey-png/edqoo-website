import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Search,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { instructorService } from '../../services/instructorService';
import type { Instructor } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useEnquiry } from '../../context/EnquiryContext';
import { getCacheBustedImageUrl } from '../../utils/imageUrl';

export const Instructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const { openEnquiryModal } = useEnquiry();

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const data = await instructorService.getInstructors();
        setInstructors(data);
      } catch (err) {
        console.error('Failed to load instructors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  // Collect unique expertise tags across all instructors
  const allExpertise = Array.from(
    new Set(instructors.flatMap((inst) => inst.expertise || []))
  );

  const filteredInstructors = instructors.filter((inst) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      inst.name.toLowerCase().includes(query) ||
      inst.designation.toLowerCase().includes(query) ||
      inst.organization.toLowerCase().includes(query) ||
      (inst.shortBio && inst.shortBio.toLowerCase().includes(query)) ||
      (inst.courses && inst.courses.some((c) => c.toLowerCase().includes(query))) ||
      (inst.expertise && inst.expertise.some((e) => e.toLowerCase().includes(query)));

    const matchesExpertise =
      selectedExpertise === 'all' ||
      (inst.expertise && inst.expertise.includes(selectedExpertise));

    return matchesSearch && matchesExpertise;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 text-left">
      <SEO
        title="Meet Our Instructors & Mentors | Edqoo Faculty"
        description="Learn from experienced technology educators, industry practitioners, and AI researchers with deep real-world enterprise expertise on Edqoo."
        canonical="/instructors"
        keywords="Edqoo instructors, data science mentors, AI trainers India, tech faculty Kerala, python mentors"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Instructors', url: '/instructors' }
        ]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#F1E8FA]/40 via-[#F7F7F7] to-white text-slate-950 py-14 sm:py-20 text-center relative overflow-hidden border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F1E8FA] border border-[#E0CEF5] text-[#6D22B5] rounded-full text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-[#6D22B5]" />
            <span>World-Class Mentorship</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight">
            Meet Our Instructors &amp; Faculty
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Learn from experienced faculty, industry practitioners, and professionals who bring practical knowledge and real-world experience to our programs.
          </p>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <Breadcrumbs items={[{ name: 'Instructors', url: '/instructors' }]} />
        </div>
      </div>

      {/* Search & Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search instructors by name, skill, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#6D22B5] focus:ring-1 focus:ring-[#6D22B5] text-slate-900 placeholder-slate-400 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Expertise Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedExpertise('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                selectedExpertise === 'all'
                  ? 'bg-[#6D22B5] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Expertise
            </button>
            {allExpertise.slice(0, 5).map((exp) => (
              <button
                key={exp}
                onClick={() => setSelectedExpertise(exp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedExpertise === exp
                    ? 'bg-[#6D22B5] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Instructors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#6D22B5] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Loading Faculty Profiles...
            </span>
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No instructors found</h3>
            <p className="text-xs text-slate-500">
              No faculty matched your filter &ldquo;{searchQuery || selectedExpertise}&rdquo;. Try clearing your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedExpertise('all');
              }}
              className="px-4 py-2 bg-[#F1E8FA] text-[#6D22B5] font-bold text-xs rounded-lg hover:bg-[#d8f0c5] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredInstructors.map((inst) => {
              const photo = getCacheBustedImageUrl(
                inst.profileImage || inst.image,
                inst.updatedAt || inst.imageUpdatedAt,
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
              );
              return (
                <div
                  key={inst.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-[#6D22B5]/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-5">
                    {/* Header: Photo + Core Details */}
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={photo}
                          alt={inst.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm group-hover:scale-102 transition-transform duration-300"
                        />
                        {inst.experience && (
                          <span className="absolute -bottom-2 -right-1 bg-[#050505] text-[#6D22B5] border border-[#6D22B5]/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                            {inst.experience}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/instructors/${inst.id}`}
                            className="text-base sm:text-lg font-display font-bold text-slate-950 hover:text-[#6D22B5] transition-colors truncate block"
                          >
                            {inst.name}
                          </Link>
                          {inst.linkedin && (
                            <a
                              href={inst.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-slate-400 hover:text-[#6D22B5] transition-colors"
                              aria-label={`${inst.name} LinkedIn Profile`}
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                              </svg>
                            </a>
                          )}
                        </div>

                        <p className="text-xs font-bold text-[#6D22B5] leading-tight">
                          {inst.designation || inst.role}
                        </p>

                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{inst.organization}</span>
                        </p>

                        {inst.qualifications && (
                          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                            <Award className="w-3 h-3 text-[#6D22B5] flex-shrink-0" />
                            <span className="truncate">{inst.qualifications}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Short Professional Bio */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {inst.shortBio || inst.detailedBio}
                    </p>

                    {/* Expertise Badges */}
                    {inst.expertise && inst.expertise.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Area of Expertise:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {inst.expertise.map((exp, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-[#F1E8FA] border border-[#E0CEF5] text-[#381061] text-[11px] font-semibold rounded-md"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Courses / Programs Handled */}
                    {inst.courses && inst.courses.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Courses / Programs Taught:
                        </span>
                        <div className="space-y-1">
                          {inst.courses.map((courseTitle, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#6D22B5] flex-shrink-0" />
                              <span className="truncate">{courseTitle}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link
                      to={`/instructors/${inst.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D22B5] hover:text-[#386200] group-hover:translate-x-0.5 transition-all"
                    >
                      <span>View Complete Profile &amp; Qualifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => openEnquiryModal()}
                      className="px-3 py-1.5 bg-[#F1E8FA] hover:bg-[#d8f0c5] text-[#381061] text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <span>Enquire</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Advisory Banner Section */}
      <section className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#050505] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-xl">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="inline-block text-[11px] font-bold text-[#6D22B5] uppercase tracking-widest">
                Direct Faculty Mentorship
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                Learn Directly with Industry Practitioners
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Connect with our academic counseling team to explore which program track best aligns with your background and career goals.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="btn-primary px-6 py-3 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>Request Academic Advisory</span>
              </button>
              <Link
                to="/courses"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <span>Browse All Programs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
