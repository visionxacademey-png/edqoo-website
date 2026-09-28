import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  Brain,
  Cpu,
  BarChart3,
  Code2,
  Wrench,
  ArrowRight,
  Star,
  Clock,
  CheckCircle2,
  PhoneCall,
  CheckCircle
} from 'lucide-react';
import { filterCoursesByCategory } from '../../data/courses';
import { courseService } from '../../services/courseService';
import type { Course } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Accordion } from '../../components/ui/Accordion';
import { useEnquiry } from '../../context/EnquiryContext';
import { getCacheBustedImageUrl } from '../../utils/imageUrl';
import { CourseSkeleton } from '../../components/ui/CourseSkeleton';

interface CategoryConfig {
  slug: string;
  categoryKey: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  subtitle: string;
  metaKeywords: string[];
  canonical: string;
  icon: React.ComponentType<{ className?: string }>;
  heroImage: string;
  heroBadge: string;
  highlights: string[];
  curriculumPillars: Array<{ title: string; desc: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  'data-science-and-ai': {
    slug: 'data-science-and-ai',
    categoryKey: 'Data Science and AI',
    title: 'Data Science and AI Courses & Certification Programs',
    seoTitle: 'Edqoo Data Science and AI Programs | Master Online Tracks',
    seoDescription:
      'Learn Data Science, Artificial Intelligence, Python, machine learning and practical analytics through Edqoo\'s industry-focused Data Science and AI program.',
    h1: 'Data Science and AI',
    subtitle:
      'Master data engineering, predictive modeling, deep learning architectures, and production AI with real-world enterprise projects and dedicated mentorship.',
    metaKeywords: [
      'Edqoo Data Science',
      'data science course',
      'data science and AI course',
      'online data science course',
      'data science certification course',
      'AI and data science training',
      'machine learning online certification'
    ],
    canonical: '/programs/data-science-and-ai',
    icon: Brain,
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    heroBadge: 'Comprehensive Industry Program Track',
    highlights: [
      'Full-stack Data Science & Artificial Intelligence curriculum',
      'Hands-on projects with Amazon, Netflix, and Medical AI datasets',
      'Master Python, Machine Learning, Deep Learning, MLOps, and Power BI',
      'Placement assistance with interview coaching & portfolio reviews'
    ],
    curriculumPillars: [
      { title: 'Python & Statistical Foundations', desc: 'Object-oriented programming, data structures, NumPy, Pandas, exploratory analysis, and inferential statistics.' },
      { title: 'Machine Learning & Predictive Systems', desc: 'Supervised & unsupervised models, ensemble methods, XGBoost, feature engineering, and cross-validation.' },
      { title: 'Deep Learning & NLP Applications', desc: 'Neural networks, computer vision with CNNs, transfer learning, transformers, BERT, LLMs, and Generative AI.' },
      { title: 'Cloud Data & MLOps Pipelines', desc: 'SQL database mastery, Azure data pipelines, model deployment, version control with Git, and portfolio capstone.' }
    ],
    faqs: [
      {
        question: 'What is included in the Data Science and AI course?',
        answer: 'The program includes live interactive classes, on-demand session recordings, complete LMS access, 7+ industry capstone projects, 1-on-1 mentorship, resume optimization, and placement assistance.'
      },
      {
        question: 'Who is this Data Science and AI program for?',
        answer: 'It is designed for graduates, software developers, analysts, and working professionals looking to transition into high-growth Data Scientist, AI Engineer, and Machine Learning Specialist roles.'
      },
      {
        question: 'Do I need prior programming experience to enroll?',
        answer: 'No prior programming experience is required. We start with fundamental Python and mathematics foundations before progressing to advanced machine learning and deep neural networks.'
      },
      {
        question: 'What certification is provided upon completion?',
        answer: 'Graduates receive the verified Edqoo Professional Certificate in Data Science & Artificial Intelligence, highlighting verified project portfolio achievements.'
      }
    ]
  },
  'python': {
    slug: 'python',
    categoryKey: 'Tools and Upskills',
    title: 'Online Python Programming Courses & Certifications',
    seoTitle: 'Edqoo Python Course | Learn Python from Basics to Advanced',
    seoDescription:
      'Learn Python from fundamentals to advanced concepts with practical projects and industry-focused learning through Edqoo.',
    h1: 'Python Course',
    subtitle:
      'Build practical programming capabilities in Python from variables and data structures to object-oriented programming, automation, and real-world project development.',
    metaKeywords: [
      'Edqoo Python',
      'Python course',
      'Python online course',
      'Python programming course',
      'Python certification course',
      'learn Python online',
      'advanced Python course'
    ],
    canonical: '/programs/python',
    icon: Code2,
    heroImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    heroBadge: 'Core Programming Foundation',
    highlights: [
      'Zero-to-hero curriculum covering fundamentals to advanced modular development',
      'Live code walkthroughs, error debugging, and terminal best practices',
      'Hands-on lab assignments in data handling, file I/O, and OOP architecture',
      'Real-world portfolio projects including console systems and API tools'
    ],
    curriculumPillars: [
      { title: 'Python Basics & Control Flow', desc: 'Syntax, data types, conditional statements, loops, list comprehensions, and functions.' },
      { title: 'Data Structures & File Operations', desc: 'Dictionaries, sets, tuples, error handling, JSON parsing, and structured file I/O.' },
      { title: 'Object-Oriented Programming (OOP)', desc: 'Classes, objects, inheritance, encapsulation, polymorphism, and clean modular code design.' },
      { title: 'Libraries & Project Engineering', desc: 'Working with NumPy, Pandas, virtual environments, API requests, and building practical applications.' }
    ],
    faqs: [
      {
        question: 'Is this Python course suitable for complete beginners?',
        answer: 'Yes! The course begins with environment setup and syntax fundamentals before progressing step-by-step to advanced modular programming and libraries.'
      },
      {
        question: 'Are projects included in the Python program?',
        answer: 'Yes, every module incorporates practical exercises and end-to-end coding projects that you can showcase on GitHub.'
      },
      {
        question: 'How long does the Python course take to complete?',
        answer: 'The program is structured across 24 intensive hours with flexible weekend and evening batches suitable for students and working professionals.'
      },
      {
        question: 'Can I apply Python skills to Data Science or Web Development?',
        answer: 'Absolutely. Python is the universal backbone for Data Science, AI, backend web development with Django/FastAPI, and automated scripting.'
      }
    ]
  },
  'ai-and-machine-learning': {
    slug: 'ai-and-machine-learning',
    categoryKey: 'AI and Machine Learning',
    title: 'AI and Machine Learning Courses & Practical Training',
    seoTitle: 'Edqoo AI & Machine Learning Programs | Practical AI Training',
    seoDescription:
      'Build practical skills in Artificial Intelligence and Machine Learning with Edqoo through structured learning, projects and industry-focused training.',
    h1: 'AI and Machine Learning',
    subtitle:
      'Train, fine-tune, and deploy intelligent algorithms, computer vision pipelines, natural language models, and Generative AI systems.',
    metaKeywords: [
      'Edqoo AI',
      'Edqoo Machine Learning',
      'AI course',
      'artificial intelligence course',
      'machine learning course',
      'AI and ML course',
      'machine learning certification',
      'online AI course'
    ],
    canonical: '/programs/ai-and-machine-learning',
    icon: Cpu,
    heroImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
    heroBadge: 'Advanced Intelligent Systems Track',
    highlights: [
      'End-to-end supervised and unsupervised machine learning algorithms',
      'Deep learning architectures with PyTorch and TensorFlow',
      'NLP, Large Language Models (LLMs), Prompt Engineering, and RAG systems',
      'Model evaluation, optimization, hyperparameter tuning, and deployment'
    ],
    curriculumPillars: [
      { title: 'Statistical & Classical ML', desc: 'Regression, classification, random forests, clustering, dimensionality reduction, and evaluation metrics.' },
      { title: 'Neural Networks & Deep Learning', desc: 'Perceptrons, backpropagation, CNNs for computer vision, RNNs, and transfer learning workflows.' },
      { title: 'Natural Language Processing & LLMs', desc: 'Tokenization, embeddings, Transformers, BERT, GPT architectures, and fine-tuning.' },
      { title: 'Generative AI & MLOps', desc: 'Prompt engineering patterns, vector databases, LangChain, API serving, and cloud inference.' }
    ],
    faqs: [
      {
        question: 'What practical AI applications will I build?',
        answer: 'You will build real-world systems including automated text classifiers, computer vision diagnostic tools, AI-powered interview assistants, and Generative AI agents.'
      },
      {
        question: 'What tools and frameworks are taught?',
        answer: 'We cover Python, Scikit-Learn, TensorFlow, PyTorch, Hugging Face Transformers, OpenCV, Streamlit, and cloud deployment tools.'
      },
      {
        question: 'Is mentor support provided for troubleshooting code?',
        answer: 'Yes, learners receive dedicated mentor guidance, live interactive doubt-clearing sessions, and code reviews on every assignment.'
      }
    ]
  },
  'data-analytics-and-ai': {
    slug: 'data-analytics-and-ai',
    categoryKey: 'Data Analytics and AI',
    title: 'Data Analytics and AI Courses | Business Intelligence & Visualization',
    seoTitle: 'Edqoo Data Analytics and AI Programs | Power BI, SQL & Analytics',
    seoDescription:
      'Learn data analytics, AI, visualization and business intelligence with Edqoo\'s practical Data Analytics and AI program.',
    h1: 'Data Analytics and AI',
    subtitle:
      'Transform complex business data into actionable visual insights using Power BI, Advanced SQL, Excel, Python, and AI-assisted analytics.',
    metaKeywords: [
      'Edqoo Data Analytics',
      'data analytics course',
      'data analytics and AI course',
      'business analytics course',
      'data analyst course',
      'data analytics certification',
      'online data analytics course'
    ],
    canonical: '/programs/data-analytics-and-ai',
    icon: BarChart3,
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    heroBadge: 'Business Intelligence & Analytics Track',
    highlights: [
      'Comprehensive training across Power BI, SQL, Excel, and Data Analytics',
      'Interactive executive dashboard development and DAX formula mastery',
      'Complex SQL queries, window functions, CTEs, and relational database schemas',
      'AI-assisted analytics tools for automated forecasting and narrative reporting'
    ],
    curriculumPillars: [
      { title: 'Advanced Excel & Analytics', desc: 'Pivot tables, power queries, VLOOKUP/XLOOKUP, financial modeling, and macro automation.' },
      { title: 'Relational Database SQL', desc: 'Joins, aggregate groupings, subqueries, Common Table Expressions, and query optimization.' },
      { title: 'Power BI Business Intelligence', desc: 'Data modeling, star schema, DAX calculations, interactive KPI cards, and Power BI Service.' },
      { title: 'AI-Powered Business Insights', desc: 'Predictive analytics, automated reporting, trend forecasting, and executive presentations.' }
    ],
    faqs: [
      {
        question: 'What is the difference between Data Science and Data Analytics?',
        answer: 'Data Analytics focuses on analyzing historical data to uncover actionable business insights and create visual dashboards, while Data Science focuses heavily on building predictive algorithms and machine learning models.'
      },
      {
        question: 'What career roles can I pursue after this course?',
        answer: 'Graduates successfully land roles as Data Analysts, Business Intelligence (BI) Developers, Financial Analysts, Reporting Specialists, and Operations Analysts.'
      },
      {
        question: 'Are hands-on business case studies included?',
        answer: 'Yes, you will analyze real business datasets including retail sales, financial records, customer churn metrics, and streaming catalogues.'
      }
    ]
  },
  'tools-and-upskills': {
    slug: 'tools-and-upskills',
    categoryKey: 'Tools and Upskills',
    title: 'Tools & Upskills Courses | Executive Fast-Track Learning',
    seoTitle: 'Edqoo Tools & Upskills | Python, Generative AI, Excel, Power BI & More',
    seoDescription:
      'Build practical workplace skills with Edqoo\'s Tools & Upskills courses in Python, Generative AI, Excel, Power BI, MS Office and Prompt Engineering.',
    h1: 'Tools & Upskills',
    subtitle:
      'Accelerate your workplace efficiency with hands-on, high-impact courses in Python, Generative AI, Excel, Power BI, MS Office, and Prompt Engineering.',
    metaKeywords: [
      'Edqoo Tools & Upskills',
      'Edqoo HTML',
      'Edqoo SQL',
      'Edqoo Python',
      'Edqoo Generative AI',
      'Edqoo Power BI',
      'Tools and Upskills',
      'HTML course',
      'SQL course',
      'Python upskilling',
      'Excel course',
      'Power BI course',
      'Prompt Engineering course'
    ],
    canonical: '/tools-and-upskills',
    icon: Wrench,
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    heroBadge: 'Focused Workplace Skills Fast-Tracks',
    highlights: [
      '15-day intensive modules designed for instant workplace application',
      'Hands-on lab environments with real-world business scenarios',
      '1-on-1 mentorship support and practical project submissions',
      'Official Edqoo Certificate of Completion upon submission'
    ],
    curriculumPillars: [
      { title: 'Web & Database Core (HTML & SQL)', desc: 'From semantic web structure and responsive design to relational database modeling and analytical querying.' },
      { title: 'Python Programming', desc: 'From basic scripting to data manipulation and automated workflow construction.' },
      { title: 'Generative AI & LLMs', desc: 'Master prompt engineering, workflow automation, and multimodal generative AI tools.' },
      { title: 'Excel & Power BI Mastery', desc: 'Build dynamic financial models, interactive dashboards, and executive KPI reports.' },
      { title: 'Cloud & Web Technologies', desc: 'Deploy cloud infrastructure on AWS and construct modern responsive web applications.' }
    ],
    faqs: [
      {
        question: 'What courses are included in Tools & Upskills?',
        answer: 'The track includes HTML, SQL, Generative AI & ChatGPT, Prompt Engineering, Python Programming, Data Analytics (Excel & Power BI), Data Science Foundations, Ethical Hacking, Web Development, UI/UX Design, Digital Marketing, Cloud Computing & AWS, HR Management, Accounting & Finance, and Content Writing.'
      },
      {
        question: 'Can I enroll in individual tool courses separately?',
        answer: 'Yes! Each course has its own dedicated syllabus and certification, allowing you to master specific competencies at your own pace.'
      },
      {
        question: 'Are classes live or recorded?',
        answer: 'Courses feature interactive live sessions alongside on-demand recordings and dedicated doubt-clearing mentor sessions.'
      }
    ]
  }
};

export const ProgramCategory: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const location = useLocation();
  const { openEnquiryModal } = useEnquiry();

