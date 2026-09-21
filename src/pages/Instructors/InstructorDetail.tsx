import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  ArrowLeft,
  Mail,
  ChevronRight,
  CheckCircle2,
  Code2,
  FolderGit2,
  ShieldCheck,
  PhoneCall,
  ArrowRight
} from 'lucide-react';
import { instructorService } from '../../services/instructorService';
import type { Instructor } from '../../types';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

export const InstructorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const { openEnquiryModal } = useEnquiry();

  useEffect(() => {
    const fetchInstructor = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await instructorService.getInstructorById(id);
        setInstructor(data);
      } catch (err) {
        console.error('Failed to load instructor detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructor();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
          Loading Instructor Profile...
        </span>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="bg-slate-50 min-h-screen py-24 text-center">
        <div className="max-w-md mx-auto bg-white border border-slate-200 p-8 rounded-2xl shadow-2xs space-y-4">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Instructor Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested instructor profile does not exist or may have been updated.
          </p>
          <Link
            to="/instructors"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-lg hover:bg-purple-700 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Instructors</span>
          </Link>
        </div>
      </div>
    );
  }

  const photo = instructor.profileImage || instructor.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 text-left">
      <SEO
        title={`${instructor.name} - ${instructor.designation || instructor.role}`}
        description={`${instructor.name} is a ${instructor.designation || instructor.role} at ${instructor.organization}. ${instructor.shortBio || ''}`}
        canonical={`/instructors/${instructor.id}`}
        ogImage={photo}
      />

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/instructors" className="hover:text-purple-600 transition-colors">Instructors</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate">{instructor.name}</span>
        </div>
      </div>

      {/* Profile Header Banner */}
      <section className="bg-gradient-to-b from-purple-50/80 via-slate-50 to-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
            
            {/* Large Profile Image */}
            <div className="relative flex-shrink-0 mx-auto md:mx-0">
              <img
                src={photo}
                alt={instructor.name}
                className="w-32 h-32 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-white shadow-md shadow-purple-500/10"
              />
              {instructor.experience && (
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-2 bg-purple-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                  {instructor.experience}
                </span>
              )}
            </div>

            {/* Profile Intro */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
                  Faculty &amp; Mentor Profile
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-slate-950">
                  {instructor.name}
                </h1>
                <p className="text-sm sm:text-base font-bold text-purple-800">
                  {instructor.designation || instructor.role}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center justify-center md:justify-start gap-1.5 pt-0.5">
                  <Briefcase className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>{instructor.organization}</span>
                </p>
              </div>

              {/* Action and Social Links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
                {instructor.linkedin && (
                  <a
                    href={instructor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-purple-600 hover:border-purple-300 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-[#0a66c2]" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn Profile</span>
                  </a>
                )}

                {instructor.email && (
                  <a
                    href={`mailto:${instructor.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-purple-600 hover:border-purple-300 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                    <span>{instructor.email}</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => openEnquiryModal()}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Request Advisory With Mentor</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Left Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Professional Summary / Detailed Bio */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-3">
              <h2 className="text-lg font-display font-bold text-slate-950">
                Professional Summary &amp; Background
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {instructor.detailedBio || instructor.shortBio}
              </p>
            </div>

            {/* Qualifications & Experience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {instructor.qualifications && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Educational Qualifications
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    {instructor.qualifications}
                  </p>
                </div>
              )}

              {instructor.experience && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Industry &amp; Total Experience
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    {instructor.experience} in Advanced Technology Systems
                  </p>
                </div>
              )}
            </div>

            {/* Teaching & Industry Experience Detail Blocks */}
            {(instructor.teachingExperience || instructor.industryExperience) && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5">
                <h2 className="text-lg font-display font-bold text-slate-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Experience Highlights
                </h2>

                <div className="space-y-4">
                  {instructor.industryExperience && (
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-900 block font-display">
                        Industry &amp; Enterprise Experience
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {instructor.industryExperience}
                      </p>
                    </div>
                  )}

                  {instructor.teachingExperience && (
                    <div className="space-y-1 pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-900 block font-display">
                        Teaching &amp; Mentorship Background
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {instructor.teachingExperience}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Research / Projects / Publications */}
            {instructor.projects && instructor.projects.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
                <h2 className="text-lg font-display font-bold text-slate-950 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-purple-600" />
                  Key Projects, Research &amp; Deployments
                </h2>
                <div className="space-y-2.5">
                  {instructor.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>{proj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Courses / Programs Handled */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-display font-bold text-slate-950 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Courses &amp; Programs Taught
              </h3>
              
              {instructor.courses && instructor.courses.length > 0 ? (
                <div className="space-y-2">
                  {instructor.courses.map((courseTitle, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl space-y-1 hover:border-purple-300 transition-colors"
                    >
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {courseTitle}
                      </p>
                      <Link
                        to="/courses"
                        className="text-[11px] text-purple-700 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>View Program Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Curriculum tracks currently in session.</p>
              )}
            </div>

            {/* Areas of Expertise */}
            {instructor.expertise && instructor.expertise.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
                <h3 className="text-sm font-display font-bold text-slate-950 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-600" />
                  Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {instructor.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Certifications */}
            {instructor.certifications && instructor.certifications.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
                <h3 className="text-sm font-display font-bold text-slate-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Professional Certifications
                </h3>
                <div className="space-y-2">
                  {instructor.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70"
                    >
                      <Award className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action Box */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-3">
              <h4 className="text-sm font-bold font-display">Study with {instructor.name}</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Connect with our admissions team to learn more about upcoming batch schedules and curriculum delivery.
              </p>
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="w-full py-2.5 bg-white text-purple-950 hover:bg-purple-50 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>Request Program Advisory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
