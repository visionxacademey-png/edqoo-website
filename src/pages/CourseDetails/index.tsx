import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  BookOpen,
  User,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Briefcase,
  Loader2,
  Layers,
  Award,
  Laptop,
  CheckCircle,
  Video
} from 'lucide-react';
import { courses as defaultCourses, COMMON_PROGRAM_FEATURES } from '../../data/courses';
import { courseService } from '../../services/courseService';
import type { Course, TechStackGroup } from '../../types';
import { Accordion } from '../../components/ui/Accordion';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

export const CourseDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { openEnquiryModal } = useEnquiry();

  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'features' | 'projects' | 'faqs'>('overview');
  const [course, setCourse] = useState<Course | null>(() => {
    return defaultCourses.find((c) => c.slug === slug || c.id === slug) || null;
  });
  const [loading, setLoading] = useState(!course);

  useEffect(() => {
    if (slug) {
      courseService.getCourseBySlug(slug).then((fetched) => {
        if (fetched) {
          setCourse(fetched);
        }
      }).catch(console.warn).finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
        <span className="text-xs text-slate-400 font-semibold uppercase">Loading Program...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-display font-bold text-slate-900">Program Not Found</h2>
        <p className="text-xs text-slate-500">The requested track may have been migrated or updated.</p>
        <Link to="/courses" className="btn-primary px-4 py-2 text-xs font-bold rounded-lg inline-block">
          Explore All Programs
        </Link>
      </div>
    );
  }

  const assignedCategories = course.categories || [course.category];
  const programFeatures = course.features && course.features.length > 0 ? course.features : COMMON_PROGRAM_FEATURES;

  // Curriculum accordion data
  const curriculumItems = (course.curriculum && course.curriculum.length > 0)
    ? course.curriculum.map((section, idx) => ({
        id: `curric-${idx + 1}`,
        title: `${section.title} (${section.topics.length} Key Topics)`,
        content: (
          <div className="space-y-2 pt-1 pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {section.topics.map((topic, tIdx) => (
                <div
                  key={tIdx}
                  className="flex items-start gap-2.5 text-xs py-2 px-3 rounded-lg bg-slate-50 border border-slate-200/60"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold text-slate-800">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }))
    : (course.modules || []).map((module) => ({
        id: `mod-${module.id}`,
        title: `${module.title} (${module.lessons.length} Sessions / Labs)`,
        content: (
          <div className="space-y-2 pt-1 pb-2">
            {module.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between text-xs py-2 px-3.5 rounded-lg bg-slate-50 border border-slate-200/60"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-semibold text-slate-800">{lesson.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{lesson.duration}</span>
              </div>
            ))}
          </div>
        )
      }));

  // FAQ items
  const faqItems = [
    {
      id: 'faq-1',
      title: 'How does the enquiry and admission process work?',
      content: 'Once you submit an enquiry through our website, an EDQOO senior academic advisor contacts you to discuss your career objectives, explain batch schedules and fee structures, and provide sample syllabus materials.'
    },
    {
      id: 'faq-2',
      title: 'Is this program suitable for working professionals or career transitioners?',
      content: 'Yes. Our programs feature interactive live sessions, flexible scheduling, self-paced learning resources, and dedicated 1:1 mentor support tailored for both working professionals and learners entering the domain.'
    },
    {
      id: 'faq-3',
      title: 'What certification and placement assistance are provided?',
      content: 'Learners receive the theccpeeps Certification upon successful completion, and qualify for 3 Guaranteed Job Interviews upon movement to the Placement Pool.'
    },
    {
      id: 'faq-4',
      title: 'Are all 15 program features included with this course?',
      content: 'Yes! Every course includes all 15 core features including Live Interactive Classes, LMS access, Campus Immersion, Dedicated Mentorship, Placement Assistance, Capstone Projects, and rewards for top performers.'
    }
  ].map((faq) => ({
    id: faq.id,
    title: faq.title,
    content: <p className="text-xs leading-relaxed text-slate-600">{faq.content}</p>
  }));

  // Normalized Tech Stack
  const techStackList: TechStackGroup[] = Array.isArray(course.technologyStack)
    ? (course.technologyStack as any).map((item: any) => {
        if (typeof item === 'object' && item.category && item.skills) {
          return item;
        }
        return { category: 'Core Technologies', skills: Array.isArray(item) ? item : [String(item)] };
      })
    : [];

  return (
    <div className="bg-slate-50/70 min-h-screen text-left">
      <SEO 
        title={`${course.title} - Curriculum, Projects & Enquiry | Edqoo`}
        description={course.description}
        canonical={`/courses/${course.slug}`}
        ogImage={course.image}
      />

      {/* Course Details Header Banner */}
      <section className="bg-gradient-to-b from-purple-50/70 via-slate-50 to-white text-slate-950 py-10 sm:py-14 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <Link to="/courses" className="hover:text-purple-600 transition-colors">Program Tracks</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-purple-700 font-bold">{assignedCategories.join(' • ')}</span>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {assignedCategories.map((cat) => (
              <span
                key={cat}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                  cat === 'Tools and Upskills'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-purple-50 text-purple-800 border-purple-300'
                }`}
              >
                {cat}
              </span>
            ))}
            {course.liveHours && (
              <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-slate-900 text-white shadow-xs">
                {course.liveHours} Live Learning
              </span>
            )}
            {/* <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center gap-1 shadow-2xs">
              <BadgeCheck className="w-3.5 h-3.5 text-purple-600" />
              theccpeeps Certified
            </span> */}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-slate-950 leading-tight max-w-3xl">
            {course.title}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
            {course.description}
          </p>

          {/* Quick stats indicators */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span className="text-slate-950 font-bold">{course.rating}</span> ({course.students} Learners Enrolled)
            </span>
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Clock className="w-4 h-4 text-purple-600" />
              Duration: {course.duration}
            </span>
            {course.liveHours && (
              <span className="flex items-center gap-1.5 font-bold text-purple-700">
                <Video className="w-4 h-4 text-purple-600" />
                Live Hours: {course.liveHours}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-600" />
              Level: {course.level}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 overflow-x-auto pb-1 text-xs sm:text-sm font-bold text-slate-500 scrollbar-none">
            {[
              { id: 'overview', label: 'Program Overview' },
              { id: 'curriculum', label: `Curriculum (${course.curriculum?.length || course.modules?.length || 0} Modules)` },
              { id: 'features', label: '15 Common Features' },
              { id: 'projects', label: 'Projects & Stack' },
              { id: 'faqs', label: 'Admissions FAQ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600 font-extrabold'
                    : 'border-transparent hover:text-purple-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-left">
              {/* Key Competencies */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Key Skills & Competencies You Will Build
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {course.skills.map((skill) => (
                    <div key={skill} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Outcome Banner */}
              {course.outcome && (
                <div className="bg-gradient-to-r from-purple-50 via-indigo-50/40 to-purple-50 border border-purple-200 p-6 rounded-2xl shadow-2xs space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 block">
                    PROGRAM OUTCOME
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {course.outcome}
                  </p>
                </div>
              )}

              {/* Career Readiness */}
              {course.careerReadiness && course.careerReadiness.length > 0 && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
                  <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    Career Readiness & Professional Mentorship
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {course.careerReadiness.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-slate-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Who Is It For */}
              {course.whoIsItFor && course.whoIsItFor.length > 0 && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
                  <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Target Audience & Eligibility
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {course.whoIsItFor.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
                  <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    Requirements & Hardware Prerequisites
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {course.requirements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab: Curriculum */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Curriculum Structure & Learning Modules
                  </h3>
                  <p className="text-xs text-slate-500">
                    Expand modules below to review detailed topic breakdowns.
                  </p>
                </div>
                {course.liveHours && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-extrabold rounded-lg">
                    {course.liveHours} Live
                  </span>
                )}
              </div>
              {curriculumItems.length > 0 ? (
                <Accordion items={curriculumItems} allowMultiple={false} defaultOpenId={curriculumItems[0]?.id} />
              ) : (
                <p className="text-xs text-slate-500">Curriculum details are being finalized for the upcoming batch.</p>
              )}
            </div>
          )}

          {/* Tab: 15 Common Features */}
          {activeTab === 'features' && (
            <div className="space-y-6 text-left">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">
                    STANDARD EDQOO LEARNING ADVANTAGE
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    15 Core Features Guaranteed Across Every Program
                  </h3>
                  <p className="text-xs text-slate-500">
                    Every learner enrolled in this program receives the full suite of institutional and career benefits.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {programFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3 hover:border-purple-300 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-800 leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Projects & Tech Stack */}
          {activeTab === 'projects' && (
            <div className="space-y-6 text-left">
              {/* Technology Stack */}
              {techStackList.length > 0 && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
                  <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-600" />
                    Technology Stack & Tooling
                  </h3>
                  <div className="space-y-3.5 pt-1">
                    {techStackList.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-1.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                          {group.category}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {group.skills.map((tool) => (
                            <span
                              key={tool}
                              className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold shadow-2xs"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hands-on Projects */}
              {course.projects && course.projects.length > 0 && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
                  <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-purple-600" />
                    Hands-on Projects & Capstone Portfolios
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {course.projects.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs font-semibold text-slate-800">{proj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 text-left">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-slate-400" />
                Admissions & Enrollment FAQs
              </h3>
              <Accordion items={faqItems} allowMultiple={true} />
            </div>
          )}

        </div>

        {/* Right Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-5 text-left">
            
            {/* Image Preview */}
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Course Program Fee Details */}
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider block">
                Standard Program Fee
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-display font-black text-slate-900">
                  ₹{course.price}
                </span>
                {course.originalPrice > 0 && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{course.originalPrice}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                *Flexible installment & scholarship options discussed during counseling.
              </span>
            </div>

            {/* Primary CTA */}
            <div className="space-y-2.5">
              <button
                onClick={() =>
                  openEnquiryModal(course.title, {
                    category: course.category,
                    courseId: course.id,
                    categories: course.categories
                  })
                }
                className="btn-primary w-full py-3.5 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 hover:shadow-lg transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Enquire Now</span>
              </button>
            </div>

            {/* Key Program Highlights Checklist */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                Key Program Highlights:
              </span>
              {/* <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Learn from NIT Faculty & Industry Practitioners</span>
              </div> */}
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>AI Powered LMS & Dedicated Mentor Support</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>theccpeeps Certification</span>
              </div> */}
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Top 2 Performers Rewarded & Incubation</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>3 Guaranteed Job Interviews upon Placement Pool</span>
              </div>
            </div>

            {/* WhatsApp Quick Chat */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Have quick questions?</span>
              <a
                href="https://wa.me/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Advisor</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};