  // Determine active category based on URL
  const currentKey = useMemo(() => {
    if (location.pathname === '/tools-and-upskills') {
      return 'tools-and-upskills';
    }
    if (categorySlug && CATEGORY_CONFIGS[categorySlug]) {
      return categorySlug;
    }
    if (location.pathname === '/programs' || location.pathname === '/programs/') {
      return 'all';
    }
    return 'data-science-and-ai';
  }, [categorySlug, location.pathname]);

  const [courseList, setCourseList] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const loadCategoryCourses = (signal?: AbortSignal) => {
    setLoadingCourses(true);
    setCategoryError(null);
    courseService
      .getCourses({ signal })
      .then((data) => {
        if (Array.isArray(data)) {
          setCourseList(data);
          setCategoryError(null);
        }
      })
      .catch((err) => {
        if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
          console.error('Failed to load category courses:', err);
          setCategoryError(err?.message || 'Unable to load courses from the database.');
        }
      })
      .finally(() => setLoadingCourses(false));
  };

  useEffect(() => {
    const controller = new AbortController();
    loadCategoryCourses(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const config = currentKey !== 'all' ? CATEGORY_CONFIGS[currentKey] : null;

  // Filter courses for this category
  const categoryCourses = useMemo(() => {
    if (!config) return courseList;
    if (config.slug === 'python') {
      return courseList.filter(
        (c) =>
          c.title.toLowerCase().includes('python') ||
          c.slug.includes('python') ||
          (c.skills && c.skills.some((s) => s.toLowerCase().includes('python')))
      );
    }
    return filterCoursesByCategory(courseList, config.categoryKey);
  }, [courseList, config]);

  // If viewing the general /programs hub
  if (currentKey === 'all') {
    return (
      <div className="bg-slate-50 min-h-screen text-left">
        <SEO
          title="Edqoo Programs | Data Science, AI, Python & Data Analytics"
          description="Explore Edqoo's professional program tracks in Data Science, Artificial Intelligence, Python, Machine Learning, Data Analytics, and Tools & Upskills."
          canonical="/programs"
          keywords="Edqoo programs, Edqoo Data Science, Edqoo AI, Edqoo Python, Edqoo Data Analytics, online learning platform"
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Edqoo Programs', url: '/programs' }
          ]}
        />

        {/* Hero */}
        <section className="bg-gradient-to-b from-purple-50/70 via-slate-50 to-white text-slate-950 py-14 sm:py-20 border-b border-slate-200 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
            <span className="px-3.5 py-1.5 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
              Career-Focused Learning Paths
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950">
              Explore Our Programs
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Choose from structured master programs, specialized tracks, and executive upskilling courses designed to build verified industry skills in India & globally.
            </p>
          </div>
        </section>

        {/* Breadcrumb Bar */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <Breadcrumbs items={[{ name: 'Programs', url: '/programs' }]} />
          </div>
        </div>

        {/* Program Track Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(CATEGORY_CONFIGS).map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.slug}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:scale-105 transition-transform">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Track
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="text-xl font-display font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                        <Link to={item.canonical}>{item.h1}</Link>
                      </h2>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      {item.highlights.slice(0, 2).map((hl, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={item.canonical}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1.5"
                    >
                      <span>Explore {item.h1}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  const IconComponent = config.icon;

  const breadcrumbItems = [
    { name: 'Programs', url: '/programs' },
    { name: config.h1, url: config.canonical }
  ];

  const accordionFaqs = config.faqs.map((f, i) => ({
    id: `faq-${i + 1}`,
    title: f.question,
    content: <p className="text-xs leading-relaxed text-slate-600">{f.answer}</p>
  }));

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 text-left">
      <SEO
        title={config.seoTitle}
        description={config.seoDescription}
        canonical={config.canonical}
        keywords={config.metaKeywords}
        breadcrumbs={[{ name: 'Home', url: '/' }, ...breadcrumbItems]}
        faqs={config.faqs}
        ogImage={config.heroImage}
        ogImageAlt={`Edqoo ${config.h1} Online Course`}
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-purple-50/80 via-slate-50 to-white text-slate-950 py-12 sm:py-16 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
                <IconComponent className="w-4 h-4 text-purple-700" />
                <span>{config.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
                {config.h1}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                {config.subtitle}
              </p>

              {/* Highlights Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 pb-2">
                {config.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openEnquiryModal(`Program Category: ${config.h1}`)}
                  className="btn-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Enquire for Next Batch</span>
                </button>
                <Link
                  to="/courses"
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <span>View All {categoryCourses.length} Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md">
                <img
                  src={getCacheBustedImageUrl(config.heroImage)}
                  alt={`Edqoo ${config.h1} course in India and Kerala`}
                  className="w-full aspect-[4/3] object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="p-4 bg-white/95 backdrop-blur-xs border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">Accredited Learning</span>
                    <span className="font-bold text-slate-900">Industry-Aligned Projects</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg border border-emerald-200 text-[11px]">
                    Live + Flexible
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Courses in this Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
            Featured Offerings
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Available Courses in {config.h1}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Each program includes hands-on labs, real-world projects, dedicated faculty mentorship, and verifiable certification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingCourses ? (
            <CourseSkeleton count={3} className="col-span-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
          ) : categoryError ? (
            <div className="col-span-full py-10 px-4 text-center bg-white border border-rose-200 rounded-2xl space-y-3">
              <p className="text-xs text-rose-600 font-bold">{categoryError}</p>
              <button
                onClick={() => loadCategoryCourses()}
                className="btn-primary px-4 py-2 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          ) : categoryCourses.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-white border border-slate-200 rounded-2xl">
              No courses currently listed under {config.h1}.
            </div>
          ) : (
            categoryCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group"
              >
              {/* Course Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={getCacheBustedImageUrl(course.image, course.updatedAt || course.imageUpdatedAt)}
                  alt={`${course.title} - Edqoo online course`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 border border-slate-200 shadow-2xs">
                  <Clock className="w-3 h-3 text-purple-600" />
                  <span>{course.duration}</span>
                </div>
                {course.price === 0 && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shadow-2xs">
                    Free
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{course.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({course.students}+ enrolled)</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    <Link to={`/courses/${course.slug}`}>{course.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.shortDescription || course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Program Fee</span>
                    <span className="text-sm font-bold text-purple-700">
                      {course.price === 0 ? 'Free Learning' : `₹${course.price.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg border border-purple-200 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Syllabus</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )))}
        </div>
      </section>

      {/* Curriculum Pillars Section */}
      <section className="bg-white border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
              Core Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              What You Will Learn in {config.h1}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A structured progression designed by enterprise architects and academic leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.curriculumPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 hover:border-purple-300 transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center font-display">
                  0{idx + 1}
                </span>
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Frequently Asked Questions — {config.h1}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Find immediate answers about batch schedules, course prerequisites, and certification.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs">
          <Accordion items={accordionFaqs} />
        </div>
      </section>

      {/* Final Advisory CTA */}
      <section className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-display font-bold">
            Start Your Journey in {config.h1} Today
          </h2>
          <p className="text-purple-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Speak with an Edqoo senior academic counselor to discuss batch schedules, career roadmaps, and student offers.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => openEnquiryModal(`Category CTA: ${config.h1}`)}
              className="px-6 py-3 bg-white text-purple-900 font-bold text-xs rounded-xl shadow-md hover:bg-purple-50 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Request Free Counseling Callback</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
