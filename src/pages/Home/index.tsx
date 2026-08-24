import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Star,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { courses } from '../../data/courses';
import { testimonials } from '../../data/testimonials';
import { instructors } from '../../data/instructors';
import { blogPosts } from '../../data/blog';
import { statsData } from '../../data/stats';
import { SEO } from '../../components/common/SEO';

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Popular');
  const [notifiedEmails, setNotifiedEmails] = useState<Record<string, boolean>>({});
  const [emailInput, setEmailInput] = useState<Record<string, string>>({});

  // Category list definitions
  const categories = [
    { id: 'Popular', label: 'Popular Courses', icon: '🔥' },
    { id: 'Cybersecurity', label: 'Cybersecurity', icon: '🛡️' },
    { id: 'Data Science', label: 'Data Science & Analytics', icon: '📊' },
    { id: 'AI', label: 'Artificial Intelligence', icon: '🤖' },
    { id: 'Software', label: 'Software & Technology', icon: '💻' },
    { id: 'Cloud', label: 'Cloud Computing', icon: '☁️' },
    { id: 'DevOps', label: 'DevOps', icon: '⚙️' },
    { id: 'App', label: 'App Development', icon: '📱' },
    { id: 'UI/UX', label: 'UI/UX Design', icon: '🎨' },
  ];



  // Handle upcoming course email notification signup
  const handleNotifySubmit = (e: React.FormEvent, courseId: string) => {
    e.preventDefault();
    const email = emailInput[courseId] || '';
    if (!email.trim()) return;
    
    setNotifiedEmails((prev) => ({ ...prev, [courseId]: true }));
    setEmailInput((prev) => ({ ...prev, [courseId]: '' }));
  };

  // Handle changing inputs
  const handleEmailChange = (courseId: string, val: string) => {
    setEmailInput((prev) => ({ ...prev, [courseId]: val }));
  };

  // Filter courses based on active categories
  const filteredCourses = courses.filter((course) => {
    if (activeCategory === 'Popular') {
      return course.featured === true;
    }
    if (activeCategory === 'Cybersecurity') {
      return course.category === 'Cybersecurity';
    }
    if (activeCategory === 'Data Science') {
      return course.category === 'Data Science';
    }
    if (activeCategory === 'AI') {
      return course.category === 'AI / ML';
    }
    if (activeCategory === 'Software') {
      return course.category === 'Programming';
    }
    if (activeCategory === 'Cloud') {
      return course.category === 'Cloud Computing';
    }
    if (activeCategory === 'DevOps') {
      return course.category === 'DevOps';
    }
    if (activeCategory === 'App') {
      return course.category === 'App Development';
    }
    if (activeCategory === 'UI/UX') {
      return course.category === 'UI/UX Design';
    }
    return false;
  });

  return (
    <div className="space-y-0">
      <SEO 
        title="Learn Technology. Build Your Future." 
        description="Learn in-demand technology skills through practical, industry-focused courses designed to help you build real-world knowledge and become career ready."
        canonical="/"
      />
      {/* 3. HERO SECTION - Re-themed to White Background & Dark Navy text */}
      <section className="relative bg-white text-deep-navy-900 overflow-hidden py-24 sm:py-32 border-b border-deep-navy-100">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1268e805_1px,transparent_1px),linear-gradient(to_bottom,#1268e805_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-royal-blue-100 border border-royal-blue-200 rounded-full text-royal-blue-600 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Edqoo Learning
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-deep-navy-900 leading-[1.1] tracking-tight">
              Build Skills. <br />
              <span className="text-royal-blue-600">
                Shape Your Future.
              </span>
            </h1>

            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl">
              Learn in-demand technology skills through practical, industry-focused courses designed to help you build real-world knowledge and become career ready.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/courses" className="btn-primary px-8 py-3.5 text-sm font-semibold rounded-xl text-center">
                Explore Courses
              </Link>
              <Link to="/about" className="btn-secondary px-8 py-3.5 text-sm font-semibold rounded-xl text-center">
                View Programs
              </Link>
            </div>

            {/* Hero Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-deep-navy-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-royal-blue-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-deep-navy-900/85">Practical Labs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-royal-blue-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-deep-navy-900/85">Real Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-royal-blue-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-deep-navy-900/85">Expert Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-royal-blue-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-deep-navy-900/85">Industry Certificates</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visuals - Laptop Terminal Simulation */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Visual Backdrops */}
            <div className="absolute w-[400px] h-[400px] bg-royal-blue-100/50 rounded-full blur-3xl pointer-events-none" />
            
            {/* Core Laptop Graphic */}
            <div className="relative z-10 w-full max-w-[500px] bg-deep-navy-900 border border-deep-navy-800 rounded-2xl overflow-hidden shadow-xl">
              {/* Fake Window bar */}
              <div className="bg-slate-950 px-4 py-2.5 flex items-center gap-2 border-b border-slate-800/60">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-[10px] text-slate-500 font-mono ml-2">sandbox://Edqoo.com/terminal</span>
              </div>
              <div className="p-5 font-mono text-xs text-slate-300 space-y-2 bg-slate-900/90 h-[280px] overflow-hidden">
                <p className="text-royal-blue-400"># Initializing Practical Sandbox Mode...</p>
                <p className="text-emerald-400">$ Edqoo deploy --track data-science</p>
                <p className="text-slate-400">Loading datasets... [OK]</p>
                <p className="text-slate-400">Fitting Linear regression model... [OK]</p>
                <p className="text-yellow-400">&gt;&gt; Model Accuracy: 98.4% (R-Squared)</p>
                <p className="text-emerald-400">$ Edqoo audit --track cybersecurity</p>
                <p className="text-slate-400">Auditing firewalls... Ports open: 22, 80, 443</p>
                <p className="text-red-400">Vulnerability Detected: CVE-2026-X [CRITICAL]</p>
                <p className="text-slate-400">Patching web filters... Sandbox secured!</p>
                <p className="text-emerald-400">$ Edqoo success --skills-built</p>
              </div>
            </div>

            {/* Floating Visual Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-0 right-4 z-20 bg-white border border-royal-blue-200 rounded-xl p-3 shadow-md flex items-center gap-2.5"
            >
              <div className="p-1.5 bg-royal-blue-100 text-royal-blue-600 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-royal-blue-600 font-bold tracking-wider">LMS Verified</span>
                <span className="text-xs font-bold text-deep-navy-900 block">Cybersecurity</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 2, ease: 'easeInOut' }}
              className="absolute bottom-4 left-4 z-20 bg-white border border-royal-blue-200 rounded-xl p-3 shadow-md flex items-center gap-2.5"
            >
              <div className="p-1.5 bg-royal-blue-100 text-royal-blue-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-royal-blue-600 font-bold tracking-wider">Analytics</span>
                <span className="text-xs font-bold text-deep-navy-900 block">Data Science</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. TRUST SECTION */}
      <section className="bg-deep-navy-50 border-y border-deep-navy-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Master Skills That Matter in the Real World
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 md:gap-16 text-deep-navy-900 font-display font-semibold text-sm sm:text-base">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-royal-blue-600" />
              Practical Labs
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-royal-blue-600" />
              Expert-Led Coursework
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-royal-blue-600" />
              Project-Based Portfolios
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-royal-blue-600" />
              Career-Focused Outcomes
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-royal-blue-600" />
              Industry Certification
            </span>
          </div>
        </div>
      </section>

      {/* 5. EXPLORE PROGRAMS & FILTER SYSTEM - REDESIGNED */}
      <section id="programs" className="section-padding bg-white">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <span className="text-royal-blue-600 text-xs font-bold tracking-widest uppercase block">
            FIND YOUR IDEAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-deep-navy-900">
            Explore Our Programs
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Build practical skills in the technologies shaping tomorrow's careers.
          </p>
        </div>

        {/* Categories Sidebar & Course Cards Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Category Sidebar navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-deep-navy-200 rounded-xl p-3 shadow-sm sticky top-28">
            <div className="space-y-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 text-xs font-bold rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-royal-blue-600 text-white shadow-sm'
                        : 'text-deep-navy-900 hover:bg-deep-navy-50 hover:text-royal-blue-600'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    <span className={`text-[10px] transition-transform ${isActive ? 'translate-x-0.5 text-white' : 'text-slate-400'}`}>
                      ➔
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Horizontal scrollable pills/tabs filter navigation (Mobile/Tablet) */}
          <div className="lg:hidden w-full overflow-x-auto pb-3 scrollbar-none flex gap-2 px-2 -mx-2 mb-4 justify-start">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-lg whitespace-nowrap border flex-shrink-0 flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-royal-blue-600 text-white border-royal-blue-600 shadow-sm'
                      : 'bg-white text-deep-navy-900 border-deep-navy-200 hover:border-slate-350'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Program Grid Side */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Horizontal Line Program Header */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-royal-blue-600 whitespace-nowrap">
                POPULAR PROGRAMS
              </span>
              <div className="flex-1 h-[1px] bg-deep-navy-200" />
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isComingSoon = course.status === 'coming-soon';
                return (
                  <div
                    key={course.id}
                    className="premium-card flex flex-col justify-between h-[420px]"
                  >
                    {/* Course Card Header Image */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 border-b border-deep-navy-200">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-deep-navy-900/90 text-white text-[9px] font-bold rounded uppercase tracking-wider">
                        {course.category}
                      </span>
                      {isComingSoon && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-royal-blue-600 text-white text-[9px] font-bold rounded uppercase tracking-wider">
                          Coming Soon
                        </span>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h3 className="font-display font-bold text-sm text-deep-navy-900 hover:text-royal-blue-600 transition-colors line-clamp-1">
                          {isComingSoon ? course.title : <Link to={`/courses/${course.slug}`}>{course.title}</Link>}
                        </h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Technical Skills and metadata tags */}
                      <div className="space-y-3 mt-2">
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-1.5 py-0.5 bg-deep-navy-50 text-deep-navy-800 text-[9px] font-semibold rounded">
                              {skill}
                            </span>
                          ))}
                          {course.skills.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-deep-navy-50 text-slate-400 text-[9px] font-medium rounded">
                              +{course.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {!isComingSoon && (
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold border-t border-deep-navy-100 pt-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-slate-400" />
                              Online
                            </span>
                            <span className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-3 h-3 fill-current" />
                              {course.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CTA & Pricing Footer */}
                      <div className="pt-3 border-t border-deep-navy-100 flex items-center justify-between">
                        {isComingSoon ? (
                          <div className="w-full">
                            {notifiedEmails[course.id] ? (
                              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] rounded-lg text-center font-bold">
                                ✓ We will notify you!
                              </div>
                            ) : (
                              <form onSubmit={(e) => handleNotifySubmit(e, course.id)} className="flex gap-1.5 w-full">
                                <input
                                  type="email"
                                  required
                                  placeholder="Email for notification"
                                  value={emailInput[course.id] || ''}
                                  onChange={(e) => handleEmailChange(course.id, e.target.value)}
                                  className="flex-1 px-2.5 py-1.5 bg-deep-navy-50 border border-deep-navy-200 text-[10px] rounded-lg focus:outline-none focus:border-royal-blue-500 text-deep-navy-900"
                                />
                                <button
                                  type="submit"
                                  className="px-3 py-1.5 bg-royal-blue-600 hover:bg-royal-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors flex-shrink-0"
                                >
                                  Notify Me
                                </button>
                              </form>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 line-through leading-none">₹{course.originalPrice}</span>
                              <span className="text-deep-navy-900 font-extrabold text-base leading-tight">₹{course.price}</span>
                            </div>
                            <Link
                              to={`/courses/${course.slug}`}
                              className="btn-primary px-5 py-2 text-[10px] font-bold rounded-lg inline-flex items-center justify-center gap-1.5"
                            >
                              Details
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </>
                        )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All Programs Link */}
              <div className="flex justify-end pt-4">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-royal-blue-600 hover:text-royal-blue-700 transition-colors"
                >
                  View All Programs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        </section>

      {/* 6. CYBERSECURITY FEATURED PROGRAM SECTION - Re-themed to light-blue */}
      <section className="bg-deep-navy-50 text-deep-navy-900 py-20 relative overflow-hidden border-b border-deep-navy-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#1268e808,transparent_45%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block px-3 py-1 bg-royal-blue-100 border border-royal-blue-200 text-royal-blue-600 text-xs font-bold rounded-md uppercase tracking-wider">
              Featured Track // Available Now
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-deep-navy-900 tracking-tight leading-tight">
              Master Cybersecurity Through <br className="hidden sm:inline" />
              <span className="text-royal-blue-600">
                Practical Defensive Learning
              </span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
              Gain intermediate to advanced defensive hacking capabilities. Edqoo is structured around defensive configurations, system pen-testing scans, network captures, and auditing report methodologies. Build actual competence in:
            </p>

            {/* Grid checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6">
              {[
                'Cybersecurity Fundamentals',
                'Ethical Hacking Scanning & Vulns',
                'Networking & Wireshark Captures',
                'Web Application Security',
                'Linux Command Line Hardening',
                'Vulnerability Assessments',
                'Firewalls & Snort IDS Setup',
                'SIEM Logs Splunk Monitoring'
              ].map((skill) => (
                <div key={skill} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-royal-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs font-bold text-deep-navy-800">{skill}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link to="/courses/cybersecurity" className="btn-primary px-6 py-3 text-xs font-bold rounded-lg flex items-center gap-1.5">
                Explore Cybersecurity
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Includes 3 Hands-On Labs & Capstone Audit
              </span>
            </div>
          </div>

          {/* Right Column visual box */}
          <div className="lg:col-span-5 bg-white border border-deep-navy-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-semibold text-sm text-deep-navy-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-royal-blue-500" />
              Curriculum Outline
            </h3>
            
            <div className="space-y-3 text-xs">
              {[
                { module: 'Module 1-3', title: 'Linux, Networking & Security Fundamentals' },
                { module: 'Module 4-6', title: 'Ethical Hacking, Web & Network Exploits' },
                { module: 'Module 7-8', title: 'Vulnerability Analysis & SIEM Operations' },
                { module: 'Module 9-10', title: 'Defensive Labs & Capstone Audit Project' }
              ].map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-deep-navy-50 rounded-xl border border-deep-navy-200 hover:border-royal-blue-500/40 transition-colors">
                  <div className="text-left">
                    <span className="text-[10px] text-royal-blue-600 font-bold block">{step.module}</span>
                    <span className="font-semibold text-deep-navy-900 mt-0.5 block">{step.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Verified</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. DATA SCIENCE FEATURED PROGRAM SECTION */}
      <section className="bg-white py-20 relative border-b border-deep-navy-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column visual display */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative bg-deep-navy-50 border border-deep-navy-200 rounded-2xl p-6 shadow-sm">
              <span className="absolute -top-3 left-6 px-3 py-1 bg-royal-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                Tools & Technologies Covered
              </span>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-center">
                {[
                  { name: 'Python', desc: 'Core Programming' },
                  { name: 'Pandas', desc: 'Data Manipulation' },
                  { name: 'NumPy', desc: 'Matrix Math' },
                  { name: 'SQL', desc: 'Database Querying' },
                  { name: 'Matplotlib', desc: 'Data Plotting' },
                  { name: 'Seaborn', desc: 'Statistical Plots' },
                  { name: 'Scikit-Learn', desc: 'Machine Learning' },
                  { name: 'Jupyter', desc: 'Notebook Workspaces' },
                  { name: 'Git/GitHub', desc: 'Version Control' }
                ].map((tech) => (
                  <div key={tech.name} className="p-3 bg-white border border-deep-navy-200 hover:border-royal-blue-500 rounded-xl transition-all shadow-sm">
                    <span className="text-sm font-bold text-deep-navy-900 block">{tech.name}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">{tech.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Content */}
          <div className="lg:col-span-7 space-y-6 text-left order-1 lg:order-2">
            <span className="inline-block px-3 py-1 bg-royal-blue-100 border border-royal-blue-200 text-royal-blue-600 text-xs font-bold rounded-md uppercase tracking-wider">
              Core Track // In-Demand Skills
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-deep-navy-900 tracking-tight leading-tight">
              Turn Data Into Decisions <br />
              <span className="text-royal-blue-600">
                With Project-Based Portfolios
              </span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Build a strong foundation in programmatic analytics. Rather than relying on simple spreadsheets, learn to write logic parameters, clean complex datasets, conduct statistical hypotheses, and train predictive machine learning pipelines.
            </p>

            <div className="space-y-3.5">
              {[
                { title: 'Write Clean Python Scripts', desc: 'Master variables, loops, custom function arguments, and library management pipelines.' },
                { title: 'Aggregate Large Scale Tabular Data', desc: 'Clean missing rows, merge disparate tables, and aggregate metrics using Pandas and NumPy arrays.' },
                { title: 'Build Predictive Models', desc: 'Configure linear regressions, classification trees, random forests, and parameter tuning grids.' }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-royal-blue-100 flex items-center justify-center text-royal-blue-600 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-deep-navy-900">{step.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link to="/courses/data-science" className="btn-primary px-6 py-3 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm">
                Explore Data Science
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Includes 3 Business Projects & Streamlit App
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHY Edqoo - Re-themed to Light Blue background with white cards */}
      <section className="bg-deep-navy-50 border-b border-deep-navy-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-royal-blue-600 text-xs font-bold tracking-widest uppercase block">
              OUR MISSION
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-deep-navy-900">
              Why Learn With Edqoo?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We focus on building functional ability rather than offering standard passive video watching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Practical Learning', icon: Layers, desc: 'Every topic is mapped directly to command outputs, coding environments, or terminal interactions.' },
              { title: 'Industry-Relevant Curriculum', icon: ShieldCheck, desc: 'Syllabus guidelines are designed around production tech requirements, avoiding outdated logic.' },
              { title: 'Real-World Projects', icon: Award, desc: 'Complete projects using actual code parameters, building a Github portfolio that stands out in recruiter reviews.' },
              { title: 'Expert Guidance', icon: Users, desc: 'Courses are created and curated by industry practitioners who have guided enterprise systems configurations.' },
              { title: 'Flexible Learning Pace', icon: Clock, desc: 'Learn on your schedule. Access lesson videos, datasets, resource files, and test files indefinitely.' },
              { title: 'Career-Focused Skills', icon: TrendingUp, desc: 'Every lesson targets skills needed for junior to mid-level technician functions in modern engineering fields.' }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm hover:border-royal-blue-600 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-royal-blue-100 flex items-center justify-center text-royal-blue-600 mb-4 border border-royal-blue-200">
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="font-display font-bold text-base text-deep-navy-900 mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. STATISTICS - Re-themed to Solid Blue background */}
      <section className="bg-royal-blue-600 text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
          {statsData.map((stat) => (
            <div key={stat.id} className="space-y-1">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white block">
                {stat.value}
              </span>
              <span className="text-xs font-semibold text-royal-blue-100 uppercase tracking-widest block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 10. HOW IT WORKS */}
      <section className="section-padding bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <span className="text-royal-blue-600 text-xs font-bold tracking-widest uppercase block">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-deep-navy-900">
            How Edqoo Works
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            A simple 4-step path from selecting your course to obtaining your career verification.
          </p>
        </div>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden lg:grid grid-cols-4 gap-8 relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-deep-navy-200/80 -translate-y-1/2 z-0" />
          
          {[
            { step: '01', title: 'Choose Your Course', desc: 'Select between Cybersecurity or Data Science tracks based on your career interests.' },
            { step: '02', title: 'Learn Through Practical Content', desc: 'Interact with direct command parameters, system tools, and detailed script modules.' },
            { step: '03', title: 'Build Real Projects', desc: 'Write actual code to resolve challenges, compiling a portfolio recruiters review.' },
            { step: '04', title: 'Earn Your Certificate', desc: 'Submit assignments to verify competencies and earn digital shareable verification.' }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 bg-deep-navy-50 border border-deep-navy-200 p-6 rounded-2xl shadow-sm space-y-3 hover:border-royal-blue-600 transition-colors">
              <span className="text-2xl font-display font-extrabold text-royal-blue-600 block leading-none">{item.step}</span>
              <h3 className="font-display font-bold text-sm text-deep-navy-900">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden space-y-6 relative pl-6 border-l border-deep-navy-200">
          {[
            { step: '01', title: 'Choose Your Course', desc: 'Select between Cybersecurity or Data Science tracks based on your career interests.' },
            { step: '02', title: 'Learn Through Practical Content', desc: 'Interact with direct command parameters, system tools, and detailed script modules.' },
            { step: '03', title: 'Build Real Projects', desc: 'Write actual code to resolve challenges, compiling a portfolio recruiters review.' },
            { step: '04', title: 'Earn Your Certificate', desc: 'Submit assignments to verify competencies and earn digital shareable verification.' }
          ].map((item, idx) => (
            <div key={idx} className="relative space-y-2">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-royal-blue-600 border-4 border-white shadow-sm" />
              <span className="text-xl font-display font-extrabold text-royal-blue-600 block leading-none">{item.step}</span>
              <h3 className="font-display font-bold text-sm text-deep-navy-900">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. TESTIMONIALS - Re-themed */}
      <section className="bg-deep-navy-50 border-y border-deep-navy-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-royal-blue-600 text-xs font-bold tracking-widest uppercase block">
              STUDENT REVIEWS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-deep-navy-900">
              What Our Learners Say
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Read real stories from graduates who pivoted into security and analytics roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((item) => (
              <div key={item.id} className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-royal-blue-600 transition-all">
                <p className="text-slate-600 text-xs italic leading-relaxed">
                  "{item.content}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-deep-navy-100">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-deep-navy-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-deep-navy-900 block">{item.name}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{item.role}</span>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-1">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[9px] font-semibold bg-royal-blue-100 text-royal-blue-600 px-1.5 py-0.5 rounded uppercase">
                      {item.courseName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. INSTRUCTOR SECTION */}
      <section className="section-padding bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <span className="text-royal-blue-600 text-xs font-bold tracking-widest uppercase block">
            Edqoo INSTRUCTORS
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-deep-navy-900">
            Learn From Experienced Professionals
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Edqoo tracks are crafted by practitioners who have managed enterprise systems, engineered datasets, and conducted security audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {instructors.map((item) => (
            <div key={item.id} className="bg-white border border-deep-navy-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:border-royal-blue-600 transition-all">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-2xl object-cover border border-deep-navy-200 flex-shrink-0"
              />
              <div className="space-y-2.5 text-center sm:text-left">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">{item.name}</h3>
                  <span className="text-xs text-royal-blue-600 font-semibold">{item.role}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {item.bio}
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {item.expertise.map((exp) => (
                    <span key={exp} className="px-2 py-0.5 bg-deep-navy-50 text-deep-navy-800 text-[10px] font-semibold rounded">
                      {exp}
                    </span>
                  ))}
                </div>
                <a
                  href={item.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-royal-blue-600 hover:text-royal-blue-700 font-bold"
                >
                  View LinkedIn Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. RESOURCES (Blog Highlights) */}
      <section className="bg-deep-navy-50 border-t border-deep-navy-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4 text-left">
            <div>
              <span className="text-royal-blue-600 text-xs font-bold tracking-widest uppercase block">
                NEWS & RESOURCES
              </span>
              <h2 className="text-3xl font-display font-extrabold text-deep-navy-900 mt-1">
                Latest Resources & Insights
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                Stay updated on security compliance roadmaps, python libraries, and data science strategies.
              </p>
            </div>
            <Link to="/resources" className="btn-secondary text-xs px-5 py-2.5 font-bold rounded-lg whitespace-nowrap">
              All Resources
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="bg-white border border-deep-navy-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-royal-blue-600 transition-all">
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-royal-blue-600 uppercase">
                      {post.category}
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-900 hover:text-royal-blue-600 transition-colors line-clamp-2">
                      <Link to={`/resources/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-450 font-semibold pt-3 border-t border-deep-navy-100">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. FINAL CTA - Re-themed to Deep Navy + Blue Gradient */}
      <section className="bg-gradient-to-tr from-deep-navy-900 to-royal-blue-800 text-white py-20 text-center relative overflow-hidden">
        {/* Visual Blur */}
        <div className="absolute w-[450px] h-[450px] bg-royal-blue-800/10 rounded-full blur-3xl pointer-events-none -bottom-36 -right-36" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight">
            Ready to Build Your Next Skill?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Start learning practical technology skills with Edqoo. Join our live programs today and prepare for system-audits or predictive data roles.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link to="/courses" className="btn-primary bg-white text-royal-blue-600 border-white hover:bg-deep-navy-50 hover:text-royal-blue-700 px-8 py-3 text-xs font-bold rounded-lg shadow-sm">
              Explore Courses
            </Link>
            <Link to="/register" className="btn-secondary bg-transparent text-white border-white hover:bg-white/10 px-8 py-3 text-xs font-bold rounded-lg">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

