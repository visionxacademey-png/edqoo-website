// import React, { useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { 
//   Clock, BookOpen, Star, CheckCircle2, 
//   ChevronRight, Award, ArrowRight, User 
// } from 'lucide-react';
// import { courses } from '../../data/courses';
// import { instructors } from '../../data/instructors';
// import { Accordion } from '../../components/ui/Accordion';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { SEO } from '../../components/common/SEO';

// export const CourseDetails: React.FC = () => {
//   const { slug } = useParams<{ slug: string }>();
//   const navigate = useNavigate();
//   const { addToCart, isInCart } = useCart();
//   const { isEnrolled } = useAuth();
  
//   const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'faqs'>('overview');

//   const course = courses.find((c) => c.slug === slug);

//   if (!course) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
//         <h2 className="text-xl font-bold text-slate-800 font-display">Course Not Found</h2>
//         <p className="text-xs text-slate-500">The requested course program does not exist or has been relocated.</p>
//         <Link to="/courses" className="btn-primary px-5 py-2.5 text-xs font-semibold rounded-lg shadow">
//           Back to Courses
//         </Link>
//       </div>
//     );
//   }

//   const instructor = instructors[course.id === 'cybersecurity' ? 0 : 1] || instructors[0];
//   const userEnrolled = isEnrolled(course.id);

//   // Handle Enrollment navigation
//   const handleEnrollment = () => {
//     if (userEnrolled) {
//       navigate('/dashboard/my-courses');
//       return;
//     }

//     if (isInCart(course.id)) {
//       navigate(`/checkout/${course.id}`);
//     } else {
//       addToCart({
//         courseId: course.id,
//         title: course.title,
//         price: course.price,
//         image: course.image,
//         slug: course.slug
//       });
//       navigate(`/checkout/${course.id}`);
//     }
//   };

//   // Convert Curriculum Modules to Accordion Schema
//   const curriculumItems = (course.modules || []).map((mod) => ({
//     id: mod.id,
//     title: mod.title,
//     subtitle: `${mod.lessons.length} Lessons`,
//     content: (
//       <ul className="space-y-2 text-xs text-slate-600">
//         {mod.lessons.map((lesson) => (
//           <li key={lesson.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
//             <span className="flex items-center gap-2">
//               <Play className="w-3.5 h-3.5 text-slate-400" />
//               <span className="font-medium text-slate-700">{lesson.title}</span>
//             </span>
//             <div className="flex items-center gap-2.5">
//               {lesson.isPreview && (
//                 <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase tracking-wider">
//                   Preview
//                 </span>
//               )}
//               <span className="text-[10px] text-slate-400 font-mono">{lesson.duration}</span>
//             </div>
//           </li>
//         ))}
//       </ul>
//     )
//   }));

//   // FAQ mock items
//   const faqItems = [
//     {
//       id: 'faq-1',
//       title: 'Is this course suitable for complete beginners?',
//       content: 'Yes! Both Cybersecurity and Data Science Certificate programs start from absolute scratch. No prior coding or systems administration history is required. We teach Linux command lines, Python syntax, and database query setups in the initial modules.'
//     },
//     {
//       id: 'faq-2',
//       title: 'Do I get a certificate upon completion?',
//       content: 'Absolutely. Once you finish all lesson modules, submit the practical lab assignments, and complete the Capstone audit/notebook program, you will earn a verifiable digital Edqoo Certificate of Completion to showcase on LinkedIn or your resume.'
//     },
//     {
//       id: 'faq-3',
//       title: 'Are the labs simulated or live?',
//       content: 'The labs are designed to run on your actual machine or via local virtualized hosts (like Kali/Ubuntu VMs) to simulate raw production tasks. This project-focused design ensures you build practical competencies instead of clicking through static HTML simulators.'
//     },
//     {
//       id: 'faq-4',
//       title: 'How long do I have access to the materials?',
//       content: 'You receive lifetime access to all enrolled course videos, syllabus code files, resources, cheat sheets, and future curriculum patch updates. There are no monthly subscriptions.'
//     }
//   ].map((faq) => ({
//     id: faq.id,
//     title: faq.title,
//     content: <p className="text-xs leading-relaxed text-slate-500">{faq.content}</p>
//   }));

//   // Mock Reviews
//   const reviews = [
//     { name: 'Alexander P.', rating: 5, date: '1 month ago', text: 'Excellent depth. The Splunk log queries and ethical hacking Scanning modules were extremely detailed. The capstone audit is highly technical.' },
//     { name: 'Meera S.', rating: 5, date: '2 weeks ago', text: 'I appreciated the statistics and pandas cleaning layouts. The ML regressions models are thoroughly explained.' }
//   ];

