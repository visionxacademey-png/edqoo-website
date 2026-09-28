import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Eye,
  Shield,
  Target,
  Users,
  ArrowRight,
  Brain,
  Cpu,
  BarChart3,
  Code2,
  Wrench,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Accordion } from '../../components/ui/Accordion';

const aboutFaqs = [
  {
    question: 'What is Edqoo?',
    answer:
      'Edqoo is an online learning platform focused on practical, industry-oriented education in Data Science, Artificial Intelligence, Python, Data Analytics and professional upskilling.'
  },
  {
    question: 'What courses does Edqoo offer?',
    answer:
      'Edqoo offers comprehensive online courses in Data Science and AI, Python Programming, Artificial Intelligence and Machine Learning, Data Analytics with Power BI, and executive Tools & Upskills including Excel, Power BI, MS Office, and Prompt Engineering.'
  },
  {
    question: 'Is Edqoo an online learning platform?',
    answer:
      'Yes, Edqoo is an online learning platform delivering live interactive sessions, hands-on cloud labs, real-world project portfolios, and dedicated 1-on-1 mentorship.'
  },
  {
    question: 'What can I learn on Edqoo?',
    answer:
      'You can learn in-demand technology and data skills including Python programming, machine learning algorithms, deep learning neural networks, SQL querying, Power BI dashboards, advanced Excel modeling, and prompt engineering.'
  },
  {
    question: 'Does Edqoo offer Data Science courses?',
    answer:
      'Yes, Edqoo offers practical Data Science courses covering Python, statistical foundations, exploratory data analysis, predictive modeling, machine learning, and hands-on capstone projects using real-world datasets.'
  },
  {
    question: 'Does Edqoo offer Python courses?',
    answer:
      'Yes, Edqoo provides dedicated Python courses covering syntax fundamentals, data structures, object-oriented programming, automation, and data handling libraries like NumPy and Pandas.'
  },
  {
    question: 'Does Edqoo offer AI and Machine Learning courses?',
    answer:
      'Yes, Edqoo offers specialized AI and Machine Learning courses covering supervised learning, deep neural networks, computer vision, natural language processing (NLP), Large Language Models (LLMs), and Generative AI.'
  },
  {
    question: 'Who are Edqoo courses designed for?',
    answer:
      'Edqoo courses are designed for students, job seekers, software developers, data analysts, and career transitioners looking to build verified, hands-on competencies in data and technology.'
  },
  {
    question: 'How can I contact Edqoo?',
    answer:
      'You can contact Edqoo by submitting an enquiry on our website, emailing support@edqoo.com, or calling +91 90744 50935.'
  }
];

const offerings = [
  { name: 'Data Science', desc: 'Predictive modeling, statistical analysis, and end-to-end data workflows.', icon: Brain, link: '/programs/data-science-and-ai' },
  { name: 'Artificial Intelligence', desc: 'Neural networks, autonomous systems, and modern AI algorithms.', icon: Cpu, link: '/programs/ai-and-machine-learning' },
  { name: 'Machine Learning', desc: 'Supervised, unsupervised algorithms, and production ML pipelines.', icon: Sparkles, link: '/programs/ai-and-machine-learning' },
  { name: 'Python', desc: 'Core programming, data structures, OOP, and automation scripting.', icon: Code2, link: '/programs/python' },
  { name: 'Data Analytics', desc: 'Exploratory business insights, reporting, and metrics modeling.', icon: BarChart3, link: '/programs/data-analytics-and-ai' },
  { name: 'HTML', desc: 'Modern semantic web page structure, forms, multimedia, and accessibility.', icon: Code2, link: '/courses/html' },
  { name: 'SQL', desc: 'Relational database querying, joins, aggregations, and practical data analysis.', icon: BarChart3, link: '/courses/sql' },
  { name: 'Cloud Computing & AWS', desc: 'Enterprise cloud infrastructure, EC2, S3 storage, and serverless workloads.', icon: Cpu, link: '/tools-and-upskills' },
  { name: 'Excel', desc: 'Advanced formulas, data modeling, pivot tables, and analysis.', icon: BarChart3, link: '/tools-and-upskills' },
  { name: 'Power BI', desc: 'Interactive business intelligence dashboards and DAX metrics.', icon: BarChart3, link: '/tools-and-upskills' },
  { name: 'Prompt Engineering', desc: 'Generative AI conditioning, workflow automation, and LLMs.', icon: Sparkles, link: '/tools-and-upskills' },
  { name: 'MS Office', desc: 'Executive workplace productivity and document modeling suite.', icon: Wrench, link: '/tools-and-upskills' },
  { name: 'Professional Upskilling', desc: 'Career-focused modules designed for immediate workplace impact.', icon: BookOpen, link: '/courses' }
];

