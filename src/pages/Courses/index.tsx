import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Layers,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import {
  filterCoursesByCategory,
  searchCourses,
  orderCoursesWithEnglishMirrorLast,
  isEnglishMirrorCourse
} from '../../data/courses';
import { courseService } from '../../services/courseService';
import { categoryService } from '../../services/categoryService';
import { getCategoryIcon } from '../../utils/categoryIcons';
import type { Course, Category } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useEnquiry } from '../../context/EnquiryContext';
import { CourseSkeleton } from '../../components/ui/CourseSkeleton';
import { CourseCard } from '../../components/common/CourseCard';
import { LanguageTrackCard, PROGRAM_TRACK_LANGUAGES } from '../../components/common/LanguageTrackCard';

export const Courses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const { openEnquiryModal } = useEnquiry();
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
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
    setLoading(true);
    setError(null);
    courseService
      .getCourses({ signal })
      .then((data) => {
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

  const loadCategories = (signal?: AbortSignal) => {
    setCategoriesLoading(true);
    categoryService
      .getCategories(signal)
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => {
        if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
          console.warn('[COURSES] Failed to load categories:', err);
        }
      })
      .finally(() => {
        setCategoriesLoading(false);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    loadCourses(controller.signal);
    loadCategories(controller.signal);
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

  const isEnglishChosen = useMemo(() => {
    return (
      selectedCategory === 'English Mirror' ||
      selectedCategory === 'cat-english-mirror' ||
      selectedCategory === 'english-mirror' ||
      selectedCategory === 'Spoken Tutorial' ||
      selectedCategory === 'cat-spoken-tutorial' ||
      selectedCategory === 'spoken-tutorial' ||
      selectedCategory === 'Spoken English' ||
      selectedCategory === 'spoken-english'
    );
  }, [selectedCategory]);

  // Filter & Sort computation
  const filteredCourses = useMemo(() => {
    let result = [...courseList];

    // 1. Category Filter using DB category relationship
    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'All Categories') {
      const isEnglishSelected =
        selectedCategory === 'cat-spoken-tutorial' ||
        selectedCategory === 'spoken-tutorial' ||
        selectedCategory === 'cat-english-mirror' ||
        selectedCategory === 'english-mirror' ||
        selectedCategory === 'spoken-english' ||
        selectedCategory.toLowerCase() === 'spoken english' ||
        selectedCategory.toLowerCase() === 'spoken tutorial' ||
        selectedCategory.toLowerCase() === 'english mirror';

      if (isEnglishSelected) {
        result = result.filter(isEnglishMirrorCourse);
      } else {
        const matchedCat = categories.find(
          (c) => c.id === selectedCategory || c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (matchedCat) {
          result = result.filter((course) => {
            if (course.categoryId && course.categoryId === matchedCat.id) return true;
            if (Array.isArray(course.categoryIds) && course.categoryIds.includes(matchedCat.id)) return true;
            if (course.category && course.category.trim().toLowerCase() === matchedCat.name.trim().toLowerCase()) return true;
            if (
              Array.isArray(course.categories) &&
              course.categories.some((cat) => cat.trim().toLowerCase() === matchedCat.name.trim().toLowerCase())
            ) {
              return true;
            }
            return false;
          });
        } else {
          result = filterCoursesByCategory(result, selectedCategory);
        }
      }
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
      const aStudents = Number(a.students) || 0;
      const bStudents = Number(b.students) || 0;

      if (sortBy === 'rating') return bRating - aRating;
      return bStudents - aStudents; // Default: popular
    });

    // 5. Partition: Normal Edqoo Courses FIRST, English Mirror courses ALWAYS LAST
    if (selectedCategory === 'all' || selectedCategory === 'All Categories' || !selectedCategory) {
      return orderCoursesWithEnglishMirrorLast(result);
    }

    if (!isEnglishChosen) {
      return orderCoursesWithEnglishMirrorLast(result);
    }

    return result;
  }, [courseList, searchTerm, selectedCategory, selectedLevel, sortBy, categories]);

  const standardCourses = useMemo(() => {
    return filteredCourses.filter((c) => !isEnglishMirrorCourse(c));
  }, [filteredCourses]);

  const hasEnglishInCourses = useMemo(() => {
    if (isEnglishChosen) return true;
    if (selectedCategory === 'all' || selectedCategory === 'All Categories' || !selectedCategory) return true;
    return filteredCourses.some(isEnglishMirrorCourse);
  }, [isEnglishChosen, selectedCategory, filteredCourses]);

  const totalCourseCount = isEnglishChosen
    ? PROGRAM_TRACK_LANGUAGES.length
    : standardCourses.length + (hasEnglishInCourses ? PROGRAM_TRACK_LANGUAGES.length : 0);

  const categoryTabs = useMemo(() => {
    const allTab = { id: 'all', slug: 'all', label: 'All Categories', icon: 'layers', isPartner: false, badge: undefined as string | undefined };
    const parentCategories = categories.filter((c) => !c.parentId && !c.parentSlug);
    const seen = new Set<string>();
    const tabs = [allTab];

    for (const c of parentCategories) {
      const isEnglish =
        c.name.toLowerCase().includes('spoken tutorial') ||
        c.name.toLowerCase().includes('spoken english') ||
        c.name.toLowerCase().includes('english mirror') ||
        c.slug === 'spoken-tutorial' ||
        c.slug === 'spoken-english' ||
        c.slug === 'english-mirror' ||
        c.id === 'cat-spoken-tutorial' ||
        c.id === 'cat-english-mirror';
      const label = isEnglish ? 'Spoken English' : c.name;
      const key = label.toLowerCase().trim();
      if (seen.has(key)) continue;
      seen.add(key);

      tabs.push({
        id: c.id,
        slug: isEnglish ? 'spoken-tutorial' : c.slug,
        label,
        icon: isEnglish ? 'message-circle' : (c.icon || 'layers'),
        isPartner: isEnglish ? false : Boolean(c.isPartner || c.badge === 'PARTNER'),
        badge: isEnglish ? undefined : c.badge
      });
    }

    return tabs;
  }, [categories]);

  return (
    <div className="bg-white min-h-screen py-8 text-left">
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
          <span className="text-xs font-bold text-[#6D22B5] uppercase tracking-widest block">
            PROGRAM TRACKS &amp; COURSES
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900">
            Explore All Programs &amp; Upskilling Tracks
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
            Discover comprehensive career tracks across <strong>Data Science and AI</strong>, <strong>Data Analytics and AI</strong>, <strong>AI and Machine Learning</strong>, executive <strong>Tools and Upskills</strong>, and <strong>Free Learning</strong> programs. Submit an enquiry to connect with our admissions counseling team.
          </p>
        </div>

        {/* Quick Category Switcher Tabs */}
        <div className="flex flex-wrap gap-2.5 border-b border-slate-200 pb-4 overflow-x-auto scrollbar-none">
          {categoriesLoading ? (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-9 w-28 bg-slate-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            categoryTabs.map((tab) => {
              const isEnglishTab =
                tab.id === 'cat-spoken-tutorial' ||
                tab.slug === 'spoken-tutorial' ||
                tab.slug === 'spoken-english' ||
                tab.label === 'Spoken English';
              const isEnglishSelected =
                selectedCategory === 'cat-spoken-tutorial' ||
                selectedCategory === 'spoken-tutorial' ||
                selectedCategory === 'spoken-english' ||
                selectedCategory === 'Spoken English' ||
                selectedCategory === 'Spoken Tutorial';
              const isActive = isEnglishTab
                ? isEnglishSelected
                : selectedCategory === tab.id || (tab.id === 'all' && selectedCategory === 'All Categories');
              const isPartner = isEnglishTab ? false : tab.isPartner;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? 'bg-[#6D22B5] text-white border-[#6D22B5] shadow-sm'
                      : isPartner
                      ? 'bg-white text-[#6D22B5] border-[#6D22B5] hover:bg-purple-50'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-purple-50 hover:text-[#6D22B5] hover:border-purple-200'
                  }`}
                >
                  {getCategoryIcon(tab.icon, `w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#6D22B5]'}`)}
                  <span>{tab.label}</span>
                  {isPartner && (
                    <span className={`text-[8px] px-1 py-0.2 rounded font-extrabold uppercase ${
                      isActive ? 'bg-white text-[#6D22B5]' : 'bg-[#6D22B5] text-white'
                    }`}>
                      {tab.badge || 'Partner'}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Filters and List panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Filters (3 columns) */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#6D22B5]" />
                Filter Catalog
              </h3>
              <button
                onClick={handleClearFilters}
                className="text-[11px] font-bold text-[#6D22B5] hover:text-[#381061] transition-colors flex items-center gap-1 cursor-pointer"
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
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:bg-white focus:border-[#6D22B5] focus:ring-2 focus:ring-[#6D22B5]/10"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:bg-white focus:border-[#6D22B5] focus:ring-2 focus:ring-[#6D22B5]/10"
              >
                {categoryTabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:bg-white focus:border-[#6D22B5] focus:ring-2 focus:ring-[#6D22B5]/10"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:bg-white focus:border-[#6D22B5] focus:ring-2 focus:ring-[#6D22B5]/10"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </aside>

          {/* Right panel: Course listing grids (9 columns) */}
          <main className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-200 pb-3 min-h-[32px]">
              {loading ? (
                <span className="flex items-center gap-2 text-[#6D22B5] font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading courses...</span>
                </span>
              ) : error ? (
                <span className="text-rose-600 font-bold">Unable to load courses</span>
              ) : (
                <span>
                  Showing <strong>{totalCourseCount}</strong> {isEnglishChosen ? 'language options' : 'programs'} in{' '}
                  <strong className="text-[#6D22B5]">{isEnglishChosen ? 'Spoken English' : selectedCategory === 'all' ? 'All Categories' : selectedCategory}</strong>
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
            ) : isEnglishChosen ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {PROGRAM_TRACK_LANGUAGES.map((lang) => (
                  <LanguageTrackCard key={lang.id} language={lang} />
                ))}
              </div>
            ) : standardCourses.length === 0 && !hasEnglishInCourses ? (
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
                {standardCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    selectedCategory={selectedCategory}
                    onEnquire={(title, details) => openEnquiryModal(title, details)}
                  />
                ))}

                {/* Replace individual Spoken English course cards with the 5 language options */}
                {hasEnglishInCourses &&
                  PROGRAM_TRACK_LANGUAGES.map((lang) => (
                    <LanguageTrackCard key={lang.id} language={lang} />
                  ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};