//   return (
//     <div className="bg-deep-navy-50 min-h-screen">
//       <SEO 
//         title={course.title}
//         description={course.description}
//         canonical={`/courses/${course.slug}`}
//         ogImage={course.image}
//       />
//       {/* 20. Course Details Header Hero */}
//       <section className="bg-deep-navy-950 text-white py-16 border-b border-deep-navy-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-left">
//           <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
//             <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
//             <ChevronRight className="w-3.5 h-3.5" />
//             <span className="text-royal-blue-300">{course.category}</span>
//           </div>

//           <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight max-w-4xl">
//             {course.title}
//           </h1>

//           <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
//             {course.description}
//           </p>

//           {/* Quick stats indicators */}
//           <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-400">
//             <span className="flex items-center gap-1.5">
//               <Star className="w-4 h-4 text-yellow-500 fill-current" />
//               <span className="text-white">{course.rating}</span> ({course.students} Learners Enrolled)
//             </span>
//             <span className="flex items-center gap-1.5">
//               <Clock className="w-4 h-4" />
//               {course.duration}
//             </span>
//             <span className="flex items-center gap-1.5">
//               <BookOpen className="w-4 h-4" />
//               {course.lessons} Lessons
//             </span>
//             <span className="flex items-center gap-1.5">
//               <User className="w-4 h-4" />
//               Level: {course.level}
//             </span>
//           </div>
//         </div>
//       </section>

//       {/* Main Content Layout (Grid: Main (8) vs sticky sidebar (4)) */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
//         {/* Left Column (8 cols) */}
//         <div className="lg:col-span-8 space-y-8">
          
//           {/* Sub Navigation Tabs */}
//           <div className="flex border-b border-deep-navy-200 gap-6 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold text-slate-500">
//             {[
//               { id: 'overview', label: 'Overview' },
//               { id: 'curriculum', label: 'Curriculum' },
//               { id: 'instructor', label: 'Instructor' },
//               { id: 'faqs', label: 'FAQs' }
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id as any)}
//                 className={`pb-3.5 border-b-2 whitespace-nowrap transition-colors ${
//                   activeTab === tab.id
//                     ? 'border-royal-blue-600 text-royal-blue-600 font-bold'
//                     : 'border-transparent hover:text-royal-blue-600'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Tab: Overview */}
//           {activeTab === 'overview' && (
//             <div className="space-y-8 text-left">
//               {/* What You'll Learn section */}
//               <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm space-y-4">
//                 <h3 className="font-display font-bold text-base text-deep-navy-900">What You'll Learn</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
//                   {course.skills.map((skill) => (
//                     <div key={skill} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
//                       <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
//                       <span>{skill}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Requirements & Target Audience */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Requirements */}
//                 <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm space-y-3.5">
//                   <h4 className="font-display font-bold text-sm text-deep-navy-900">Requirements</h4>
//                   <ul className="space-y-2 text-xs text-slate-500 leading-relaxed list-disc pl-4">
//                     {course.requirements?.map((req, i) => (
//                       <li key={i}>{req}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Target Audience */}
//                 <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm space-y-3.5">
//                   <h4 className="font-display font-bold text-sm text-deep-navy-900">Who This Course Is For</h4>
//                   <ul className="space-y-2 text-xs text-slate-500 leading-relaxed list-disc pl-4">
//                     {course.whoIsItFor?.map((who, i) => (
//                       <li key={i}>{who}</li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* Certificate Section */}
//               <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
//                 <div className="w-12 h-12 rounded-xl bg-royal-blue-100 border border-royal-blue-200 flex items-center justify-center text-royal-blue-600 flex-shrink-0">
//                   <Award className="w-6 h-6" />
//                 </div>
//                 <div className="space-y-2 text-center sm:text-left">
//                   <h4 className="font-display font-bold text-sm text-deep-navy-900">Shareable Digital Verification</h4>
//                   <p className="text-xs text-slate-500 leading-relaxed">
//                     Upon passing the Capstone practical audit assignment parameters, you will earn a verifiable digital Edqoo Certificate of Completion to display on LinkedIn.
//                   </p>
//                 </div>
//               </div>

