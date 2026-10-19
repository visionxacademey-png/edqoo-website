import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  BookOpen,
  User,
  CheckCircle2,
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
  ArrowRight,
  Headphones
} from 'lucide-react';
import { COMMON_PROGRAM_FEATURES, normalizeCategoryName } from '../../data/courses';
import { courseService } from '../../services/courseService';
import { instructorService } from '../../services/instructorService';
import type { Course, TechStackGroup, ProjectItem, Instructor, CourseFeatureItem } from '../../types';
import { Accordion } from '../../components/ui/Accordion';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';
import { ProjectCardItem } from './ProjectCardItem';

import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { getCacheBustedImageUrl, DEFAULT_ENGLISH_COURSE_FALLBACK } from '../../utils/imageUrl';
import { LittleMirrorsShowcase } from '../../components/englishMirror/LittleMirrorsShowcase';
import { CorporateEnglishShowcase } from '../../components/englishMirror/CorporateEnglishShowcase';
import { ExecutiveInterviewShowcase } from '../../components/englishMirror/ExecutiveInterviewShowcase';
import { IeltsIntensiveShowcase } from '../../components/englishMirror/IeltsIntensiveShowcase';

export const CourseDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { openEnquiryModal } = useEnquiry();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    courseService
      .getCourses()
      .then((data) => {
        if (Array.isArray(data)) {
          setAllCourses(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load courses list:', err);
      });
  }, []);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      courseService
        .getCourseBySlug(slug)
        .then((fetched) => {
          if (fetched) {
            setCourse(fetched);
          } else {
            setCourse(null);
          }
        })
        .catch((err) => {
          console.warn('Failed to fetch course details from backend:', err);
        })
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
    const sectionIds = ['overview', 'curriculum', 'projects', 'features', 'faqs'];
    
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
        <Loader2 className="w-8 h-8 text-[#6D22B5] animate-spin mb-2" />
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

  const primaryCategory = assignedCategories[0] || 'Data Science and AI';
  const primaryCategorySlug = primaryCategory.toLowerCase().replace(/\s+/g, '-');

  const seoTitle = course.seoTitle || `${course.title} | Online Course | Edqoo`;
  const seoDescription =
    course.seoDescription ||
    (course.shortDescription
      ? `${course.shortDescription} Learn with practical projects and expert mentorship on Edqoo.`
      : `Learn ${course.title} through practical lessons, projects and industry-focused training with Edqoo.`);

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Courses', url: '/courses' },
    { name: primaryCategory, url: `/programs/${primaryCategorySlug}` },
    { name: course.title, url: `/courses/${course.slug}` }
  ];

  const rawCourseFaqs = [
    {
      question: 'How does the enquiry and admission process work?',
      answer: 'Once you submit an enquiry through our website, an Edqoo senior academic advisor contacts you to discuss your career objectives, explain batch schedules and fee structures, and provide sample syllabus materials.'
    },
    {
      question: 'Is this program suitable for working professionals or career transitioners?',
      answer: 'Yes. Our programs feature interactive live sessions, flexible scheduling, self-paced learning resources, and dedicated 1:1 mentor support tailored for both working professionals and learners entering the domain.'
    },
    {
      question: 'What certification and placement assistance are provided?',
      answer: 'Learners receive the verified Edqoo Certificate upon successful completion, and qualify for 3 Guaranteed Job Interviews upon movement to the Placement Pool.'
    },
    {
      question: 'Are all program features and capstone projects included?',
      answer: 'Yes! Every course includes Live Interactive Classes, LMS access, Dedicated Mentorship, Placement Assistance, Real-World Capstone Projects, and rewards for top performers.'
    }
  ];

  const faqItems = rawCourseFaqs.map((faq, index) => ({
    id: `faq-${index + 1}`,
    title: faq.question,
    content: <p className="text-xs leading-relaxed text-slate-600">{faq.answer}</p>
  }));

  const relatedCourses = allCourses
    .filter((c) => c.slug !== course.slug && (c.category === course.category || (c.categories && c.categories.some((cat) => course.categories?.includes(cat)))))
    .slice(0, 3);

  // Curriculum accordion data
  const curriculumItems = (course.curriculum && course.curriculum.length > 0)
    ? course.curriculum.map((section, idx) => ({
        id: `curric-${idx + 1}`,
        title: `${section.title} (${(section.topics || []).length} Key Topics)`,
        content: (
          <div className="space-y-2 pt-1 pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(section.topics || []).map((topic, tIdx) => (
                <div
                  key={tIdx}
                  className="flex items-start gap-2.5 text-xs py-2 px-3 rounded-lg bg-slate-50 border border-slate-200/60"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#6D22B5] mt-0.5 flex-shrink-0" />
                  <span className="font-semibold text-slate-800">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }))
    : (course.modules || []).map((module, mIdx) => {
        const lessons = Array.isArray(module.lessons) ? module.lessons : [];
        return {
          id: `mod-${module.id || mIdx + 1}`,
          title: `${module.title} (${lessons.length > 0 ? `${lessons.length} Sessions / Labs` : 'Curriculum Module'})`,
          content: (
            <div className="space-y-2 pt-1 pb-2">
              {lessons.map((lesson: any, lIdx: number) => {
                const lessonTitle = typeof lesson === 'string' ? lesson : (lesson?.title || `Session ${lIdx + 1}`);
                const lessonDuration = typeof lesson === 'object' && lesson ? lesson.duration : null;
                return (
                  <div
                    key={lesson?.id || lIdx}
                    className="flex items-center justify-between text-xs py-2 px-3.5 rounded-lg bg-slate-50 border border-slate-200/60"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#6D22B5]" />
                      <span className="font-semibold text-slate-800">{lessonTitle}</span>
                    </div>
                    {lessonDuration && <span className="text-[10px] text-slate-500 font-medium">{lessonDuration}</span>}
                  </div>
                );
              })}
              {lessons.length === 0 && module.description && (
                <p className="text-xs text-slate-600 py-1 leading-relaxed">{module.description}</p>
              )}
            </div>
          )
        };
      });

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
    if (!category) return 'bg-[#F1E8FA] text-[#6D22B5] border-[#E0CEF5]';
    const upper = category.toUpperCase().trim();
    switch (upper) {
      case 'AMAZON':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'NETFLIX':
        return 'bg-rose-50 text-rose-900 border-rose-300';
      case 'EV':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case 'AI':
        return 'bg-[#F1E8FA] text-[#6D22B5] border-[#E0CEF5]';
      case 'MEDICAL AI':
        return 'bg-cyan-50 text-cyan-900 border-cyan-300';
      case 'LEGAL AI':
        return 'bg-indigo-50 text-indigo-900 border-indigo-300';
      case 'NLP AI':
        return 'bg-blue-50 text-blue-900 border-blue-300';
      default:
        return 'bg-[#F1E8FA] text-[#6D22B5] border-[#E0CEF5]';
    }
  };

  const is1to1Mastery =
    course.id === '1-to-1-live-spoken-english' ||
    course.slug === '1-to-1-live-spoken-english' ||
    course.slug === '1:1-communicative-english-mastery' ||
    course.slug === '1-1-communicative-english-mastery' ||
    course.title.toLowerCase().includes('communicative english mastery');

  const defaultMasteryFeatures: CourseFeatureItem[] = [
    {
      id: 1,
      featureNumber: '01',
      title: '15 Live 1:1 Sessions',
      description: 'Expert-led speaking practice'
    },
    {
      id: 2,
      featureNumber: '02',
      title: '25 Grammar + 25 Vocabulary + 25 Habits',
      description: 'HD lessons with lifetime access and daily fluency habituation'
    },
    {
      id: 3,
      featureNumber: '03',
      title: '50+ E-PDFs + 200+ Power Words',
      description: 'Study resources for confident communication'
    },
    {
      id: 4,
      featureNumber: '04',
      title: 'Certification',
      description: 'Course completion certification for 3+ months enrollments'
    }
  ];

  const activeMasteryFeatures: CourseFeatureItem[] =
    Array.isArray(course.features) && course.features.length > 0 && typeof course.features[0] === 'object'
      ? (course.features as any[]).map((f, idx) => ({
          id: f.id || idx + 1,
          featureNumber: f.featureNumber || `0${idx + 1}`,
          title: f.title,
          description: f.description || defaultMasteryFeatures[idx]?.description || ''
        }))
      : defaultMasteryFeatures;

  const isCorporateEnglish =
    course.id === 'elite-corporate-transformation-track' ||
    course.slug === 'elite-corporate-transformation-track' ||
    course.slug === 'corporate-english-fluency-builder' ||
    course.title.toLowerCase().includes('corporate english');

  const isExecutiveInterview =
    course.id === 'targeted-interview-prep-masterclass' ||
    course.slug === 'targeted-interview-prep-masterclass' ||
    course.slug === 'executive-interview-preparation-track' ||
    course.slug === 'executive-interview-prep-track' ||
    course.slug === '1-to-1-executive-interview-preparation-track' ||
    course.title.toLowerCase().includes('executive interview');

  const isIeltsIntensive =
    course.id === 'ielts-intensive-1-to-1-crash-training' ||
    course.slug === 'ielts-intensive-1-to-1-crash-training' ||
    course.slug === 'ielts-intensive' ||
    course.slug === '1-to-1-ielts-intensive' ||
    course.title.toLowerCase().includes('ielts');

  const isFluencyBuilder =
    !isCorporateEnglish &&
    !isExecutiveInterview &&
    !isIeltsIntensive &&
    (course.id === 'standard-plan-telephonic-calling-sessions' ||
      course.slug === 'standard-plan-telephonic-calling-sessions' ||
      course.slug === 'fluency-builder-plan' ||
      course.slug === 'standard-plan-telephonic-sessions' ||
      course.title.toLowerCase().includes('fluency builder'));

  const isLittleHearts =
    course.slug === 'little-hearts' ||
    (typeof slug === 'string' && slug.toLowerCase() === 'little-hearts') ||
    course.title.toLowerCase().includes('little heart');

  const isLittleMirrors =
    !isLittleHearts &&
    (course.id === 'kids-1-to-1-english-fluency-program' ||
      course.slug === 'kids-1-to-1-english-fluency-program' ||
      course.slug === 'little-mirrors' ||
      course.title.toLowerCase().includes('little mirror'));

  const defaultFluencyBuilderFeatures: CourseFeatureItem[] = [
    {
      id: 1,
      featureNumber: '01',
      title: '25 Phone Call Sessions',
      description: 'Daily 15-minute 1-1 voice calls with an expert trainer.'
    },
    {
      id: 2,
      featureNumber: '02',
      title: '25 Grammar + 25 Vocabulary',
      description: 'Recorded HD classes with lifetime access.'
    },
    {
      id: 3,
      featureNumber: '03',
      title: '50 E-PDFs + Daily JAM Updates',
      description: 'Educational resources with WhatsApp doubt support.'
    },
    {
      id: 4,
      featureNumber: '04',
      title: 'Certification',
      description: 'Earned for course tenures of 3 months and above.'
    }
  ];

  const activeFluencyBuilderFeatures: CourseFeatureItem[] =
    Array.isArray(course.features) && course.features.length > 0 && typeof course.features[0] === 'object'
      ? (course.features as any[]).map((f, idx) => ({
          id: f.id || idx + 1,
          featureNumber: f.featureNumber || `0${idx + 1}`,
          title: f.title,
          description: f.description || defaultFluencyBuilderFeatures[idx]?.description || ''
        }))
      : defaultFluencyBuilderFeatures;

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

  const curriculumCount = (course.curriculum && course.curriculum.length > 0)
    ? course.curriculum.length
    : (course.modules && course.modules.length > 0)
    ? course.modules.length
    : 0;

  const projectsCount = (course.projects && course.projects.length > 0) ? course.projects.length : 0;

  const navSections = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: curriculumCount > 0 ? `Curriculum (${curriculumCount})` : 'Curriculum' },
    { id: 'projects', label: projectsCount > 0 ? `Projects (${projectsCount})` : 'Projects' },
    { id: 'features', label: 'Core Features' },
    { id: 'faqs', label: 'Admissions FAQ' }
  ];

  return (
    <div className={`bg-white min-h-screen text-left ${(isLittleMirrors || isLittleHearts) ? 'little-mirrors-page' : ''}`}>
      <SEO 
        title={isLittleHearts ? 'Little Hearts — Kids 1:1 English Fluency Program | Edqoo' : seoTitle}
        description={seoDescription}
        canonical={isLittleHearts ? '/courses/little-hearts' : `/courses/${course.slug}`}
        ogImage={getCacheBustedImageUrl(course.image, course.updatedAt || course.imageUpdatedAt)}
        ogImageAlt={`${isLittleHearts ? 'Little Hearts' : course.title} - Edqoo Online Course`}
        keywords={course.seoKeywords || course.skills || [course.title, course.category, 'online course', 'Edqoo']}
        breadcrumbs={breadcrumbItems}
        course={course}
        instructor={displayInstructors[0] || null}
        faqs={rawCourseFaqs}
      />

      {/* 1. Course Program Hero Banner */}
      {isLittleHearts ? (
        <LittleMirrorsShowcase
          course={{
            ...course,
            title: 'Little Hearts',
            slug: 'little-hearts'
          }}
          onEnquire={() => {
            const el = document.getElementById('enquire');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              openEnquiryModal('Little Hearts', {
                category: course.category,
                courseId: course.id
              });
            }
          }}
        />
      ) : isLittleMirrors ? (
        <LittleMirrorsShowcase
          course={course}
          onEnquire={() => {
            const el = document.getElementById('enquire');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              openEnquiryModal(course.title, {
                category: course.category,
                courseId: course.id
              });
            }
          }}
        />
      ) : isCorporateEnglish ? (
        <CorporateEnglishShowcase
          course={course}
          onEnquire={() => {
            const el = document.getElementById('enquire');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              openEnquiryModal(course.title, {
                category: course.category,
                courseId: course.id
              });
            }
          }}
        />
      ) : isExecutiveInterview ? (
        <ExecutiveInterviewShowcase
          course={course}
          onEnquire={() => {
            const el = document.getElementById('enquire');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              openEnquiryModal(course.title, {
                category: course.category,
                courseId: course.id
              });
            }
          }}
        />
      ) : isIeltsIntensive ? (
        <IeltsIntensiveShowcase
          course={course}
          onEnquire={() => {
            const el = document.getElementById('enquire');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              openEnquiryModal(course.title, {
                category: course.category,
                courseId: course.id
              });
            }
          }}
        />
      ) : isFluencyBuilder ? (
        <section className="bg-white text-slate-900 py-10 sm:py-14 border-b border-slate-100 relative overflow-hidden text-left">
          {/* Subtle ambient background glow effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50/80 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 relative z-10">
            {/* Top Bar: Breadcrumb + Category Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <Breadcrumbs
                items={breadcrumbItems.slice(1)}
                className="pb-0"
              />
              <div className="flex flex-wrap items-center gap-2">
                {assignedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-purple-50 text-[#7C3AED] border-purple-200/80 shadow-2xs"
                  >
                    {cat}
                  </span>
                ))}
                {course.liveHours && (
                  <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-[#7C3AED] text-white shadow-xs">
                    {course.liveHours} Live Learning
                  </span>
                )}
              </div>
            </div>

            {/* Header Block matching reference layout:
                1. Course title at the top
                2. Purple TELEPHONIC SESSIONS badge beneath the title
                3. Description below the badge
                4. Supporting text beneath the description */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-[#111827] leading-tight">
                {course.title || 'Fluency Builder Plan'}
              </h1>

              <div>
                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#7C3AED] text-white text-xs font-mono font-extrabold tracking-wider uppercase shadow-xs">
                  TELEPHONIC SESSIONS
                </span>
              </div>

              <p className="text-[#374151] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
                {course.description || 'Your Complete Path to Confident English Communication'}
              </p>

              {(course.supportingText || 'Voice Calls | Recorded Lessons | Daily Practice') && (
                <div className="pt-1">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#F5F0FF] border border-[#E5E7EB] text-[#374151] text-xs font-medium tracking-wide shadow-2xs">
                    {course.supportingText || 'Voice Calls | Recorded Lessons | Daily Practice'}
                  </span>
                </div>
              )}
            </div>

            {/* Four Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {activeFluencyBuilderFeatures.slice(0, 4).map((feature, idx) => {
                const featNum = feature.featureNumber || `0${idx + 1}`;
                return (
                  <div
                    key={feature.id || idx}
                    className="rounded-2xl bg-[#F5F0FF] border border-[#E5E7EB] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-[#7C3AED]/40 hover:shadow-md transition-all duration-300 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-[#7C3AED] text-white text-xs font-mono font-extrabold shadow-2xs tracking-wider">
                        FEATURE {featNum}
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-base sm:text-lg font-display font-bold text-[#111827] leading-snug">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Closing Highlight in Purple, Bold Italic Typography */}
            <div className="pt-2 text-center">
              <p className="text-base sm:text-lg md:text-xl font-bold italic text-[#7C3AED] tracking-wide">
                "{course.highlightText || 'Mirror your success with fluent English'}"
              </p>
            </div>

            {/* TELEPHONIC LEARNING Information Card */}
            <div className="rounded-2xl bg-[#F5F0FF] border border-[#E5E7EB] p-4 sm:p-5 shadow-xs max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-center sm:text-left">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#7C3AED] block">
                  TELEPHONIC LEARNING
                </span>
                <p className="text-sm sm:text-base font-bold text-[#111827]">
                  Daily 1-1 voice calls + self-paced learning
                </p>
              </div>
              <span className="inline-flex items-center justify-center self-center sm:self-auto px-3 py-1 rounded-md bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#7C3AED] text-xs font-bold uppercase tracking-wider">
                Included
              </span>
            </div>

            {/* Quick stats indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-slate-900 font-bold">{course.rating}</span> ({course.students} Active Learners)
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <Clock className="w-4 h-4 text-[#7C3AED]" />
                Duration: {course.duration}
              </span>
              {course.liveHours && (
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Video className="w-4 h-4 text-[#7C3AED]" />
                  Live Hours: {course.liveHours}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#7C3AED]" />
                Level: {course.level}
              </span>
            </div>
          </div>
        </section>
      ) : is1to1Mastery ? (
        <section className="bg-white text-slate-900 py-10 sm:py-14 border-b border-slate-100 relative overflow-hidden text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
            {/* Top Bar: Breadcrumb + Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <Breadcrumbs
                items={breadcrumbItems.slice(1)}
                className="pb-0 text-[#333333] [&_a]:text-[#333333] [&_a:hover]:text-[#6D22B5] [&_span]:text-[#202020] [&_svg]:text-neutral-400"
              />
              <div className="flex flex-wrap items-center gap-2">
                {assignedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-[#F7F3FF] text-[#6D22B5] border-[#E5D5FF]"
                  >
                    {cat}
                  </span>
                ))}
                {course.liveHours && (
                  <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-[#6D22B5] text-white shadow-xs">
                    {course.liveHours} Live Learning
                  </span>
                )}
              </div>
            </div>

            {/* Header Block: Supporting text, Main Heading, Description */}
            <div className="text-center max-w-3xl mx-auto space-y-3.5">
              {course.supportingText && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3FF] border border-[#E5D5FF] text-[#6D22B5] text-xs font-semibold tracking-wide shadow-2xs">
                  <span>{course.supportingText}</span>
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-[#202020] leading-tight">
                {course.title}
              </h1>

              <p className="text-[#555555] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
                {course.description}
              </p>
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {activeMasteryFeatures.slice(0, 4).map((feature, idx) => {
                const featNum = feature.featureNumber || `0${idx + 1}`;
                return (
                  <div
                    key={feature.id || idx}
                    className="rounded-2xl bg-[#F7F3FF] border border-[#E5D5FF] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#6D22B5]/50 hover:shadow-sm transition-all duration-300 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E5D5FF] text-[#6D22B5] text-xs font-mono font-extrabold shadow-2xs tracking-wider">
                        FEATURE {featNum}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-base sm:text-lg font-display font-bold text-[#252525] leading-snug">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Closing Highlight in Purple, Bold Italic Typography */}
            <div className="pt-2 text-center">
              <p className="text-base sm:text-lg md:text-xl font-bold italic text-[#8B35D6] tracking-wide">
                "{course.highlightText || 'Mirror your success with fluent English'}"
              </p>
            </div>

            {/* Quick stats indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 border-t border-slate-200 text-xs font-semibold text-[#333333]">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-[#202020] font-bold">{course.rating}</span> ({course.students} Learners Enrolled)
              </span>
              <span className="flex items-center gap-1.5 font-bold text-[#333333]">
                <Clock className="w-4 h-4 text-[#8B35D6]" />
                Duration: {course.duration}
              </span>
              {course.liveHours && (
                <span className="flex items-center gap-1.5 font-bold text-[#333333]">
                  <Video className="w-4 h-4 text-[#8B35D6]" />
                  Live Hours: {course.liveHours}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#8B35D6]" />
                Level: {course.level}
              </span>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white text-slate-950 py-10 sm:py-14 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
            
            {/* Breadcrumb */}
            <Breadcrumbs items={breadcrumbItems.slice(1)} className="pb-1" />

            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {assignedCategories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-[#F1E8FA] text-[#6D22B5] border-[#E0CEF5]"
                >
                  {cat}
                </span>
              ))}
              {isFreeLearning && (
                <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-[#6D22B5] text-white shadow-xs uppercase tracking-wider">
                  FREE
                </span>
              )}
              {course.liveHours && (
                <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-[#6D22B5] text-white shadow-xs">
                  {course.liveHours} Live Learning
                </span>
              )}
            </div>

            {course.supportingText && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#6D22B5] text-xs font-semibold">
                <span>{course.supportingText}</span>
              </div>
            )}

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
                <Clock className="w-4 h-4 text-[#6D22B5]" />
                Duration: {course.duration}
              </span>
              {course.liveHours && (
                <span className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Video className="w-4 h-4 text-[#6D22B5]" />
                  Live Hours: {course.liveHours}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#6D22B5]" />
                Level: {course.level}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 2. Sticky Section Navigation Bar */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Program sections" className="flex items-center justify-between gap-4 py-1.5">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none whitespace-nowrap py-1">
              {navSections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-[13px] font-bold rounded-xl transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-white text-[#6D22B5] border-[#6D22B5] shadow-xs'
                        : 'bg-white text-slate-700 border-transparent hover:text-[#6D22B5] hover:bg-purple-50 hover:border-purple-200'
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
                className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-2xs cursor-pointer"
              >
                {isFreeLearning ? (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-white" />
                    <span>Enquire Now</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-3.5 h-3.5 text-white" />
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
            <div className="border-b border-[#E5E5E5] pb-3">
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950">
                Program Overview & Competencies
              </h2>
            </div>

            {/* Key Skills & Competencies */}
            {course.skills && course.skills.length > 0 && (
              <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-2xs space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Key Skills &amp; Competencies You Will Build
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {course.skills.map((skill) => (
                    <div key={skill} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#6D22B5] mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Program Outcome Banner */}
            {course.outcome && (
              <div className="bg-white border-l-4 border-l-[#6D22B5] border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6D22B5] block">
                  PROGRAM OUTCOME &amp; INDUSTRY IMPACT
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {course.outcome}
                </p>
              </div>
            )}

            {/* Career Readiness */}
            {course.careerReadiness && course.careerReadiness.length > 0 && (
              <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-2xs space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#6D22B5]" />
                  Career Readiness &amp; Professional Mentorship
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {course.careerReadiness.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#6D22B5] mt-0.5 flex-shrink-0" />
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
                <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-2xs space-y-3">
                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#6D22B5]" />
                    Target Audience &amp; Eligibility
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {course.whoIsItFor.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6D22B5] mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements & Hardware Prerequisites */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-2xs space-y-3">
                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#6D22B5]" />
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
            <div className="border-b border-[#E5E5E5] pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950">
                  Curriculum Structure &amp; Modules
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed breakdown of topics, practical sessions, and live laboratory exercises.
                </p>
              </div>
              {course.liveHours && (
                <span className="px-3 py-1 bg-[#F1E8FA] text-[#6D22B5] border border-[#E0CEF5] text-xs font-extrabold rounded-lg">
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
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-2 text-slate-900">
              <div className="flex items-center gap-2 text-[#6D22B5] font-extrabold text-xs uppercase tracking-widest">
                <FolderGit2 className="w-4 h-4 text-[#6D22B5]" />
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
                      className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-[#6D22B5] transition-all flex items-start gap-3 text-left"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#6D22B5] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{String(proj)}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Practical project assignment with mentor guidance.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-[#E5E5E5] p-8 rounded-2xl text-center space-y-2">
                <Laptop className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">Project listings are updated as curriculum progresses.</p>
              </div>
            )}

            {/* Technology Stack & Tooling Section */}
            {techStackList.length > 0 && (
              <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-2xs space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#6D22B5]" />
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
                            className="px-2.5 py-1 rounded-lg bg-[#F1E8FA] border border-[#E0CEF5] text-[#6D22B5] text-xs font-bold shadow-2xs"
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

          {/* Section 4: Program Features */}
          <section id="features" className="scroll-mt-32 sm:scroll-mt-36 space-y-6 text-left">
            <div className="border-b border-[#E5E5E5] pb-3">
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950">
                {is1to1Mastery || isFluencyBuilder || isLittleMirrors || isLittleHearts || isCorporateEnglish ? 'Program Features & Highlights' : 'Core Features Are Guaranteed Across Every Program'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {is1to1Mastery || isFluencyBuilder || isLittleMirrors || isLittleHearts || isCorporateEnglish
                  ? 'Key speaking sessions, vocabulary modules, habits, and study resources included in this program.'
                  : 'Every learner enrolled in this track receives the full institutional learning and placement suite.'}
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-2xs space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {programFeatures.map((feat, idx) => {
                  const isObj = typeof feat === 'object' && feat !== null;
                  const featNum = isObj ? ((feat as any).featureNumber || `0${idx + 1}`) : `${idx + 1}`;
                  const title = isObj ? (feat as any).title : String(feat);
                  const desc = isObj ? (feat as any).description : null;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-start gap-3.5 hover:border-[#6D22B5] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F1E8FA] text-[#6D22B5] flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                        {featNum}
                      </div>
                      <div className="space-y-1 text-left flex-1">
                        <span className="text-xs font-bold text-slate-900 leading-snug block">{title}</span>
                        {desc && <p className="text-[11px] text-slate-600 leading-relaxed">{desc}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {(is1to1Mastery || isFluencyBuilder || isLittleMirrors || isLittleHearts || isCorporateEnglish) && course.highlightText && (
                <div className="pt-2 border-t border-slate-100 text-center">
                  <p className="text-sm sm:text-base font-bold italic text-[#7C3AED]">
                    "{course.highlightText}"
                  </p>
                </div>
              )}

              {isFluencyBuilder && (
                <div className="rounded-xl bg-[#F5F0FF] border border-[#E5E7EB] p-4 text-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#7C3AED] block">
                      TELEPHONIC LEARNING
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#111827]">
                      Daily 1-1 voice calls + self-paced learning
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#7C3AED] text-[10px] font-bold uppercase tracking-wider self-start sm:self-auto">
                    Included
                  </span>
                </div>
              )}

              {isCorporateEnglish && (
                <div className="rounded-xl bg-[#F5F0FF] border border-[#E5E7EB] p-4 text-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#7C3AED] block">
                      BLENDED LEARNING
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#111827]">
                      Live 1:1 coaching + self-paced learning
                    </p>
                    <p className="text-[11px] text-[#374151]">
                      1 Month &bull; 30 Minutes per Live Session
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#7C3AED] text-[10px] font-bold uppercase tracking-wider self-start sm:self-auto">
                    Included
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Section 5: Admissions FAQ */}
          <section id="faqs" className="scroll-mt-32 sm:scroll-mt-36 space-y-4 text-left">
            <div className="border-b border-[#E5E5E5] pb-3">
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#6D22B5]" />
                Admissions &amp; Enrollment FAQs
              </h2>
            </div>
            <Accordion items={faqItems} allowMultiple={true} />
          </section>

          {/* Section 7: Final Program CTA Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-slate-900 text-center space-y-4 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-display font-black text-slate-950">
              Ready to Advance Your Career with {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
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
                className="btn-primary px-6 py-3 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                {isFreeLearning ? (
                  <>
                    <BookOpen className="w-4 h-4 text-white" />
                    <span>Enquire Now</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4 text-white" />
                    <span>Enquire Now / Talk to Advisor</span>
                  </>
                )}
              </button>
              <Link
                to="/courses"
                className="btn-secondary px-6 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all"
              >
                Compare Other Tracks
              </Link>
            </div>
          </div>

        </div>

        {/* Right Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-28 sm:top-32 space-y-4">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-md space-y-5 text-left">
            
            {/* Image Preview */}
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-[#E5E5E5]">
              <img
                src={getCacheBustedImageUrl(course.image, course.updatedAt || course.imageUpdatedAt, DEFAULT_ENGLISH_COURSE_FALLBACK)}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== DEFAULT_ENGLISH_COURSE_FALLBACK) {
                    target.src = DEFAULT_ENGLISH_COURSE_FALLBACK;
                  }
                }}
              />
            </div>

            {/* Course Program Enrollment Details */}
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] uppercase font-bold text-[#6D22B5] tracking-wider block">
                Admissions &amp; Batch Enrollment
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-1 bg-[#F1E8FA] text-[#6D22B5] font-extrabold text-xs rounded-md">
                  Cohort Enrolment Open
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                *Request counseling callback for syllabus, batch timings &amp; fee structure.
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
                    <BookOpen className="w-4 h-4 text-white" />
                    <span>Enquire Now</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4 text-white" />
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
                <GraduationCap className="w-4 h-4 text-[#6D22B5] flex-shrink-0" />
                <span>Learn from Faculty &amp; Industry Practitioners</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6D22B5] flex-shrink-0" />
                <span>218+ Hours of Self-Paced Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#6D22B5] flex-shrink-0" />
                <span>100+ Live Learning Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#6D22B5] flex-shrink-0" />
                <span>50+ Industry Projects &amp; Case Studies</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#6D22B5] flex-shrink-0" />
                <span>24×7 Learning Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#6D22B5] flex-shrink-0" />
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
                className="inline-flex items-center gap-1 font-bold text-[#6D22B5] hover:text-[#6D22B5] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#6D22B5]" />
                <span>WhatsApp Advisor</span>
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* 4. Related Programs Section */}
      {relatedCourses.length > 0 && (
        <section className="border-t border-[#E5E5E5] bg-white py-12 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#6D22B5] uppercase tracking-widest block">
                  RECOMMENDED TRACKS
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                  Related Courses in {primaryCategory}
                </h2>
              </div>
              <Link
                to="/courses"
                className="text-xs font-bold text-black hover:text-[#6D22B5] inline-flex items-center gap-1"
              >
                <span>Explore All Programs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCourses.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#6D22B5] hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={getCacheBustedImageUrl(rel.image, rel.updatedAt || rel.imageUpdatedAt)}
                      alt={`${rel.title} - Edqoo online course`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#6D22B5] uppercase tracking-wider block">
                        {rel.category}
                      </span>
                      <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-[#6D22B5] transition-colors line-clamp-2">
                        <Link to={`/courses/${rel.slug}`}>{rel.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {rel.shortDescription || rel.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#6D22B5]" />
                        <span>{rel.duration}</span>
                      </span>
                      <Link
                        to={`/courses/${rel.slug}`}
                        className="text-xs font-bold text-slate-700 hover:text-[#6D22B5] inline-flex items-center gap-1"
                      >
                        <span>View Syllabus</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};