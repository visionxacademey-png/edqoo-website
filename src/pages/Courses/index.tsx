import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Clock, BookOpen, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { courses } from '../../data/courses';
import { SEO } from '../../components/common/SEO';

export const Courses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  // Synchronize URL search params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedPrice('all');
    setSortBy('popular');
    setSearchParams({});
  };

  // Filter & Sort core courses array
  const filteredCourses = courses.filter((course) => {
    // 1. Search filter
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Category filter
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'available' && course.status === 'available') ||
      (selectedCategory === 'coming-soon' && course.status === 'coming-soon') ||
      course.category.toLowerCase() === selectedCategory.toLowerCase();

    // 3. Level filter
    const matchesLevel =
      selectedLevel === 'all' ||
      course.level.toLowerCase().includes(selectedLevel.toLowerCase());

    // 4. Price filter
    let matchesPrice = true;
    if (selectedPrice === 'free') {
      matchesPrice = course.price === 0;
    } else if (selectedPrice === 'paid') {
      matchesPrice = course.price > 0;
    }

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  }).sort((a, b) => {
    // Sorting algorithms
    if (sortBy === 'popular') {
      return b.students - a.students;
    }
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <div className="bg-deep-navy-50 min-h-screen py-12">
      <SEO 
        title="Explore Technology Programs" 
        description="Browse available tech training tracks at Edqoo. Learn Cybersecurity, Data Science, and discover upcoming developer programs."
        canonical="/courses"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-left space-y-2">
          <h1 className="text-3xl font-display font-extrabold text-deep-navy-900">Explore Programs</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Acquire specialized tech abilities through structured lessons, labs, and capstones.
          </p>
        </div>

        {/* Filters and List panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: Filters (4 columns) */}
          <aside className="lg:col-span-3 bg-white border border-deep-navy-200 p-6 rounded-2xl shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-deep-navy-200 pb-3">
              <h3 className="font-display font-bold text-sm text-deep-navy-900">Filters</h3>
              <button
                onClick={handleClearFilters}
                className="text-[10px] font-bold text-royal-blue-600 hover:text-royal-blue-700 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                Clear All
              </button>
            </div>

            {/* Filter: Search input */}
            <div className="space-y-2">
              <label htmlFor="course-search" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="course-search"
                  placeholder="e.g. Python, Linux..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-deep-navy-50 border border-deep-navy-200 text-xs text-deep-navy-900 rounded-lg focus:outline-none focus:border-royal-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Filter: Category */}
            <div className="space-y-2">
              <label htmlFor="category-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Category
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-deep-navy-50 border border-deep-navy-200 text-xs text-deep-navy-900 rounded-lg focus:outline-none focus:border-royal-blue-500"
              >
                <option value="all">All Tracks</option>
                <option value="available">Live / Available Only</option>
                <option value="coming-soon">Coming Soon Only</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            {/* Filter: Experience Level */}
            <div className="space-y-2">
              <label htmlFor="level-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Experience Level
              </label>
              <select
                id="level-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 bg-deep-navy-50 border border-deep-navy-200 text-xs text-deep-navy-900 rounded-lg focus:outline-none focus:border-royal-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Filter: Pricing */}
            <div className="space-y-2">
              <label htmlFor="price-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Pricing
              </label>
              <select
                id="price-select"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full px-3 py-2 bg-deep-navy-50 border border-deep-navy-200 text-xs text-deep-navy-900 rounded-lg focus:outline-none focus:border-royal-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="paid">Live Programs (Paid)</option>
                <option value="free">Coming Soon (Placeholder)</option>
              </select>
            </div>

            {/* Filter: Sort parameters */}
            <div className="space-y-2">
              <label htmlFor="sort-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Sort By
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-deep-navy-50 border border-deep-navy-200 text-xs text-deep-navy-900 rounded-lg focus:outline-none focus:border-royal-blue-500"
              >
                <option value="popular">Most Enrolled (Popular)</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </aside>

          {/* Right panel: Course listing grids (9 columns) */}
          <main className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-deep-navy-200 pb-3">
              <span>Showing {filteredCourses.length} programs</span>
              {searchTerm && <span>Search: "{searchTerm}"</span>}
            </div>

            {filteredCourses.length === 0 ? (
              <div className="bg-white border border-deep-navy-200 p-12 rounded-2xl shadow-sm text-center max-w-lg mx-auto space-y-4">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-display font-semibold text-deep-navy-900 text-base">No programs found</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Try adjusting your filters, clearing the search input, or selecting a broader category choice.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="btn-primary px-4 py-2 text-xs font-bold rounded-lg shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const isComingSoon = course.status === 'coming-soon';
                  return (
                    <div
                      key={course.id}
                      className="premium-card flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-deep-navy-200">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-deep-navy-900/90 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                          {course.category}
                        </span>
                        {isComingSoon && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 bg-royal-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                            Coming Soon
                          </span>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-display font-bold text-sm text-deep-navy-900 hover:text-royal-blue-600 transition-colors leading-snug">
                            {isComingSoon ? course.title : <Link to={`/courses/${course.slug}`}>{course.title}</Link>}
                          </h3>
                          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">
                            {course.description}
                          </p>
                        </div>

                        {/* Skill badges */}
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-2 py-0.5 bg-deep-navy-50 text-deep-navy-800 text-[9px] font-semibold rounded">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {!isComingSoon && (
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold border-t border-deep-navy-100 pt-3.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              {course.lessons} lessons
                            </span>
                            <span className="flex items-center gap-1 text-yellow-600">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {course.rating}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2.5 border-t border-deep-navy-100">
                          {isComingSoon ? (
                            <span className="text-[11px] text-slate-400 font-bold uppercase py-1 px-2.5 bg-deep-navy-50 border border-deep-navy-200 rounded-lg w-full text-center">
                              Registration Coming Soon
                            </span>
                          ) : (
                            <>
                              <div className="flex flex-col">
                                <span className="text-slate-400 text-[9px] line-through font-semibold leading-none">
                                  {course.originalPrice}
                                </span>
                                <span className="text-deep-navy-900 font-display font-extrabold text-base leading-tight">
                                  {course.price}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Link
                                  to={`/courses/${course.slug}`}
                                  className="btn-secondary px-3 py-1.5 text-[10px] font-bold rounded-lg"
                                >
                                  Details
                                </Link>
                                {/* <button
                                  onClick={() => {
                                    if (course.id) {
                                      navigate(`/checkout/${course.id}`);
                                    }
                                  }}
                                  className="btn-primary px-3 py-1.5 text-[10px] font-bold rounded-lg"
                                >
                                  Enroll
                                </button> */}
                              </div>
                            </>
                          )}
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