//               {/* Reviews/Feedbacks */}
//               <div className="space-y-4">
//                 <h4 className="font-display font-bold text-sm text-deep-navy-900">Recent Learner Feedback</h4>
//                 <div className="space-y-3">
//                   {reviews.map((rev, i) => (
//                     <div key={i} className="bg-white border border-deep-navy-200 p-4 rounded-xl shadow-sm text-xs space-y-2">
//                       <div className="flex items-center justify-between font-semibold">
//                         <span className="text-deep-navy-900">{rev.name}</span>
//                         <span className="text-slate-400 font-normal">{rev.date}</span>
//                       </div>
//                       <div className="flex text-amber-400 gap-0.5">
//                         {[...Array(rev.rating)].map((_, idx) => (
//                           <Star key={idx} className="w-3 h-3 fill-current" />
//                         ))}
//                       </div>
//                       <p className="text-slate-500 leading-relaxed">"{rev.text}"</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Tab: Curriculum Accordions */}
//           {activeTab === 'curriculum' && (
//             <div className="space-y-4 text-left">
//               <div className="flex items-center justify-between border-b border-deep-navy-200 pb-2">
//                 <h3 className="font-display font-bold text-base text-deep-navy-900">Course Syllabus</h3>
//                 <span className="text-xs text-slate-400 font-semibold uppercase">{course.lessons} Lessons</span>
//               </div>
//               <Accordion items={curriculumItems} allowMultiple={true} defaultOpenId={course.modules?.[0]?.id} />
//             </div>
//           )}

//           {/* Tab: Instructors */}
//           {activeTab === 'instructor' && (
//             <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-left">
//               <img
//                 src={instructor.image}
//                 alt={instructor.name}
//                 className="w-24 h-24 rounded-2xl object-cover border border-deep-navy-200 flex-shrink-0"
//               />
//               <div className="space-y-3">
//                 <div>
//                   <h3 className="font-display font-bold text-lg text-deep-navy-900 leading-none">{instructor.name}</h3>
//                   <span className="text-xs text-royal-blue-600 font-semibold mt-1 block">{instructor.role}</span>
//                 </div>
//                 <p className="text-xs text-slate-500 leading-relaxed">
//                   {instructor.bio}
//                 </p>
//                 <div className="flex flex-wrap gap-1.5">
//                   {instructor.expertise.map((exp) => (
//                     <span key={exp} className="px-2.5 py-0.5 bg-deep-navy-50 text-deep-navy-800 text-[10px] font-semibold rounded">
//                       {exp}
//                     </span>
//                   ))}
//                 </div>
//                 <a
//                   href={instructor.linkedin}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-1.5 text-xs text-royal-blue-600 font-bold hover:text-royal-blue-700 pt-1"
//                 >
//                   View LinkedIn Profile
//                   <ArrowRight className="w-3.5 h-3.5" />
//                 </a>
//               </div>
//             </div>
//           )}

//           {/* Tab: FAQs */}
//           {activeTab === 'faqs' && (
//             <div className="space-y-4 text-left">
//               <h3 className="font-display font-bold text-base text-deep-navy-900 border-b border-deep-navy-200 pb-2">
//                 Frequently Asked Questions
//               </h3>
//               <Accordion items={faqItems} allowMultiple={true} />
//             </div>
//           )}

//         </div>

//         {/* Right Column: Pricing card (4 cols) */}
//         <aside className="lg:col-span-4 bg-white border border-deep-navy-200 rounded-2xl shadow-md overflow-hidden sticky top-24">
//           <div className="aspect-[16/10] overflow-hidden bg-slate-100 border-b border-deep-navy-200">
//             <img
//               src={course.image}
//               alt={course.title}
//               className="w-full h-full object-cover"
//             />
//           </div>

//           <div className="p-6 space-y-6 text-left">
//             <div className="space-y-1">
//               <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Course Pricing</span>
//               <div className="flex items-baseline gap-2">
//                 <span className="text-2xl font-display font-extrabold text-deep-navy-900">${course.price}</span>
//                 <span className="text-sm text-slate-400 line-through font-semibold">${course.originalPrice}</span>
//                 <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded animate-pulse">60% Off</span>
//               </div>
//             </div>

//             <button
//               onClick={handleEnrollment}
//               className="btn-primary w-full py-3.5 font-bold rounded-xl shadow-sm"
//             >
//               {userEnrolled ? 'Go to Classroom' : 'Enroll Now'}
//             </button>

//             {/* Checklist of features */}
//             <div className="space-y-3 text-xs text-slate-600 font-medium pt-2 border-t border-deep-navy-200">
//               <span className="text-[10px] uppercase text-slate-400 font-bold block tracking-widest mb-1">Includes</span>
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//                 <span>Lifetime access to all lessons</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//                 <span>3 Hands-On Labs and assignments</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//                 <span>Shareable completion certificate</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//                 <span>Active Q&A and support forum access</span>
//               </div>
//             </div>
//           </div>
//         </aside>

//       </div>
//     </div>
//   );
// };

