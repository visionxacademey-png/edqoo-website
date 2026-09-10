import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Tag
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { COMMON_PROGRAM_FEATURES, PROGRAM_CATEGORIES } from '../../data/courses';
import type { Course, Module, Lesson } from '../../types';

// Slugify helper
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export const AdminCourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugModifiedManually, setSlugModifiedManually] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Tools and Upskills']);
  const [level, setLevel] = useState('Beginner to Advanced');
  const [duration, setDuration] = useState('12 Months');
  const [liveHours, setLiveHours] = useState('30+ Hours');
  const [price, setPrice] = useState<number>(34999);
  const [originalPrice, setOriginalPrice] = useState<number>(69999);
  const [status, setStatus] = useState<'available' | 'coming-soon'>('available');
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop');
  const [description, setDescription] = useState('');
  const [outcome, setOutcome] = useState('');
  const [features, setFeatures] = useState<string[]>(COMMON_PROGRAM_FEATURES);
  const [rating, setRating] = useState<number>(4.9);
  const [students, setStudents] = useState<number>(350);

  // Dynamic Lists
  const [skills, setSkills] = useState<string[]>([
    'Python Programming',
    'Machine Learning',
    'Generative AI'
  ]);
  const [skillInput, setSkillInput] = useState('');

  const [whoIsItFor, setWhoIsItFor] = useState<string[]>([
    'Students & working professionals aspiring for Data Science & AI careers',
    'Software engineers transitioning into AI and machine learning architecture'
  ]);
  const [whoInput, setWhoInput] = useState('');

  const [requirements, setRequirements] = useState<string[]>([
    'Basic mathematical familiarity and problem-solving ability',
    'A computer with internet access capable of running modern development tools'
  ]);
  const [reqInput, setReqInput] = useState('');

  // Curriculum Modules & Lessons
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'mod-1',
      title: 'Module 1: Foundations & Architecture',
      description: 'Core principles and hands-on lab configuration.',
      lessons: [
        { id: 'les-1-1', title: 'Course Orientation & Environment Setup', duration: '45 mins', isPreview: true },
        { id: 'les-1-2', title: 'Threat Landscapes & Architecture Models', duration: '60 mins', isPreview: false }
      ]
    }
  ]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load existing course if in edit mode
  useEffect(() => {
    if (isEditing && id) {
      setFetching(true);
      courseService
        .getCourseBySlug(id)
        .then((course) => {
          if (course) {
            setTitle(course.title);
            setSlug(course.slug);
            setSlugModifiedManually(true);
            setCategories(course.categories && course.categories.length > 0 ? course.categories : [course.category]);
            setLevel(course.level);
            setDuration(course.duration);
            if (course.liveHours) setLiveHours(course.liveHours);
            setPrice(course.price);
            setOriginalPrice(course.originalPrice);
            setStatus(course.status);
            setFeatured(course.featured);
            setImage(course.image);
            setDescription(course.description);
            if (course.outcome) setOutcome(course.outcome);
            if (course.features && course.features.length > 0) setFeatures(course.features);
            setRating(course.rating);
            setStudents(course.students);
            if (course.skills) setSkills(course.skills);
            if (course.whoIsItFor) setWhoIsItFor(course.whoIsItFor);
            if (course.requirements) setRequirements(course.requirements);
            if (course.modules && course.modules.length > 0) setModules(course.modules);
          } else {
            showToast('Course not found.', 'error');
          }
        })
        .catch((err) => {
          showToast(err.message || 'Failed to fetch course details.', 'error');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  // Title change auto-updates slug if not manually altered
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugModifiedManually) {
      setSlug(slugify(val));
    }
  };

  // Toggle category
  const handleToggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  // Skills handlers
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Audience handlers
  const handleAddWho = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whoInput.trim()) return;
    setWhoIsItFor([...whoIsItFor, whoInput.trim()]);
    setWhoInput('');
  };

  const handleRemoveWho = (idx: number) => {
    setWhoIsItFor(whoIsItFor.filter((_, i) => i !== idx));
  };

  // Requirements handlers
  const handleAddReq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqInput.trim()) return;
    setRequirements([...requirements, reqInput.trim()]);
    setReqInput('');
  };

  const handleRemoveReq = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  // Module handlers
  const handleAddModule = () => {
    const newMod: Module = {
      id: `mod-${Date.now()}`,
      title: `Module ${modules.length + 1}: New Curriculum Topic`,
      description: 'Module overview and topics.',
      lessons: [
        { id: `les-${Date.now()}-1`, title: 'Lesson 1: Introduction', duration: '45 mins', isPreview: false }
      ]
    };
    setModules([...modules, newMod]);
  };

  const handleRemoveModule = (moduleIndex: number) => {
    setModules(modules.filter((_, i) => i !== moduleIndex));
  };

  const handleUpdateModule = (moduleIndex: number, fields: Partial<Module>) => {
    const updated = [...modules];
    updated[moduleIndex] = { ...updated[moduleIndex], ...fields };
    setModules(updated);
  };

  const handleAddLesson = (moduleIndex: number) => {
    const updated = [...modules];
    const newLesson: Lesson = {
      id: `les-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: 'New Session / Lab',
      duration: '60 mins',
      isPreview: false
    };
    updated[moduleIndex].lessons = [...updated[moduleIndex].lessons, newLesson];
    setModules(updated);
  };

  const handleRemoveLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
    setModules(updated);
  };

  const handleUpdateLesson = (moduleIndex: number, lessonIndex: number, fields: Partial<Lesson>) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      ...fields
    };
    setModules(updated);
  };

  // Total lessons calculation
  const totalCalculatedLessons = modules.reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0
  );

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || categories.length === 0 || !description.trim()) {
      showToast('Please fill out the Title, at least one Category, and Description.', 'error');
      return;
    }

    setLoading(true);

    const payload: Partial<Course> = {
      title: title.trim(),
      slug: slugify(slug || title),
      category: categories[0],
      categories,
      level,
      duration,
      liveHours,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      status,
      featured,
      image,
      description: description.trim(),
      outcome: outcome.trim() || undefined,
      features: features.length > 0 ? features : COMMON_PROGRAM_FEATURES,
      rating: Number(rating) || 4.9,
      students: Number(students) || 0,
      lessons: totalCalculatedLessons || 10,
      skills,
      whoIsItFor,
      requirements,
      modules
    };

    try {
      if (isEditing && id) {
        const res = await courseService.updateCourse(id, payload);
        if (res.success) {
          showToast('Course updated successfully!');
          setTimeout(() => navigate('/admin/courses'), 1200);
        }
      } else {
        const res = await courseService.createCourse(payload);
        if (res.success) {
          showToast('Course created successfully!');
          setTimeout(() => navigate('/admin/courses'), 1200);
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || err.message || 'Failed to save course.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-400">Loading course curriculum...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-bold shadow-lg transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border border-emerald-800'
              : 'bg-red-950 text-red-200 border border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/courses"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-white font-display tracking-tight">
              {isEditing ? 'Edit Course Program' : 'Create New Program Track'}
            </h2>
            <p className="text-xs text-slate-400">
              Configure curriculum, pricing structure, syllabus modules, and target prerequisites.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md shadow-purple-600/30 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : isEditing ? 'Update Course' : 'Publish Course'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Basic Information */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Basic Program Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Course Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Master Program in Data Science and AI"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                URL Slug <span className="text-slate-500 font-normal">(e.g. /courses/master-program-data-science-ai)</span>
              </label>
              <input
                type="text"
                required
                placeholder="master-program-data-science-ai"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugModifiedManually(true);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-purple-300 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Multi-Category Selector */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Assigned Category Tracks <span className="text-red-400">*</span> <span className="text-slate-500 font-normal">(Select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PROGRAM_CATEGORIES.map((cat) => {
                  const isSelected = categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {cat} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Skill Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Beginner to Advanced">Beginner to Advanced</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced / Expert</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 11 Months, 6 Months, Flexible duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Live Learning Hours */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Live Learning Hours
              </label>
              <input
                type="text"
                placeholder="e.g. 90+ Hours, 70+ Hours, 30+ Hours"
                value={liveHours}
                onChange={(e) => setLiveHours(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Enrollment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'available' | 'coming-soon')}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="available">Available (Open for Enquiries)</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3 pt-6 md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 bg-slate-950 border-slate-700 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Mark as Featured Track on Homepage
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 2: Pricing & Metrics */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              2. Pricing & Enrollment Metrics
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Offer Price */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Offer Price (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Initial Rating */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Initial Rating (out of 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Students Enrolled */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Students Enrolled
              </label>
              <input
                type="number"
                min={0}
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Media & Comprehensive Description */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              3. Media & Program Description
            </span>
          </div>

          <div className="space-y-4">
            {/* Image URL with preview */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Course Banner Image URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-12 h-10 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                    onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Full Description <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe what learners will achieve in this program track..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            {/* Outcome */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Program Learning Outcome
              </label>
              <textarea
                rows={2}
                placeholder="By the end of the program, learners will be equipped with..."
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Skills Covered Tags */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Tag className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              4. Key Skills Covered
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Active Directory, SIEM, Cloud Security, Python"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/80 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-400 text-purple-400 transition-colors"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5: Target Audience & Prerequisites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Who is it for */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                5. Who Is This Track For?
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SOC Analysts seeking penetration testing skills"
                  value={whoInput}
                  onChange={(e) => setWhoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddWho(e);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddWho}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                >
                  Add
                </button>
              </div>

              <ul className="space-y-1.5 pt-2">
                {whoIsItFor.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between text-xs text-slate-300"
                  >
                    <span>• {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWho(idx)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Requirements */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                6. Prerequisites & Requirements
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Basic computer networking concepts"
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddReq(e);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddReq}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                >
                  Add
                </button>
              </div>

              <ul className="space-y-1.5 pt-2">
                {requirements.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between text-xs text-slate-300"
                  >
                    <span>• {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReq(idx)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 6: Interactive Syllabus / Curriculum Builder */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  7. Curriculum & Syllabus Builder
                </h3>
                <span className="text-[11px] text-slate-400">
                  {modules.length} Modules • {totalCalculatedLessons} Total Lessons
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddModule}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Module</span>
            </button>
          </div>

          <div className="space-y-6">
            {modules.map((module, modIdx) => (
              <div
                key={module.id || modIdx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3"
              >
                {/* Module Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => handleUpdateModule(modIdx, { title: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(modIdx)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                    title="Delete module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Lessons inside Module */}
                <div className="space-y-2 pl-3 border-l-2 border-purple-500/40">
                  {module.lessons.map((lesson, lesIdx) => (
                    <div
                      key={lesson.id || lesIdx}
                      className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-2.5 text-xs"
                    >
                      <input
                        type="text"
                        placeholder="Lesson title..."
                        value={lesson.title}
                        onChange={(e) =>
                          handleUpdateLesson(modIdx, lesIdx, { title: e.target.value })
                        }
                        className="flex-1 w-full sm:w-auto px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-md text-xs text-white focus:outline-none focus:border-purple-500"
                      />

                      <input
                        type="text"
                        placeholder="e.g. 45 mins"
                        value={lesson.duration}
                        onChange={(e) =>
                          handleUpdateLesson(modIdx, lesIdx, { duration: e.target.value })
                        }
                        className="w-full sm:w-28 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                      />

                      <label className="flex items-center gap-1.5 text-slate-300 text-[11px] cursor-pointer whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={Boolean(lesson.isPreview)}
                          onChange={(e) =>
                            handleUpdateLesson(modIdx, lesIdx, { isPreview: e.target.checked })
                          }
                          className="rounded text-purple-600 bg-slate-950 border-slate-700"
                        />
                        <span>Preview Lab</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(modIdx, lesIdx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Remove lesson"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddLesson(modIdx)}
                    className="mt-2 text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Lesson to {module.title.split(':')[0]}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link
            to="/admin/courses"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md shadow-purple-600/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : isEditing ? 'Update Course Track' : 'Publish Course Track'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
