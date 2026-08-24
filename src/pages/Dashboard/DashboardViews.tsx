import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BookOpen, Award, CheckCircle2, Play, Download, User as UserIcon, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { courses } from '../../data/courses';

// 1. My Courses View Page
export const MyCourses: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const enrolled = courses.filter((c) => (user?.enrolledCourses || []).includes(c.id));

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-deep-navy-200 pb-3">
        <h2 className="text-xl font-display font-extrabold text-deep-navy-900">My Registered Programs</h2>
        <p className="text-xs text-slate-500">Access video modules, files, and sandbox guides.</p>
      </div>

      {enrolled.length === 0 ? (
        <div className="bg-white border border-deep-navy-200 p-12 rounded-2xl text-center space-y-4 shadow-sm max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-slate-350 mx-auto" />
          <h3 className="font-display font-bold text-deep-navy-900 text-sm">No courses enrolled</h3>
          <p className="text-xs text-slate-500">Enroll in Cybersecurity or Data Science to get started.</p>
          <Link to="/courses" className="btn-primary px-5 py-2 text-xs font-semibold rounded-lg shadow-sm">
            View Programs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolled.map((course) => {
            const completedList = user?.progress[course.id] || [];
            const progressPercentage = Math.round((completedList.length / course.lessons) * 100);
            const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id || '';

            return (
              <div key={course.id} className="bg-white border border-deep-navy-200 p-5 rounded-2xl shadow-sm hover:border-royal-blue-600 transition-all flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold bg-royal-blue-100 text-royal-blue-600 px-1.5 py-0.5 rounded">
                    {course.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-deep-navy-900 leading-snug">{course.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{course.description}</p>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-1.5 pt-1 border-t border-deep-navy-100">
                  <div className="flex justify-between text-[10px] text-slate-455 font-bold">
                    <span>Syllabus Progress</span>
                    <span className="font-mono">{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-deep-navy-100 rounded-full h-1.5">
                    <div className="bg-royal-blue-600 h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {completedList.length} of {course.lessons} lessons watched
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/dashboard/learn/${course.id}/${firstLessonId}`)}
                  className="btn-primary w-full py-2.5 font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Enter Classroom
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 2. Progress Tracking View Page
export const ProgressTracking: React.FC = () => {
  const { user } = useAuth();
  const enrolled = courses.filter((c) => (user?.enrolledCourses || []).includes(c.id));

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-deep-navy-200 pb-3">
        <h2 className="text-xl font-display font-extrabold text-deep-navy-900">Learning Progress</h2>
        <p className="text-xs text-slate-500">Track which modules have been completed.</p>
      </div>

      {enrolled.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-8">Enroll in a course to trace progress.</p>
      ) : (
        <div className="space-y-6">
          {enrolled.map((course) => {
            const completedList = user?.progress[course.id] || [];
            
            return (
              <div key={course.id} className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm space-y-4">
                <div className="border-b border-deep-navy-100 pb-3">
                  <h3 className="font-display font-bold text-sm text-deep-navy-900">{course.title}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{completedList.length} of {course.lessons} completed</span>
                </div>

                {/* Modules breakdown */}
                <div className="space-y-3">
                  {(course.modules || []).map((mod) => {
                    const completedInMod = mod.lessons.filter((l) => completedList.includes(l.id)).length;
                    const isModFinished = completedInMod === mod.lessons.length;

                    return (
                      <div key={mod.id} className="flex items-center justify-between p-3.5 bg-deep-navy-50 border border-deep-navy-200 rounded-xl">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-deep-navy-900 block">{mod.title}</span>
                          <span className="text-[10px] text-slate-455 block font-medium">
                            {completedInMod} of {mod.lessons.length} lessons completed
                          </span>
                        </div>
                        {isModFinished ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-250 uppercase">
                            Finished
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-deep-navy-100 text-slate-505 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            In Progress
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 3. Certificates View Page
export const Certificates: React.FC = () => {
  const { user } = useAuth();
  const enrolled = courses.filter((c) => (user?.enrolledCourses || []).includes(c.id));

  // Determine completed courses
  const completedCourses = enrolled.filter((course) => {
    const completedList = user?.progress[course.id] || [];
    return completedList.length === course.lessons;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-deep-navy-200 pb-3">
        <h2 className="text-xl font-display font-extrabold text-deep-navy-900">My Certificates</h2>
        <p className="text-xs text-slate-500">Download shareable verifications of your credentials.</p>
      </div>

      {completedCourses.length === 0 ? (
        <div className="bg-white border border-deep-navy-200 p-8 rounded-2xl text-center space-y-3 shadow-sm max-w-md mx-auto">
          <Award className="w-12 h-12 text-slate-350 mx-auto" />
          <h3 className="font-display font-bold text-deep-navy-900 text-sm">No certificates earned yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Certificates will be unlocked here once you mark all lessons in a course syllabus as complete.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedCourses.map((course) => (
            <div key={course.id} className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-250 flex items-center justify-center text-emerald-800">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-750 tracking-wider">Verifiable Credential</span>
                  <h3 className="font-display font-bold text-sm text-deep-navy-900">{course.title}</h3>
                  <span className="text-[10px] text-slate-400 block font-mono">ID: CERT-Edqoo-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
              </div>

              <button 
                onClick={() => alert('Downloading PDF Certificate Mock...')}
                className="btn-primary px-5 py-2.5 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. Settings View Page
interface ProfileInputs {
  name: string;
  phone: string;
}

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInputs>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || ''
    }
  });

  const onSubmit = async (data: ProfileInputs) => {
    // Save to auth local state
    const savedUser = localStorage.getItem('Edqoo_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const updated = { ...parsed, name: data.name, phone: data.phone };
      localStorage.setItem('Edqoo_user', JSON.stringify(updated));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-xl">
      <div className="border-b border-deep-navy-200 pb-3">
        <h2 className="text-xl font-display font-extrabold text-deep-navy-900">Workspace Settings</h2>
        <p className="text-xs text-slate-500">Modify your student profile configurations.</p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profile configuration saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm space-y-4">
        {/* Input: Name */}
        <div className="space-y-1">
          <label htmlFor="settings-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Student Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="settings-name"
              {...register('name', { required: 'Name is required' })}
              className="w-full pl-9 pr-3 py-2 bg-deep-navy-50 border border-deep-navy-200 rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:border-royal-blue-500"
            />
            <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          {errors.name && <span className="text-[10px] text-red-500 block font-medium">{errors.name.message}</span>}
        </div>

        {/* Input: Phone */}
        <div className="space-y-1">
          <label htmlFor="settings-phone" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="text"
              id="settings-phone"
              {...register('phone')}
              className="w-full pl-9 pr-3 py-2 bg-deep-navy-50 border border-deep-navy-200 rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:border-royal-blue-500"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Locked Input: Email */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Email Address (Locked)
          </label>
          <input
            type="text"
            disabled
            value={user?.email || ''}
            className="w-full px-3 py-2 bg-deep-navy-100 border border-deep-navy-200 rounded-lg text-xs text-slate-400 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="btn-primary px-5 py-2.5 text-xs font-bold rounded-lg shadow-sm animate-none"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};
