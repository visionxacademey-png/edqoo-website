import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
  Layers,
  RefreshCw,
  AlertCircle,
  PhoneCall
} from 'lucide-react';
import { courses } from '../../data/courses';
import { SEO } from '../../components/common/SEO';
import { useEnquiry } from '../../context/EnquiryContext';

export const Courses: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { openEnquiryModal } = useEnquiry();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSortBy('popular');
  };

  // Filter & Sort computation
  const filteredCourses = useMemo(() => {
    return courses
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
          selectedLevel === 'all' ? true : course.level.toLowerCase() === selectedLevel.toLowerCase();

        return matchesSearch && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return b.students - a.students; // Default: popular
      });
  }, [searchTerm, selectedCategory, selectedLevel, sortBy]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 text-left">
      <SEO 
        title="Explore Professional Technology Programs & Certifications" 
        description="Browse available professional technology programs at EDQOO. Enquire for Cybersecurity, Data Science, AI, and Cloud Architecture tracks."
        canonical="/courses"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block">
            PROGRAM CATALOG
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900">
            Explore All Programs
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
            Acquire specialized tech abilities through structured lessons, hands-on labs, and real-world capstone audits. Submit an enquiry to connect with our admissions counselors.
          </p>
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
                  placeholder="e.g. Python, Security, Cloud..."
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
                Domain / Track
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:bg-white focus:border-purple-600"
              >
                <option value="all">All Domains</option>
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
                  const isComingSoon = course.status === 'coming-soon';
                  return (
                    <div
                      key={course.id}
                      className="premium-card flex flex-col justify-between overflow-hidden group bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-purple-100 border border-purple-200/60 text-purple-800 text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-xs">
                          {course.category}
                        </span>
                        {isComingSoon && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                            Upcoming Batch
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                            {isComingSoon ? course.title : <Link to={`/courses/${course.slug}`}>{course.title}</Link>}
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

                        {!isComingSoon && (
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              {course.lessons} Modules
                            </span>
                            <span className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {course.rating > 0 ? course.rating : '4.8'}
                            </span>
                          </div>
                        )}

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
                              onClick={() => openEnquiryModal(course.title)}
                              className="btn-primary px-3 py-1.5 text-[10px] font-bold rounded-lg inline-flex items-center gap-1 shadow-2xs"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Enquire Now</span>
                            </button>
                            <Link
                              to={`/courses/${course.slug}`}
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
