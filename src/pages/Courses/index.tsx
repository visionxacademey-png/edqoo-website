import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Clock, BookOpen, Star, RefreshCw, AlertCircle, ArrowRight, Layers } from 'lucide-react';
import { courses } from '../../data/courses';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

export const Courses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openEnquiryModal } = useEnquiry();

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
    <div className="bg-deep-navy-50/50 min-h-screen py-10 text-left">
      <SEO 
        title="Explore Professional Technology Programs" 
        description="Browse available professional certification programs at Edqoo. Master Cybersecurity, Data Science, AI, and Cloud Architecture."
        canonical="/courses"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-royal-blue-600 uppercase tracking-widest block">
            PROGRAM CATALOG
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-deep-navy-900">
            Explore All Programs
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
            Acquire specialized tech abilities through structured lessons, hands-on labs, and real-world capstone audits.
          </p>
        </div>

        {/* Filters and List panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Filters (3 columns) */}
          <aside className="lg:col-span-3 bg-white border border-deep-navy-200 p-5 rounded-2xl shadow-2xs space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-deep-navy-200 pb-3">
              <h3 className="font-display font-bold text-sm text-deep-navy-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-royal-blue-600" />
                Filter Catalog
              </h3>
              <button
                onClick={handleClearFilters}
                className="text-[11px] font-bold text-royal-blue-600 hover:text-royal-blue-700 transition-colors flex items-center gap-1"
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
                  placeholder="e.g. Python, Security, Cloud..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-deep-navy-50 border border-deep-navy-200 text-xs text-deep-navy-900 rounded-lg focus:outline-none focus:bg-white focus:border-royal-blue-600"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Filter: Category */}
            <div className="space-y-1.5">
              <label htmlFor="category-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Domain / Track
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-deep-navy-50 border border-deep-navy-200 text-xs text-deep-navy-900 rounded-lg focus:outline-none focus:bg-white focus:border-royal-blue-600"
              >
                <option value="all">All Domains</option>
                <option value="available">Live Enrolling Only</option>
                <option value="coming-soon">Upcoming Batches Only</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Data Science">Data Science</option>
                <option value="AI / ML">AI & Machine Learning</option>
                <option value="Programming">Software & Technology</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="DevOps">DevOps & SRE</option>
                <option value="UI/UX Design">UI/UX Product Design</option>
                <option value="Digital Marketing">Growth Marketing</option>
                <option value="App Development">Mobile App Engineering</option>
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
                className="w-full px-3 py-2 bg-deep-navy-50 border border-deep-navy-200 text-xs text-deep-navy-900 rounded-lg focus:outline-none focus:bg-white focus:border-royal-blue-600"
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
                className="w-full px-3 py-2 bg-deep-navy-50 border border-deep-navy-200 text-xs text-deep-navy-900 rounded-lg focus:outline-none focus:bg-white focus:border-royal-blue-600"
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
              <span>Showing <strong>{filteredCourses.length}</strong> programs</span>
              {searchTerm && <span>Search: "{searchTerm}"</span>}
            </div>

            {filteredCourses.length === 0 ? (
              <div className="bg-white border border-deep-navy-200 p-12 rounded-2xl shadow-2xs text-center max-w-lg mx-auto space-y-4">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-display font-bold text-deep-navy-900 text-base">No programs match your criteria</h3>
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
                  const isComingSoon = course.status === 'coming-soon';
                  return (
                    <div
                      key={course.id}
                      className="premium-card flex flex-col justify-between overflow-hidden group bg-white border border-deep-navy-200 rounded-2xl"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-deep-navy-100">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-deep-navy-950/85 text-white text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-xs">
                          {course.category}
                        </span>
                        {isComingSoon && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-royal-blue-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                            Upcoming
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h3 className="font-display font-bold text-sm text-deep-navy-900 group-hover:text-royal-blue-600 transition-colors line-clamp-1">
                            {isComingSoon ? course.title : <Link to={`/courses/${course.slug}`}>{course.title}</Link>}
                          </h3>
                          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        {/* Skill badges */}
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-1.5 py-0.5 bg-deep-navy-50 text-deep-navy-800 text-[9px] font-semibold rounded">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {!isComingSoon && (
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold border-t border-deep-navy-100 pt-2.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              {course.lessons} Lessons
                            </span>
                            <span className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {course.rating > 0 ? course.rating : '4.8'}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2.5 border-t border-deep-navy-100 gap-2">
                          {isComingSoon ? (
                            <>
                              <span className="text-[10px] font-bold text-royal-blue-600 uppercase">
                                Enrolment Opening
                              </span>
                              <button
                                type="button"
                                onClick={() => openEnquiryModal(course.title)}
                                className="btn-secondary px-3 py-1.5 text-[10px] font-bold rounded-lg"
                              >
                                Notify Me
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-col">
                                <span className="text-slate-400 text-[9px] line-through leading-none">
                                  ₹{course.originalPrice}
                                </span>
                                <span className="text-deep-navy-900 font-extrabold text-sm leading-tight">
                                  ₹{course.price}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEnquiryModal(course.title)}
                                  className="px-2 py-1 text-[10px] font-bold text-slate-600 hover:text-royal-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  Enquire
                                </button>
                                <Link
                                  to={`/courses/${course.slug}`}
                                  className="btn-primary px-3 py-1.5 text-[10px] font-bold rounded-lg inline-flex items-center gap-1"
                                >
                                  <span>Details</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
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
