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
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Briefcase,
  Loader2,
  Layers,
  Laptop,
  CheckCircle,
  Video,
  FolderGit2,
  GraduationCap,
  Users,
  ArrowRight,
  ExternalLink,
  Headphones
} from 'lucide-react';
import { courses as defaultCourses, COMMON_PROGRAM_FEATURES, normalizeCategoryName } from '../../data/courses';
import { courseService } from '../../services/courseService';
import { instructorService } from '../../services/instructorService';
import type { Course, TechStackGroup, ProjectItem, Instructor } from '../../types';
import { Accordion } from '../../components/ui/Accordion';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';
import { ProjectCardItem } from './ProjectCardItem';

export const CourseDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { openEnquiryModal } = useEnquiry();

  const [course, setCourse] = useState<Course | null>(() => {
    return defaultCourses.find((c) => c.slug === slug || c.id === slug) || null;
  });
  const [loading, setLoading] = useState(!course);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    if (slug) {
      courseService
        .getCourseBySlug(slug)
        .then((fetched) => {
          if (fetched) {
            setCourse(fetched);
          }
        })
        .catch(console.warn)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  useEffect(() => {
    instructorService
      .getInstructors()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllInstructors(data);
        }
      })
      .catch(console.warn);
  }, []);

  // Set up Intersection Observer for active section detection while scrolling
  useEffect(() => {
    const sectionIds = ['overview', 'curriculum', 'projects', 'features', 'instructors', 'faqs'];
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-110px 0px -55% 0px',
      threshold: 0.1
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [course]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

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

  const assignedCategories = Array.from(
    new Set((course.categories || [course.category]).map(normalizeCategoryName).filter(Boolean))
  );
  const isFreeLearning = assignedCategories.some((c) => c === 'Free Learning') || course.price === 0;
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
      title: 'How does the enquiry and admission process work.',
      content: 'Once you submit an enquiry through our website, an EDQOO senior academic advisor contacts you to discuss your career objectives, explain batch schedules and fee structures, and provide sample syllabus materials.'
    },
    {
      id: 'faq-2',
      title: 'Is this program suitable for working professionals or career transitioners.',
      content: 'Yes. Our programs feature interactive live sessions, flexible scheduling, self-paced learning resources, and dedicated 1:1 mentor support tailored for both working professionals and learners entering the domain.'
    },
    {
      id: 'faq-3',
      title: 'What certification and placement assistance are provided.',
      content: 'Learners receive the theccpeeps Certification upon successful completion, and qualify for 3 Guaranteed Job Interviews upon movement to the Placement Pool.'
    },
    {
      id: 'faq-4',
      title: 'Are all 15 program features included with this course.',
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

  // Helper for project category badge styles
  const getCategoryBadgeClass = (category?: string) => {
    if (!category) return 'bg-purple-50 text-purple-900 border-purple-200';
    const upper = category.toUpperCase().trim();
    switch (upper) {
      case 'AMAZON':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'NETFLIX':
        return 'bg-rose-50 text-rose-900 border-rose-300';
      case 'EV':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case 'AI':
        return 'bg-purple-50 text-purple-900 border-purple-300';
      case 'MEDICAL AI':
        return 'bg-cyan-50 text-cyan-900 border-cyan-300';
      case 'LEGAL AI':
        return 'bg-indigo-50 text-indigo-900 border-indigo-300';
      case 'NLP AI':
        return 'bg-blue-50 text-blue-900 border-blue-300';
      default:
        return 'bg-purple-50 text-purple-900 border-purple-200';
    }
  };

  const isDataScienceAndAiTrack =
    course.id.includes('data-science') ||
    course.slug.includes('data-science') ||
    assignedCategories.some((c) => c.toLowerCase().includes('data science') || c.toLowerCase().includes('ai'));

  // Filter or fall back to relevant instructors
  const relevantInstructors = allInstructors.filter((inst) => {
    if (inst.courses && inst.courses.length > 0) {
      return inst.courses.some((cName) =>
        cName.toLowerCase().includes(course.title.toLowerCase()) ||
        course.title.toLowerCase().includes(cName.toLowerCase()) ||
        assignedCategories.some((cat) => cName.toLowerCase().includes(cat.toLowerCase()))
      );
    }
    return true;
  });

  const displayInstructors = relevantInstructors.length > 0 ? relevantInstructors.slice(0, 3) : allInstructors.slice(0, 3);

  const navSections = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: `Curriculum (${course.curriculum?.length || course.modules?.length || 0})` },
    { id: 'projects', label: `Projects (${course.projects?.length || 0})` },
    { id: 'features', label: ' Core Features' },
    { id: 'instructors', label: 'Faculty' },
    { id: 'faqs', label: 'Admissions FAQ' }
  ];

  return (
    <div className="bg-slate-50/70 min-h-screen text-left">
      <SEO 
        title={`${course.title} - Data Science & AI Projects, Curriculum & Admissions | Edqoo`}
        description={`${course.description} Work on practical Data Science Projects, Artificial Intelligence Projects, Machine Learning Projects, Data Analytics Projects, Generative AI Projects, and NLP Projects.`}
        canonical={`/courses/${course.slug}`}
        ogImage={course.image}
      />

      {/* 1. Course Program Hero Banner */}
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
                  cat === 'Free Learning'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : cat === 'Tools and Upskills'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-purple-50 text-purple-800 border-purple-300'
                }`}
              >
                {cat}
              </span>
            ))}
            {isFreeLearning && (
              <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-emerald-600 text-white shadow-xs uppercase tracking-wider">
                FREE
              </span>
            )}
            {course.liveHours && (
              <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-slate-900 text-white shadow-xs">
                {course.liveHours} Live Learning
              </span>
            )}
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

      {/* 2. Sticky Section Navigation Bar */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Program sections" className="flex items-center justify-between gap-4 py-1.5">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none whitespace-nowrap py-1">
              {navSections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-[13px] font-bold rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-purple-600 hover:bg-slate-100/80'
                    }`}
                  >
                    {sec.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Enquire CTA on wide screens */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() =>
                  openEnquiryModal(course.title, {
                    category: isFreeLearning ? 'Free Learning' : course.category,
                    courseId: course.id,
                    categories: course.categories
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.98] rounded-lg transition-all shadow-2xs cursor-pointer"
              >
                {isFreeLearning ? (
                  <>
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Enquire Now</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Enquire Now</span>
                  </>
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* 3. Main Continuous Long-Form Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Continuous Sections (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Section 1: Program Overview */}
          <section id="overview" className="scroll-mt-32 sm:scroll-mt-36 space-y-6 text-left">
            <div className="border-b border-slate-200 pb-3">
              
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950">
                Program Overview & Competencies
              </h2>
            </div>

            {/* Key Skills & Competencies */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900">
                Key Skills &amp; Competencies You Will Build
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
                  PROGRAM OUTCOME &amp; INDUSTRY IMPACT
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
                  Career Readiness &amp; Professional Mentorship
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

            {/* Target Audience & Prerequisites Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Who Is It For */}
              {course.whoIsItFor && course.whoIsItFor.length > 0 && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-3">
                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    Target Audience &amp; Eligibility
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

              {/* Requirements & Hardware Prerequisites */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-3">
                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    Requirements &amp; Prerequisites
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
          </section>

          {/* Section 2: Curriculum Structure */}
          <section id="curriculum" className="scroll-mt-32 sm:scroll-mt-36 space-y-4 text-left">
            <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                
                <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950">
                  Curriculum Structure &amp; Modules
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed breakdown of topics, practical sessions, and live laboratory exercises.
                </p>
              </div>
              {course.liveHours && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-extrabold rounded-lg">
                  {course.liveHours} Live Guided
                </span>
              )}
            </div>

            {curriculumItems.length > 0 ? (
              <Accordion items={curriculumItems} allowMultiple={false} defaultOpenId={curriculumItems[0]?.id} />
            ) : (
              <p className="text-xs text-slate-500">Curriculum details are being finalized for the upcoming cohort.</p>
            )}
          </section>

          {/* Section 3: Projects & Practical Portfolio */}
          <section id="projects" className="scroll-mt-32 sm:scroll-mt-36 space-y-8 text-left">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 via-slate-50 to-indigo-50/40 border border-purple-200/80 p-6 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-purple-700 font-extrabold text-xs uppercase tracking-widest">
                <FolderGit2 className="w-4 h-4 text-purple-600" />
                <span>PRACTICAL PORTFOLIO</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950">
                {isDataScienceAndAiTrack ? 'Data Science & AI Capstone Projects' : `${course.title} Capstones`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                Work on practical, industry-oriented projects designed to strengthen your portfolio in Data Science, Artificial Intelligence, Machine Learning, NLP, Data Analytics, and Generative AI.
              </p>
            </div>

            {/* Projects Grid */}
            {course.projects && course.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {course.projects.map((proj, pIdx) => {
                  const isObj = typeof proj === 'object' && proj !== null && 'title' in proj;
                  const projectItem = isObj ? (proj as ProjectItem) : null;

                  if (projectItem) {
                    return (
                      <ProjectCardItem
                        key={projectItem.id || `proj-${pIdx}`}
                        projectItem={projectItem}
                        getCategoryBadgeClass={getCategoryBadgeClass}
                      />
                    );
                  }

                  // Fallback for simple string-based projects
                  return (
                    <div
                      key={pIdx}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex items-start gap-3 text-left"
                    >
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{String(proj)}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Practical project assignment with mentor guidance.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-2">
                <Laptop className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">Project listings are updated as curriculum progresses.</p>
              </div>
            )}

            {/* Technology Stack & Tooling Section */}
            {techStackList.length > 0 && (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  Comprehensive Technology Stack &amp; Tooling
                </h3>
                <div className="space-y-4 pt-1">
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
          </section>

          {/* Section 4: 15 Core Features */}
          <section id="features" className="scroll-mt-32 sm:scroll-mt-36 space-y-6 text-left">
            <div className="border-b border-slate-200 pb-3">
              
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950">
                Core Features Are Guaranteed Across Every Program
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every learner enrolled in this track receives the full institutional learning and placement suite.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </section>

          {/* Section 5: Instructors & Faculty */}
          <section id="instructors" className="scroll-mt-32 sm:scroll-mt-36 space-y-6 text-left">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                
                <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950">
                  Program Faculty &amp; Industry Mentors
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Learn directly from experienced practitioners with deep industry and academic credentials.
                </p>
              </div>
              <Link
                to="/instructors"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700"
              >
                <span>All Faculty</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {displayInstructors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {displayInstructors.map((inst) => (
                  <div
                    key={inst.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between space-y-4 text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={inst.profileImage || inst.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                          alt={inst.name}
                          className="w-14 h-14 rounded-xl object-cover border border-purple-200 shadow-2xs"
                        />
                        <div>
                          <h4 className="font-display font-bold text-base text-slate-950 leading-tight">
                            {inst.name}
                          </h4>
                          <p className="text-xs font-semibold text-purple-700 mt-0.5">
                            {inst.role || inst.designation}
                          </p>
                          {inst.organization && (
                            <p className="text-[11px] text-slate-500">{inst.organization}</p>
                          )}
                        </div>
                      </div>

                      {inst.shortBio && (
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {inst.shortBio}
                        </p>
                      )}

                      {inst.expertise && inst.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {inst.expertise.slice(0, 4).map((exp, eIdx) => (
                            <span
                              key={eIdx}
                              className="px-2 py-0.5 bg-purple-50 border border-purple-100 text-purple-800 text-[10px] font-bold rounded-md"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">
                        Experience: {inst.experience || '8+ Years'}
                      </span>
                      <Link
                        to={`/instructors/${inst.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800"
                      >
                        <span>View Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-2">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">Faculty mentors will be assigned prior to batch launch.</p>
              </div>
            )}
          </section>

          {/* Section 6: Admissions FAQ */}
          <section id="faqs" className="scroll-mt-32 sm:scroll-mt-36 space-y-4 text-left">
            <div className="border-b border-slate-200 pb-3">
            
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-purple-600" />
                Admissions &amp; Enrollment FAQs
              </h2>
            </div>
            <Accordion items={faqItems} allowMultiple={true} />
          </section>

          {/* Section 7: Final Program CTA Card */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-display font-black">
              Ready to Advance Your Career with {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto leading-relaxed">
              Connect with an EDQOO senior academic advisor to explore scholarship grants, flexible installment options, and schedule a 1:1 syllabus walkthrough.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  openEnquiryModal(course.title, {
                    category: isFreeLearning ? 'Free Learning' : course.category,
                    courseId: course.id,
                    categories: course.categories
                  })
                }
                className="px-6 py-3 text-xs sm:text-sm font-bold bg-white text-purple-900 hover:bg-purple-50 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                {isFreeLearning ? (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Enquire Now</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Enquire Now / Talk to Advisor</span>
                  </>
                )}
              </button>
              <Link
                to="/courses"
                className="px-6 py-3 text-xs sm:text-sm font-bold bg-purple-800/80 hover:bg-purple-800 text-white rounded-xl border border-purple-700/60 transition-all"
              >
                Compare Other Tracks
              </Link>
            </div>
          </div>

        </div>

        {/* Right Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-28 sm:top-32 space-y-4">
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
                {isFreeLearning ? 'Program Access' : 'Standard Program Fee'}
              </span>
              {isFreeLearning ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-md">
                    100% Free Learning
                  </span>
                </div>
              ) : null}
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                {isFreeLearning
                  ? '*Free educational access to foundational learning content.'
                  : '*Flexible installment & scholarship options discussed during counseling.'}
              </span>
            </div>

            {/* Primary CTA */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() =>
                  openEnquiryModal(course.title, {
                    category: isFreeLearning ? 'Free Learning' : course.category,
                    courseId: course.id,
                    categories: course.categories
                  })
                }
                className="btn-primary w-full py-3.5 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 hover:shadow-lg transition-all cursor-pointer"
              >
                {isFreeLearning ? (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Enquire Now</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Enquire Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Key Program Highlights Checklist */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                Key Program Highlights:
              </span>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Learn from NIT Faculty &amp; Industry Practitioners</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>218+ Hours of Self-Paced Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>100+ Live Learning Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>50+ Industry Projects &amp; Case Studies</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>24×7 Learning Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>3 Guaranteed Job Interviews</span>
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