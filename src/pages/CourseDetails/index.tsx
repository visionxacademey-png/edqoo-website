import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  BookOpen,
  User,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Award,
  FileCheck,
  Sparkles,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { courses } from '../../data/courses';
import { Accordion } from '../../components/ui/Accordion';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

export const CourseDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { openEnquiryModal } = useEnquiry();

  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'faqs'>('overview');

  // Find course matching slug
  const course = courses.find((c) => c.slug === slug);

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

  // Instructor profile
  const instructor = {
    name: 'Dr. Evelyn Reed',
    role: 'Lead Security Systems Architect & Faculty',
    bio: 'Former Fortune 500 Infrastructure Lead with 14+ years of practical enterprise deployment and cybersecurity defense experience.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    expertise: ['Threat Modeling', 'Zero-Trust Architecture', 'Cloud Governance', 'SOC Operations']
  };

  // Curriculum accordion data
  const curriculumItems = (course.modules || []).map((module) => ({
    id: `mod-${module.id}`,
    title: `${module.title} (${module.lessons.length} Modules / Labs)`,
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
      content: 'Once you submit an enquiry through our website, an EDQOO senior academic advisor contacts you to understand your career objectives, explain batch schedules and fee structures, and provide sample syllabus materials.'
    },
    {
      id: 'faq-2',
      title: 'Is this program suitable for complete beginners or career switchers?',
      content: 'Yes. Both Cybersecurity and Data Science certificate programs begin with foundational fundamentals including command lines, scripting, and practical setups before advancing to complex labs.'
    },
    {
      id: 'faq-3',
      title: 'What mode of training is available?',
      content: 'We offer live interactive online batches as well as self-paced schedules with 1-on-1 mentor guidance and live doubt clearing sessions.'
    },
    {
      id: 'faq-4',
      title: 'Are corporate or group training discounts available?',
      content: 'Yes. Custom batch timings and group training packages are available for engineering teams and university groups. Please mention your group size in the enquiry form.'
    }
  ].map((faq) => ({
    id: faq.id,
    title: faq.title,
    content: <p className="text-xs leading-relaxed text-slate-600">{faq.content}</p>
  }));

  return (
    <div className="bg-slate-50/70 min-h-screen text-left">
      <SEO 
        title={`${course.title} - Course Details & Enquiry`}
        description={course.description}
        canonical={`/courses/${course.slug}`}
        ogImage={course.image}
      />

      {/* Course Details Header Banner */}
      <section className="bg-gradient-to-b from-purple-50/60 via-slate-50 to-white text-slate-950 py-12 sm:py-16 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <Link to="/courses" className="hover:text-purple-600 transition-colors">Programs</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-purple-700 font-bold">{course.category}</span>
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
              <span className="text-slate-950 font-bold">{course.rating}</span> ({course.students} Learners Enquired)
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-600" />
              {course.lessons} Practical Modules
            </span>
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
          <div className="flex border-b border-slate-200 gap-6 overflow-x-auto pb-1 text-xs sm:text-sm font-bold text-slate-500">
            {[
              { id: 'overview', label: 'Program Overview' },
              { id: 'curriculum', label: 'Curriculum & Modules' },
              { id: 'instructor', label: 'Faculty & Mentors' },
              { id: 'faqs', label: 'Admissions FAQ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {course.skills.map((skill) => (
                    <div key={skill} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who Is It For */}
              {course.whoIsItFor && (
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
              {course.requirements && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
                  <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    Requirements & Equipment
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
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Curriculum Structure ({course.modules?.length || 0} Comprehensive Modules)
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {course.lessons} Total Sessions & Labs
                </span>
              </div>
              {curriculumItems.length > 0 ? (
                <Accordion items={curriculumItems} allowMultiple={false} />
              ) : (
                <p className="text-xs text-slate-500">Curriculum details are being finalized for the upcoming batch.</p>
              )}
            </div>
          )}

          {/* Tab: Instructor */}
          {activeTab === 'instructor' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4 text-left">
              <div className="flex items-center gap-4">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">{instructor.name}</h3>
                  <p className="text-xs font-semibold text-purple-600">{instructor.role}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {instructor.bio}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {instructor.expertise.map((exp: string) => (
                  <span key={exp} className="px-2 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-bold rounded">
                    {exp}
                  </span>
                ))}
              </div>
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
                Standard Course Fee
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

            {/* Primary & Secondary Enquiry CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={() => openEnquiryModal(course.title)}
                className="btn-primary w-full py-3.5 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Enquire Now</span>
              </button>

              {/* <button
                onClick={() => openEnquiryModal(course.title)}
                className="btn-secondary w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <span>Request Course Details</span>
              </button> */}
            </div>

            {/* What's Included Checklist */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                Program Highlights:
              </span>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>{course.lessons} Comprehensive Hands-on Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Curated Lab Notebooks & Cheat Sheets</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Industry-Recognized Certification Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>1:1 Career Counseling & Resume Review</span>
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