import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Play, CheckCircle2, Circle, 
  Download, FileText, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { courses } from '../../data/courses';
import { VideoPlayer } from '../../components/ui/VideoPlayer';
import type { Lesson } from '../../types';

export const Learning: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  
  const { isEnrolled, completeLesson, isLessonCompleted } = useAuth();
  const [activeTab, setActiveTab] = useState<'desc' | 'resources' | 'notes'>('desc');
  const [noteInput, setNoteInput] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  // Find course and active lesson
  const course = courses.find((c) => c.id === courseId);
  
  // Flatten syllabus to map paginate listings
  const allLessons: Lesson[] = [];
  course?.modules?.forEach((mod) => {
    mod.lessons.forEach((l) => {
      allLessons.push(l);
    });
  });

  const activeLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const activeLesson = allLessons[activeLessonIndex];

  // Security guard logic: simulated API checking
  const userHasAccess = isEnrolled(courseId || '');

  // Redirect if unauthorized
  useEffect(() => {
    if (course && !userHasAccess) {
      console.warn('Unauthorized access check failed for program registration.');
    }
  }, [course, userHasAccess]);

  if (!course || !activeLesson) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 font-display">Lesson Not Found</h2>
        <Link to="/dashboard" className="btn-primary px-5 py-2.5 text-xs font-semibold rounded-lg shadow-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Handle unauthorized view error screen
  if (!userHasAccess) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white border border-red-100 p-8 rounded-2xl shadow-sm text-center space-y-6">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
        <div className="space-y-2">
          <h2 className="text-xl font-display font-extrabold text-slate-900">Access Denied</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The frontend has detected that you do not hold active enrollment status for: <strong>{course.title}</strong>. 
            All lesson URLs are authorized on the server before streams are generated.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to={`/courses/${course.slug}`} className="btn-primary px-6 py-2.5 text-xs font-bold rounded-lg shadow-sm">
            View Pricing & Enroll
          </Link>
          <Link to="/dashboard" className="btn-secondary px-6 py-2.5 text-xs font-semibold rounded-lg">
            Back to Overview
          </Link>
        </div>
      </div>
    );
  }

  // Handle checking completion
  const handleToggleCompletion = async () => {
    await completeLesson(course.id, activeLesson.id);
  };

  // Pagination triggers
  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      const prev = allLessons[activeLessonIndex - 1];
      navigate(`/dashboard/learn/${course.id}/${prev.id}`);
    }
  };

  const handleNextLesson = async () => {
    // Automatically complete current lesson on Next click
    await completeLesson(course.id, activeLesson.id);
    
    if (activeLessonIndex < allLessons.length - 1) {
      const next = allLessons[activeLessonIndex + 1];
      navigate(`/dashboard/learn/${course.id}/${next.id}`);
    }
  };

  // Handle saving private note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setSavedNotes((prev) => [...prev, noteInput]);
    setNoteInput('');
  };

  // Mock download assets
  const mockDownloads = [
    { name: `${course.category.replace(' ', '_')}_Cheat_Sheet.pdf`, size: '2.4 MB' },
    { name: `Module_Lab_Setup_Guide.txt`, size: '840 KB' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left max-w-7xl mx-auto">
      
      {/* Left panel: Video, Tabs & Pagination (8 cols) */}
      <main className="lg:col-span-8 space-y-6">
        
        {/* Breadcrumb back navigation */}
        <Link 
          to="/dashboard/my-courses" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-550 hover:text-royal-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Courses
        </Link>

        {/* SECURE VIDEO PLAYER */}
        <VideoPlayer
          courseId={course.id}
          lessonId={activeLesson.id}
          lessonTitle={activeLesson.title}
          onEnded={handleToggleCompletion}
        />

        {/* Classroom pagination controls */}
        <div className="flex items-center justify-between border-y border-deep-navy-200 py-4 px-2">
          <button
            onClick={handlePrevLesson}
            disabled={activeLessonIndex === 0}
            className="btn-secondary px-4 py-2 text-xs font-bold rounded-lg border-deep-navy-200 hover:bg-deep-navy-50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleToggleCompletion}
            className={`px-4 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors ${
              isLessonCompleted(course.id, activeLesson.id)
                ? 'bg-emerald-100 text-emerald-800 border-emerald-250 font-bold'
                : 'bg-white text-deep-navy-900 border-deep-navy-200 hover:bg-deep-navy-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isLessonCompleted(course.id, activeLesson.id) ? 'Completed' : 'Mark as Complete'}
          </button>

          <button
            onClick={handleNextLesson}
            disabled={activeLessonIndex === allLessons.length - 1}
            className="btn-primary px-4 py-2 text-xs font-bold rounded-lg disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 shadow-sm animate-none"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tab options menu */}
        <div className="bg-white border border-deep-navy-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-deep-navy-100 text-xs font-bold text-slate-500">
            {[
              { id: 'desc', label: 'Lesson Description' },
              { id: 'resources', label: 'Resources & Downloads' },
              { id: 'notes', label: 'My Notes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 border-b-2 text-center transition-colors ${
                  activeTab === tab.id
                    ? 'border-royal-blue-600 text-royal-blue-600 bg-deep-navy-50/50'
                    : 'border-transparent hover:text-royal-blue-600 hover:bg-deep-navy-50/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content viewer */}
          <div className="p-6 text-slate-650 text-xs sm:text-sm leading-relaxed">
            
            {/* Tab: Description */}
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-base text-deep-navy-900">{activeLesson.title}</h3>
                <p>
                  This module introduces practical capabilities. Open your terminal or python workspaces to trace variables, inputs, or scans along with the lesson playback controls. Make sure you execute code setups as shown.
                </p>
                <div className="p-3.5 bg-royal-blue-100 border border-royal-blue-200 rounded-xl text-royal-blue-600 flex items-start gap-2.5 font-medium text-xs">
                  <ShieldAlert className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Sandbox Policy Notice</span>
                    <span>All hacking exercises must be run inside offline local machines (Kali VMs) targeting local Sandboxes only. Do not perform operations outside authorized guidelines.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="font-display font-bold text-deep-navy-900">Download Materials</h4>
                <div className="space-y-2">
                  {mockDownloads.map((dl, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-deep-navy-50 border border-deep-navy-200 rounded-xl hover:border-royal-blue-500/40 transition-colors">
                      <span className="flex items-center gap-2 font-medium text-deep-navy-900 text-xs">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {dl.name}
                      </span>
                      <button className="flex items-center gap-1 text-[10px] font-bold text-royal-blue-600 hover:text-royal-blue-700">
                        <Download className="w-3.5 h-3.5" />
                        Download ({dl.size})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-5">
                <h4 className="font-display font-bold text-deep-navy-900">Personal Lesson Notebook</h4>
                
                {savedNotes.length > 0 && (
                  <div className="space-y-2.5">
                    {savedNotes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-deep-navy-50 border border-deep-navy-200 rounded-lg text-xs leading-relaxed text-deep-navy-900">
                        {note}
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSaveNote} className="space-y-2.5">
                  <textarea
                    rows={3}
                    placeholder="Write a private note..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full px-3 py-2 bg-deep-navy-50 border border-deep-navy-200 rounded-xl text-xs focus:outline-none focus:border-royal-blue-500 text-deep-navy-900"
                  />
                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 text-[10px] font-bold rounded-lg shadow-sm"
                  >
                    Save Note
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* Right panel: Course syllabus list / checklist (4 cols) */}
      <aside className="lg:col-span-4 bg-white border border-deep-navy-200 rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-140px)] flex flex-col sticky top-24">
        <div className="p-4 border-b border-deep-navy-200 bg-deep-navy-50">
          <h3 className="font-display font-bold text-sm text-deep-navy-900 leading-none">Course Curriculum</h3>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1 uppercase">Track Progression</span>
        </div>

        {/* Accordions listing */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(course.modules || []).map((mod) => (
            <div key={mod.id} className="space-y-2 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block font-display">
                {mod.title}
              </span>
              
              <div className="space-y-1.5 pl-1.5">
                {mod.lessons.map((l) => {
                  const isActive = l.id === lessonId;
                  const completed = isLessonCompleted(course.id, l.id);

                  return (
                    <button
                      key={l.id}
                      onClick={() => navigate(`/dashboard/learn/${course.id}/${l.id}`)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors text-left ${
                        isActive
                          ? 'bg-royal-blue-600 text-white font-semibold shadow-sm'
                          : 'hover:bg-deep-navy-50 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2 flex-1 pr-2 line-clamp-1">
                        <Play className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-450'}`} />
                        <span>{l.title}</span>
                      </span>
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-350 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

    </div>
  );
};