// // Reusable micro icon wrapper inside curriculum
// const Play: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg
//     viewBox="0 0 24 24"
//     width="24"
//     height="24"
//     stroke="currentColor"
//     strokeWidth="2"
//     fill="none"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     {...props}
//   >
//     <polygon points="5 3 19 12 5 21 5 3" />
//   </svg>
// );


import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, BookOpen, Star, CheckCircle2, 
  ChevronRight, Award, ArrowRight, User 
} from 'lucide-react';
import { courses } from '../../data/courses';
import { instructors } from '../../data/instructors';
import { Accordion } from '../../components/ui/Accordion';
import { SEO } from '../../components/common/SEO';

export const CourseDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'faqs'>('overview');

  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 font-display">Course Not Found</h2>
        <p className="text-xs text-slate-500">The requested course program does not exist or has been relocated.</p>
        <Link to="/courses" className="btn-primary px-5 py-2.5 text-xs font-semibold rounded-lg shadow">
          Back to Courses
        </Link>
      </div>
    );
  }

  const instructor = instructors[course.id === 'cybersecurity' ? 0 : 1] || instructors[0];

  // WhatsApp enquiry configuration
  // Replace this with the Edqoo WhatsApp number in international format.
  // Example for India: 919876543210 (without +, spaces, or dashes)
  const WHATSAPP_NUMBER = '91XXXXXXXXXX';

  // Open WhatsApp with the selected course name pre-filled in the message.
  const handleEnquiry = () => {
    const message = `Hello Edqoo, I would like to enquire about the ${course.title} course. Please share the course details, fees, and enrollment information.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Convert Curriculum Modules to Accordion Schema
  const curriculumItems = (course.modules || []).map((mod) => ({
    id: mod.id,
    title: mod.title,
    subtitle: `${mod.lessons.length} Lessons`,
    content: (
      <ul className="space-y-2 text-xs text-slate-600">
        {mod.lessons.map((lesson) => (
          <li key={lesson.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
            <span className="flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">{lesson.title}</span>
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
      title: 'Is this course suitable for complete beginners?',
      content: 'Yes! Both Cybersecurity and Data Science Certificate programs start from absolute scratch. No prior coding or systems administration history is required. We teach Linux command lines, Python syntax, and database query setups in the initial modules.'
    },
    {
      id: 'faq-2',
      title: 'Do I get a certificate upon completion?',
      content: 'Absolutely. Once you finish all lesson modules, submit the practical lab assignments, and complete the Capstone audit/notebook program, you will earn a verifiable digital Edqoo Certificate of Completion to showcase on LinkedIn or your resume.'
    },
    {
      id: 'faq-3',
      title: 'Are the labs simulated or live?',
      content: 'The labs are designed to run on your actual machine or via local virtualized hosts (like Kali/Ubuntu VMs) to simulate raw production tasks. This project-focused design ensures you build practical competencies instead of clicking through static HTML simulators.'
    },
    {
      id: 'faq-4',
      title: 'How long do I have access to the materials?',
      content: 'You receive lifetime access to all enrolled course videos, syllabus code files, resources, cheat sheets, and future curriculum patch updates. There are no monthly subscriptions.'
    }
  ].map((faq) => ({
    id: faq.id,
    title: faq.title,
    content: <p className="text-xs leading-relaxed text-slate-500">{faq.content}</p>
  }));

  // Mock Reviews
  const reviews = [
    { name: 'Alexander P.', rating: 5, date: '1 month ago', text: 'Excellent depth. The Splunk log queries and ethical hacking Scanning modules were extremely detailed. The capstone audit is highly technical.' },
    { name: 'Meera S.', rating: 5, date: '2 weeks ago', text: 'I appreciated the statistics and pandas cleaning layouts. The ML regressions models are thoroughly explained.' }
  ];

  return (
    <div className="bg-deep-navy-50 min-h-screen">
      <SEO 
        title={course.title}
        description={course.description}
        canonical={`/courses/${course.slug}`}
        ogImage={course.image}
      />
      {/* 20. Course Details Header Hero */}
      <section className="bg-deep-navy-950 text-white py-16 border-b border-deep-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-left">
          <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
            <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-royal-blue-300">{course.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight max-w-4xl">
            {course.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {course.description}
          </p>

          {/* Quick stats indicators */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-white">{course.rating}</span> ({course.students} Learners Enrolled)
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              {course.lessons} Lessons
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              Level: {course.level}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout (Grid: Main (8) vs sticky sidebar (4)) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-deep-navy-200 gap-6 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold text-slate-500">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'curriculum', label: 'Curriculum' },
              { id: 'instructor', label: 'Instructor' },
              { id: 'faqs', label: 'FAQs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3.5 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-royal-blue-600 text-royal-blue-600 font-bold'
                    : 'border-transparent hover:text-royal-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8 text-left">
              {/* What You'll Learn section */}
              <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-display font-bold text-base text-deep-navy-900">What You'll Learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {course.skills.map((skill) => (
                    <div key={skill} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements & Target Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Requirements */}
                <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm space-y-3.5">
                  <h4 className="font-display font-bold text-sm text-deep-navy-900">Requirements</h4>
                  <ul className="space-y-2 text-xs text-slate-500 leading-relaxed list-disc pl-4">
                    {course.requirements?.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Target Audience */}
                <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm space-y-3.5">
                  <h4 className="font-display font-bold text-sm text-deep-navy-900">Who This Course Is For</h4>
                  <ul className="space-y-2 text-xs text-slate-500 leading-relaxed list-disc pl-4">
                    {course.whoIsItFor?.map((who, i) => (
                      <li key={i}>{who}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Certificate Section */}
              <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-royal-blue-100 border border-royal-blue-200 flex items-center justify-center text-royal-blue-600 flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-display font-bold text-sm text-deep-navy-900">Shareable Digital Verification</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upon passing the Capstone practical audit assignment parameters, you will earn a verifiable digital Edqoo Certificate of Completion to display on LinkedIn.
                  </p>
                </div>
              </div>

              {/* Reviews/Feedbacks */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-deep-navy-900">Recent Learner Feedback</h4>
                <div className="space-y-3">
                  {reviews.map((rev, i) => (
                    <div key={i} className="bg-white border border-deep-navy-200 p-4 rounded-xl shadow-sm text-xs space-y-2">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-deep-navy-900">{rev.name}</span>
                        <span className="text-slate-400 font-normal">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-500 leading-relaxed">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Curriculum Accordions */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-deep-navy-200 pb-2">
                <h3 className="font-display font-bold text-base text-deep-navy-900">Course Syllabus</h3>
                <span className="text-xs text-slate-400 font-semibold uppercase">{course.lessons} Lessons</span>
              </div>
              <Accordion items={curriculumItems} allowMultiple={true} defaultOpenId={course.modules?.[0]?.id} />
            </div>
          )}

          {/* Tab: Instructors */}
          {activeTab === 'instructor' && (
            <div className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-left">
              <img
                src={instructor.image}
                alt={instructor.name}
                className="w-24 h-24 rounded-2xl object-cover border border-deep-navy-200 flex-shrink-0"
              />
              <div className="space-y-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-deep-navy-900 leading-none">{instructor.name}</h3>
                  <span className="text-xs text-royal-blue-600 font-semibold mt-1 block">{instructor.role}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {instructor.bio}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {instructor.expertise.map((exp) => (
                    <span key={exp} className="px-2.5 py-0.5 bg-deep-navy-50 text-deep-navy-800 text-[10px] font-semibold rounded">
                      {exp}
                    </span>
                  ))}
                </div>
                <a
                  href={instructor.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-royal-blue-600 font-bold hover:text-royal-blue-700 pt-1"
                >
                  View LinkedIn Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Tab: FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 text-left">
              <h3 className="font-display font-bold text-base text-deep-navy-900 border-b border-deep-navy-200 pb-2">
                Frequently Asked Questions
              </h3>
              <Accordion items={faqItems} allowMultiple={true} />
            </div>
          )}

        </div>

        {/* Right Column: Pricing card (4 cols) */}
        <aside className="lg:col-span-4 bg-white border border-deep-navy-200 rounded-2xl shadow-md overflow-hidden sticky top-24">
          <div className="aspect-[16/10] overflow-hidden bg-slate-100 border-b border-deep-navy-200">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 space-y-6 text-left">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Course Pricing</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-display font-extrabold text-deep-navy-900">{course.price}</span>
                <span className="text-sm text-slate-400 line-through font-semibold">{course.originalPrice}</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded animate-pulse">60% Off</span>
              </div>
            </div>

            <button
              onClick={handleEnquiry}
              type="button"
              className="btn-primary w-full py-3.5 font-bold rounded-xl shadow-sm"
            >
              Enquire Now
            </button>

            {/* Checklist of features */}
            <div className="space-y-3 text-xs text-slate-600 font-medium pt-2 border-t border-deep-navy-200">
              <span className="text-[10px] uppercase text-slate-400 font-bold block tracking-widest mb-1">Includes</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Lifetime access to all lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>3 Hands-On Labs and assignments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Shareable completion certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Active Q&A and support forum access</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

// Reusable micro icon wrapper inside curriculum
const Play: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);