export const About: React.FC = () => {
  const accordionAboutFaqs = aboutFaqs.map((f, i) => ({
    id: `faq-about-${i + 1}`,
    title: f.question,
    content: <p className="text-xs leading-relaxed text-slate-600">{f.answer}</p>
  }));

  return (
    <div className="bg-slate-50 min-h-screen text-left text-slate-900">
      <SEO 
        title="About Edqoo | Online Learning Platform" 
        description="Edqoo is an online learning platform focused on practical, career-oriented education in technology and professional skills."
        canonical="/about"
        keywords="About Edqoo, Edqoo, online learning platform, Edqoo courses, Edqoo Data Science, Edqoo Python, Edqoo AI, tech upskilling"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About Edqoo', url: '/about' }
        ]}
        includeOrgSchema={true}
        faqs={aboutFaqs}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-purple-50/70 via-slate-50 to-white text-slate-950 py-16 sm:py-20 text-center relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(109,34,181,0.08),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block">
            ABOUT EDQOO
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight">
            Learn With Purpose. Build With Confidence.
          </h1>
          <p className="text-slate-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Edqoo is an online learning platform focused on practical, career-oriented education in technology and professional skills.
          </p>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <Breadcrumbs items={[{ name: 'About Edqoo', url: '/about' }]} />
        </div>
      </div>

      {/* Main Core Mission / Vision section */}
      <section className="section-padding grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To empower technology enthusiasts, students, and professionals with project-driven, highly practical learning pathways that build verifiable technological competencies. We prioritize code outputs, dataset investigations, and real-world system implementations over passive theoretical lectures.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">Our Vision</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To establish Edqoo as a premier, trusted online learning destination that enables learners to gain direct, industry-aligned skills in Data Science, Artificial Intelligence, Python engineering, and modern data analytics.
          </p>
        </div>
      </section>

      {/* What Edqoo Offers Section */}
      <section className="section-padding bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-purple-600 text-xs font-extrabold tracking-widest uppercase block">
              COMPREHENSIVE CURRICULUM
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
              What You Can Learn on Edqoo
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Explore in-demand domains taught through live interactive sessions, hands-on lab environments, and practical capstone projects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offerings.map((offering, idx) => {
              const IconComp = offering.icon;
              return (
                <Link
                  key={idx}
                  to={offering.link}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-purple-300 hover:bg-purple-50/40 hover:shadow-xs transition-all group block text-left space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
                    {offering.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {offering.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy section */}
      <section className="py-16 sm:py-20 text-center bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950">
            Our Learning Philosophy
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            We believe the only way to build genuine engineering capability is to write code, analyze errors, and construct real systems.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
            <div className="space-y-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-950 block font-display">1. Focus on Code, Not Slides</span>
              <p className="text-xs text-slate-600 leading-relaxed">We teach concepts through live terminals, interactive Python notebooks, and hands-on dataset audits.</p>
            </div>
            <div className="space-y-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-950 block font-display">2. Industry-Aligned Rigor</span>
              <p className="text-xs text-slate-600 leading-relaxed">Curricula are updated regularly to reflect modern enterprise tooling, cloud infrastructure, and AI architectures.</p>
            </div>
            <div className="space-y-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-950 block font-display">3. Build Shareable Demos</span>
              <p className="text-xs text-slate-600 leading-relaxed">Every capstone is engineered as a standalone portfolio item you can describe in recruiter discussions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values grid */}
      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950">
            Our Core Values
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            The principles that steer how we structure content and support learners across India and globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { icon: Shield, title: 'Practical Rigor', desc: 'We teach ethical guidelines, modern best practices, and production-tested architectures in every workflow.' },
            { icon: Compass, title: 'Continuous Relevance', desc: 'No outdated legacy systems. We audit our syllabus modules regularly to map current industry requirements.' },
            { icon: Users, title: 'Learner-Centric Mentorship', desc: 'Dedicated 1-on-1 mentor guidance, live doubt resolution, and structured career support.' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs space-y-3 hover:border-purple-400 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-950">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brand FAQ Section */}
      <section className="section-padding bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-purple-600 text-xs font-bold tracking-widest uppercase block">
              EDQOO FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-950">
              Everything You Need to Know About Edqoo
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
              Get direct answers regarding Edqoo courses, learning format, technologies taught, and admissions.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs">
            <Accordion items={accordionAboutFaqs} />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Join the Edqoo Online Learning Platform
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm max-w-md mx-auto">
            Choose between Master Programs or Executive Tools & Upskills tracks and start building practical skills today.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/courses" className="btn-primary bg-white text-purple-800 border-white hover:bg-purple-50 hover:text-purple-900 px-8 py-3 text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-2">
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
