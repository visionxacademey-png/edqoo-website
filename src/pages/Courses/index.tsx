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
  GraduationCap,
  Wrench
} from 'lucide-react';
import { courses as defaultCourses } from '../../data/courses';
import { courseService } from '../../services/courseService';
import type { Course } from '../../types';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

export const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { openEnquiryModal } = useEnquiry();
  const [courseList, setCourseList] = useState<Course[]>(defaultCourses);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  useEffect(() => {
    courseService.getCourses().then((data) => {
      if (data && data.length > 0) {
        setCourseList(data);
      }
    }).catch(console.warn);
  }, []);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSortBy('popular');
  };

  // Filter & Sort computation
  const filteredCourses = useMemo(() => {
    return courseList
      .filter((course) => {
        const matchesSearch =
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'all'
            ? true
            : selectedCategory === 'available'
            ? course.status === 'available'
            : selectedCategory === 'coming-soon'
            ? course.status === 'coming-soon'
            : course.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesLevel =
          selectedLevel === 'all' ? true : course.level.toLowerCase().includes(selectedLevel.toLowerCase());

        return matchesSearch && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return b.students - a.students; // Default: popular
      });
  }, [courseList, searchTerm, selectedCategory, selectedLevel, sortBy]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 text-left">
      <SEO 
        title="Explore Master Programs & Executive Tools Courses" 
        description="Browse professional Master Programs in Data Science, AI, Python, Data Analytics, and Executive Upskilling tracks in SQL, Excel, Power BI, and Prompt Engineering."
        canonical="/courses"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block">
            PROGRAM CATALOG
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900">
            Explore All Programs & Upskilling Tracks
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
            Acquire specialized tech abilities through comprehensive <strong>Master Programs</strong> or fast-track <strong>Tools And Upskills</strong> (24–36 Hours). Submit an enquiry to connect with our admissions counselors.
          </p>
        </div>

        {/* Quick Category Switcher Tabs */}
        <div className="flex flex-wrap gap-2.5 border-b border-slate-200 pb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Programs ({courseList.length})</span>
          </button>
          
          <button
            onClick={() => setSelectedCategory('Master Programs')}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
              selectedCategory === 'Master Programs'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Master Programs ({courseList.filter(c => c.category === 'Master Programs').length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('Tools And Upskills')}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
              selectedCategory === 'Tools And Upskills'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Tools And Upskills — 24–36 Hours ({courseList.filter(c => c.category === 'Tools And Upskills').length})</span>
          </button>
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
                className="text-[11px] font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
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
                  placeholder="e.g. Python, SQL, AI, Power BI..."
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
                Category / Track
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600"
              >
                <option value="all">All Categories</option>
                <option value="Master Programs">Master Programs</option>
                <option value="Tools And Upskills">Tools And Upskills (24–36 Hours)</option>
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
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-200 pb-3">
              <span>Showing <strong>{filteredCourses.length}</strong> programs</span>
              {searchTerm && <span>Search: "{searchTerm}"</span>}
            </div>

            {filteredCourses.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 rounded-2xl shadow-2xs text-center max-w-lg mx-auto space-y-4">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-display font-bold text-slate-900 text-base">No programs match your criteria</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Try adjusting your filters or resetting the search keyword.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="btn-primary px-4 py-2 text-xs font-bold rounded-lg shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredCourses.map((course) => {
                  const isToolsAndUpskills = course.category === 'Tools And Upskills';
                  return (
                    <div
                      key={course.id}
                      onClick={() => navigate(`/courses/${course.slug}`)}
                      className="premium-card cursor-pointer flex flex-col justify-between overflow-hidden group bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-xs border ${
                          isToolsAndUpskills
                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-800'
                            : 'bg-purple-50/90 border-purple-300 text-purple-800'
                        }`}>
                          {course.category}
                        </span>
                        
                        {isToolsAndUpskills ? (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-extrabold rounded-md shadow-sm">
                            24–36 Hours
                          </span>
                        ) : (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-md shadow-sm">
                            Master Track
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                            <Link to={`/courses/${course.slug}`} onClick={(e) => e.stopPropagation()}>
                              {course.title}
                            </Link>
                          </h3>
                          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        {/* Skill badges */}
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-1.5 py-0.5 bg-purple-50 text-purple-800 text-[9px] font-semibold rounded">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
                          <span className="flex items-center gap-1 font-bold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-purple-600" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            {isToolsAndUpskills ? 'Executive' : 'Master Track'}
                          </span>
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {course.rating > 0 ? course.rating : '4.9'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 gap-2">
                          <div className="flex flex-col">
                            <span className="text-slate-400 text-[9px] line-through leading-none">
                              ₹{course.originalPrice}
                            </span>
                            <span className="text-slate-900 font-extrabold text-sm leading-tight">
                              ₹{course.price}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEnquiryModal(course.title);
                              }}
                              className="btn-primary px-3 py-1.5 text-[10px] font-bold rounded-lg inline-flex items-center gap-1 shadow-2xs"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Enquire Now</span>
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
