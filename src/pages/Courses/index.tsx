import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
  Layers,
  RefreshCw,
  AlertCircle,
  PhoneCall,
  Brain,
  BarChart3,
  Cpu,
  Wrench,
  Shield
} from 'lucide-react';
import { filterCoursesByCategory, searchCourses, normalizeCategoryName } from '../../data/courses';
import { courseService } from '../../services/courseService';
import type { Course } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useEnquiry } from '../../context/EnquiryContext';
import { getCacheBustedImageUrl } from '../../utils/imageUrl';
import { CourseSkeleton } from '../../components/ui/CourseSkeleton';

export const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const { openEnquiryModal } = useEnquiry();
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  // Sync category state when URL searchParams change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    setSelectedCategory(urlCategory || 'all');

    const urlSearch = searchParams.get('search');
    setSearchTerm(urlSearch || '');
  }, [searchParams]);

  const loadCourses = (signal?: AbortSignal) => {
    console.log('[COURSE DEBUG] loadCourses() called');
    setLoading(true);
    setError(null);
    courseService
      .getCourses({ signal })
      .then((data) => {
        console.log('[COURSE DEBUG] setCourses with count:', Array.isArray(data) ? data.length : typeof data);
        if (Array.isArray(data)) {
          setCourseList(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
          console.error('[COURSE DEBUG] Failed to load courses:', err);
          setError(err?.message || 'Unable to load courses from the database. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    loadCourses(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSortBy('popular');
    setSearchParams({});
  };

  // Filter & Sort computation
  const filteredCourses = useMemo(() => {
    let result = [...courseList];

    // 1. Category Filter
    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'All Categories') {
      result = filterCoursesByCategory(result, selectedCategory);
    }

    // 2. Search Keyword
    if (searchTerm && searchTerm.trim()) {
      result = searchCourses(result, searchTerm);
    }

    // 3. Experience Level Filter
    if (selectedLevel && selectedLevel !== 'all') {
      result = result.filter((course) =>
        (course.level || '').toLowerCase().includes(selectedLevel.toLowerCase())
      );
    }

    // 4. Sort safely handling numbers
    result.sort((a, b) => {
      const aRating = Number(a.rating) || 0;
      const bRating = Number(b.rating) || 0;
      const aPrice = Number(a.price) || 0;
      const bPrice = Number(b.price) || 0;
      const aStudents = Number(a.students) || 0;
      const bStudents = Number(b.students) || 0;

      if (sortBy === 'rating') return bRating - aRating;
      if (sortBy === 'price-low') return aPrice - bPrice;
      if (sortBy === 'price-high') return bPrice - aPrice;
      return bStudents - aStudents; // Default: popular
    });

    return result;
  }, [courseList, searchTerm, selectedCategory, selectedLevel, sortBy]);

  const categoryTabs = [
    { id: 'all', label: 'All Categories', icon: Layers },
    { id: 'Data Science and AI', label: 'Data Science and AI', icon: Brain },
    { id: 'Data Analytics and AI', label: 'Data Analytics and AI', icon: BarChart3 },
    { id: 'AI and Machine Learning', label: 'AI and Machine Learning', icon: Cpu },
    { id: 'Tools and Upskills', label: 'Tools and Upskills', icon: Wrench },
    { id: 'Free Learning', label: 'Free Learning', icon: BookOpen },
    { id: 'Cybersecurity', label: 'Cybersecurity', icon: Shield }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-left">
      <SEO 
        title="Edqoo Courses | Learn AI, Data Science, Python & More" 
        description="Explore Edqoo's online certification courses in Data Science, AI, Python, Machine Learning, Data Analytics, and professional workplace tools. Learn with real projects."
        canonical="/courses"
        keywords="Edqoo courses, learn AI, Data Science, Python, Machine Learning, Data Analytics, Power BI, Edqoo online"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Edqoo Courses', url: '/courses' }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ name: 'Courses', url: '/courses' }]} />

        {/* Page Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block">
            PROGRAM TRACKS & COURSES
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900">
            Explore All Programs & Upskilling Tracks
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
            Discover comprehensive career tracks across <strong>Data Science and AI</strong>, <strong>Data Analytics and AI</strong>, <strong>AI and Machine Learning</strong>, executive <strong>Tools and Upskills</strong>, and <strong>Free Learning</strong> programs. Submit an enquiry to connect with our admissions counseling team.
          </p>
        </div>

        {/* Quick Category Switcher Tabs */}
        <div className="flex flex-wrap gap-2.5 border-b border-slate-200 pb-4 overflow-x-auto scrollbar-none">
          {categoryTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = selectedCategory === tab.id || (tab.id === 'all' && selectedCategory === 'All Categories');
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filters and List panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Filters (3 columns) */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" />
                Filter Catalog
              </h3>
              <button
                onClick={handleClearFilters}
                className="text-[11px] font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Filter: Search input */}
            <div className="space-y-1.5">
              <label htmlFor="course-search" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Search Keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="course-search"
                  placeholder="e.g. Python, Data Science, AI, Power BI, Java, HR..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Filter: Category */}
            <div className="space-y-1.5">
              <label htmlFor="category-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Category Track
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600"
              >
                <option value="all">All Categories</option>
                <option value="Data Science and AI">Data Science and AI</option>
                <option value="Data Analytics and AI">Data Analytics and AI</option>
                <option value="AI and Machine Learning">AI and Machine Learning</option>
                <option value="Tools and Upskills">Tools and Upskills</option>
                <option value="Free Learning">Free Learning</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            {/* Filter: Experience Level */}
            <div className="space-y-1.5">
              <label htmlFor="level-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Experience Level
              </label>
              <select
                id="level-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner Friendly</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced Specialist</option>
              </select>
            </div>

            {/* Filter: Sort parameters */}
            <div className="space-y-1.5">
              <label htmlFor="sort-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Sort By
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Fee: Low to High</option>
                <option value="price-high">Fee: High to Low</option>
              </select>
            </div>
          </aside>

          {/* Right panel: Course listing grids (9 columns) */}
          <main className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-200 pb-3 min-h-[32px]">
              {loading ? (
                <span className="flex items-center gap-2 text-purple-600 font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading courses...</span>
                </span>
              ) : error ? (
                <span className="text-rose-600 font-bold">Unable to load courses</span>
              ) : (
                <span>
                  Showing <strong>{filteredCourses.length}</strong> programs in{' '}
                  <strong className="text-purple-600">{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</strong>
                </span>
              )}
              {searchTerm && !loading && <span>Search: "{searchTerm}"</span>}
            </div>

            {loading ? (
              <CourseSkeleton count={6} />
            ) : error ? (
              <div className="bg-white border border-rose-200 p-10 rounded-2xl shadow-2xs text-center max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-base">Unable to load courses</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {error}
                </p>
                <button
                  onClick={() => loadCourses()}
                  className="btn-primary px-5 py-2.5 text-xs font-bold rounded-lg shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 rounded-2xl shadow-2xs text-center max-w-lg mx-auto space-y-4">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-display font-bold text-slate-900 text-base">No courses available</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No programs match your search or filter criteria. Try adjusting your filters or resetting the search keyword.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="btn-primary px-4 py-2 text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredCourses.map((course) => {
                  const isFree = (course.categories || [course.category]).some((c) => normalizeCategoryName(c) === 'Free Learning') || course.price === 0;
                  return (
                    <div
                      key={course.id}
                      onClick={() => navigate(`/courses/${course.slug}`)}
                      className="premium-card cursor-pointer flex flex-col justify-between overflow-hidden group bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={getCacheBustedImageUrl(course.image, course.updatedAt || course.imageUpdatedAt)}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[70%]">
                          {(course.categories || [course.category]).map((rawCat) => {
                            const cat = normalizeCategoryName(rawCat);
                            return (
                              <span
                                key={cat}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-xs border ${
                                  cat === 'Free Learning'
                                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-800'
                                    : cat === 'Tools and Upskills'
                                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-800'
                                    : 'bg-purple-50/90 border-purple-300 text-purple-800'
                                }`}
                              >
                                {cat}
                              </span>
                            );
                          })}
                        </div>
                        
                        {isFree ? (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-extrabold rounded-md shadow-sm uppercase tracking-wider">
                            FREE
                          </span>
                        ) : course.liveHours ? (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-extrabold rounded-md shadow-sm">
                            {course.liveHours} Live
                          </span>
                        ) : null}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                            <Link to={`/courses/${course.slug}`} onClick={(e) => e.stopPropagation()}>
                              {course.title}
                            </Link>
                          </h3>
                          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                            {course.shortDescription || course.description}
                          </p>
                        </div>

                        {/* Skill badges */}
                        <div className="flex flex-wrap gap-1">
                          {(course.skills || []).slice(0, 3).map((skill) => (
                            <span key={skill} className="px-1.5 py-0.5 bg-purple-50 text-purple-800 text-[9px] font-semibold rounded">
                              {skill}
                            </span>
                          ))}
                          {(course.skills || []).length > 3 && (
                            <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-medium rounded">
                              +{(course.skills || []).length - 3}
                            </span>
                          )}
                        </div>

                        {/* Metadata (Duration, Live Hours, Rating) */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
                          <span className="flex items-center gap-1 font-bold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-purple-600" />
                            {course.duration}
                          </span>
                          {course.liveHours && (
                            <span className="flex items-center gap-1 text-purple-700 font-bold">
                              <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                              {course.liveHours}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {course.rating > 0 ? course.rating : '4.9'}
                          </span>
                        </div>

                        {/* Pricing & Actions */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 gap-2">
                          <div className="flex items-center gap-1.5 w-full">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEnquiryModal(course.title, {
                                  category: isFree ? 'Free Learning' : selectedCategory === 'Tools and Upskills' ? 'Tools and Upskills' : course.category,
                                  courseId: course.id,
                                  categories: course.categories
                                });
                              }}
                              className="btn-primary flex-1 py-1.5 text-[10px] font-bold rounded-lg inline-flex items-center justify-center gap-1 shadow-2xs"
                            >
                              {isFree ? (
                                <>
                                  <BookOpen className="w-3 h-3" />
                                  <span>Enquire Now</span>
                                </>
                              ) : (
                                <>
                                  <PhoneCall className="w-3 h-3" />
                                  <span>Enquire Now</span>
                                </>
                              )}
                            </button>
                            <Link
                              to={`/courses/${course.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-2.5 py-1.5 text-[10px] font-bold text-slate-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 border border-slate-200 transition-colors inline-flex items-center gap-1"
                            >
                              <span>Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};
