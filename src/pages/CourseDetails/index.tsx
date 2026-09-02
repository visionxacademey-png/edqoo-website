import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  Star,
  CheckCircle2,
  ChevronRight,
  Award,
  ArrowRight,
  User,
  Play,
  PhoneCall,
  ShieldCheck,
  HelpCircle,
  MessageCircle,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { courses } from '../../data/courses';
import { instructors } from '../../data/instructors';
import { Accordion } from '../../components/ui/Accordion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useEnquiry } from '../../context/EnquiryContext';
import { SEO } from '../../components/common/SEO';

export const CourseDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { isEnrolled } = useAuth();
  const { openEnquiryModal } = useEnquiry();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'faqs'>('overview');

  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-deep-navy-900 font-display">Course Not Found</h2>
        <p className="text-xs text-slate-500">The requested course program does not exist or has been relocated.</p>
        <Link to="/courses" className="btn-primary px-5 py-2.5 text-xs font-bold rounded-lg shadow">
          Back to Courses
        </Link>
      </div>
    );
  }

  const instructor = instructors[course.id === 'cybersecurity' ? 0 : 1] || instructors[0];
  const userEnrolled = isEnrolled(course.id);

  // Handle Enrollment navigation
  const handleEnrollment = () => {
    if (userEnrolled) {
      navigate('/dashboard/my-courses');
      return;
    }

    if (isInCart(course.id)) {
      navigate(`/checkout/${course.id}`);
    } else {
      addToCart({
        courseId: course.id,
        title: course.title,
        price: course.price,
        image: course.image,
        slug: course.slug
      });
      navigate(`/checkout/${course.id}`);
    }
  };

  // Convert Curriculum Modules to Accordion Schema
  const curriculumItems = (course.modules || []).map((mod) => ({
    id: mod.id,
    title: mod.title,
    subtitle: `${mod.lessons.length} Lessons`,
    content: (
      <ul className="space-y-2 text-xs text-slate-600">
        {mod.lessons.map((lesson) => (
          <li key={lesson.id} className="flex items-center justify-between py-2 border-b border-deep-navy-100 last:border-0">
            <span className="flex items-center gap-2 text-left">
              <Play className="w-3.5 h-3.5 text-royal-blue-600 flex-shrink-0" />
              <span className="font-semibold text-deep-navy-900">{lesson.title}</span>
            </span>
            <div className="flex items-center gap-2.5">
              {lesson.isPreview && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase tracking-wider">
                  Preview
                </span>
              )}
              <span className="text-[10px] text-slate-400 font-mono">{lesson.duration}</span>
            </div>
          </li>
        ))}
      </ul>
    )
  }));

  // FAQ mock items
  const faqItems = [
    {
      id: 'faq-1',
      title: 'Is this program suitable for complete beginners?',
      content: 'Yes. Both Cybersecurity and Data Science Certificate programs start from core foundations. No prior coding or systems administration history is required. We teach Linux command lines, Python syntax, and database query setups in the initial modules.'
    },
    {
      id: 'faq-2',
      title: 'Do I get a verifiable certificate upon completion?',
      content: 'Absolutely. Once you finish all lesson modules, submit the practical lab assignments, and complete the Capstone audit program, you earn a verifiable digital Edqoo Certificate of Completion to showcase on LinkedIn or your resume.'
    },
    {
      id: 'faq-3',
      title: 'Are the labs simulated or based on real tools?',
      content: 'The labs are designed to run in realistic environment configurations using standard industry tools (Wireshark, Nmap, Nessus, Splunk, Python Pandas, Scikit-Learn) to simulate production tasks.'
    },
    {
      id: 'faq-4',
      title: 'How long do I maintain access to the materials?',
      content: 'You receive lifetime access to all enrolled course videos, syllabus code files, resources, cheat sheets, and future curriculum patch updates.'
    }
  ].map((faq) => ({
    id: faq.id,
    title: faq.title,
    content: <p className="text-xs leading-relaxed text-slate-500">{faq.content}</p>
  }));

  return (
    <div className="bg-deep-navy-50/50 min-h-screen text-left">
      <SEO 
        title={course.title}
        description={course.description}
        canonical={`/courses/${course.slug}`}
        ogImage={course.image}
      />

      {/* Course Details Header Banner */}
      <section className="bg-deep-navy-950 text-white py-12 sm:py-16 border-b border-deep-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            <Link to="/courses" className="hover:text-white transition-colors">Programs</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-royal-blue-300">{course.category}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white leading-tight max-w-3xl">
            {course.title}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {course.description}
          </p>

          {/* Quick stats indicators */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="text-white font-bold">{course.rating}</span> ({course.students} Learners)
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-400" />
              {course.lessons} Lessons
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              Level: {course.level}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout (Grid: Left Content (8) vs Right Sticky Sidebar (4)) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-deep-navy-200 gap-6 overflow-x-auto pb-1 text-xs sm:text-sm font-bold text-slate-500">
            {[
              { id: 'overview', label: 'Program Overview' },
              { id: 'curriculum', label: 'Curriculum & Labs' },
              { id: 'instructor', label: 'Mentor Profile' },
              { id: 'faqs', label: 'Admissions FAQ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-royal-blue-600 text-royal-blue-600 font-extrabold'
                    : 'border-transparent hover:text-royal-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-left">
              {/* What You'll Learn section */}
              <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-2xs space-y-4">
                <h3 className="font-display font-bold text-base text-deep-navy-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-royal-blue-600" />
                  Key Skills & Competencies You Will Build
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {course.skills.map((skill) => (
                    <div key={skill} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-semibold text-deep-navy-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who Is It For */}
              {course.whoIsItFor && (
                <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-2xs space-y-4">
                  <h3 className="font-display font-bold text-base text-deep-navy-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-royal-blue-600" />
                    Target Audience & Eligibility
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {course.whoIsItFor.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-royal-blue-600 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {course.requirements && (
                <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-2xs space-y-4">
                  <h3 className="font-display font-bold text-base text-deep-navy-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-royal-blue-600" />
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
                <h3 className="font-display font-bold text-base text-deep-navy-900">
                  Curriculum Breakdown ({course.modules?.length || 0} Modules)
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {course.lessons} Lessons Total
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
            <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-2xs space-y-4 text-left">
              <div className="flex items-center gap-4">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-16 h-16 rounded-xl object-cover border border-deep-navy-200"
                />
                <div>
                  <h3 className="font-display font-bold text-base text-deep-navy-900">{instructor.name}</h3>
                  <p className="text-xs font-semibold text-royal-blue-600">{instructor.role}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {instructor.bio}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {instructor.expertise.map((exp) => (
                  <span key={exp} className="px-2 py-0.5 bg-deep-navy-50 text-deep-navy-800 text-[10px] font-bold rounded">
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tab: FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 text-left">
              <h3 className="font-display font-bold text-base text-deep-navy-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-slate-400" />
                Frequently Asked Questions
              </h3>
              <Accordion items={faqItems} allowMultiple={true} />
            </div>
          )}

        </div>

        {/* Right Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white border border-deep-navy-200 rounded-2xl p-6 shadow-md space-y-5 text-left">
            
            {/* Image Preview */}
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-deep-navy-100 border border-deep-navy-200">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Pricing Details */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-display font-extrabold text-deep-navy-900">
                  ₹{course.price}
                </span>
                {course.originalPrice > 0 && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{course.originalPrice}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                Includes Lifetime Access & Certificate
              </span>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              {userEnrolled ? (
                <button
                  onClick={() => navigate('/dashboard/my-courses')}
                  className="btn-primary w-full py-3 text-xs font-bold rounded-xl shadow-md"
                >
                  Continue Learning
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openEnquiryModal(course.title)}
                    className="btn-primary w-full py-3 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Enquire for Admission</span>
                  </button>

                  <button
                    onClick={handleEnrollment}
                    className="btn-secondary w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <span>Instant Enroll</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* What's Included Checklist */}
            <div className="pt-4 border-t border-deep-navy-100 space-y-2.5 text-xs text-slate-600">
              <span className="font-bold text-deep-navy-900 block text-[11px] uppercase tracking-wider">
                This Program Includes:
              </span>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-royal-blue-600 flex-shrink-0" />
                <span>{course.lessons} Practical Video Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-royal-blue-600 flex-shrink-0" />
                <span>Downloadable Lab Files & Notebooks</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-royal-blue-600 flex-shrink-0" />
                <span>Verifiable Certificate of Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-royal-blue-600 flex-shrink-0" />
                <span>Lifetime Access Across All Devices</span>
              </div>
            </div>

            {/* Secondary WhatsApp option */}
            <div className="pt-3 border-t border-deep-navy-100 flex items-center justify-between text-xs text-slate-500">
              <span>Have quick questions?</span>
              <a
                href="https://wa.me/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};