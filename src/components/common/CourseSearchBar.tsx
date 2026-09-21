import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  BookOpen,
  ArrowRight,
  Clock,
  ChevronRight
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { normalizeCategoryName } from '../../data/courses';
import type { Course } from '../../types';

interface CourseSearchBarProps {
  variant?: 'desktop' | 'mobile' | 'inline';
  placeholder?: string;
  onNavigate?: () => void;
  className?: string;
  autoFocus?: boolean;
}

interface RankedCourse {
  course: Course;
  rank: number; // 1: title starts with, 2: title word starts with, 3: title contains, 4: category/skills contains
}

export const CourseSearchBar: React.FC<CourseSearchBarProps> = ({
  variant = 'desktop',
  placeholder = 'Search programs...',
  onNavigate,
  className = '',
  autoFocus = false
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  // Load all available course records from courseService (API / DB with fallback)
  useEffect(() => {
    let isMounted = true;
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const data = await courseService.getCourses();
        if (isMounted) {
          setAllCourses(data || []);
        }
      } catch (err) {
        console.error('Failed to load courses for search:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  // Matching & Ranking algorithm
  const searchResults = useMemo<Course[]>(() => {
    const rawTerm = query.trim().toLowerCase();
    if (!rawTerm || allCourses.length === 0) {
      return [];
    }

    const rankedList: RankedCourse[] = [];
    const seenIds = new Set<string>();

    for (const course of allCourses) {
      if (seenIds.has(course.id)) continue;

      const titleLower = (course.title || '').toLowerCase().trim();
      const categories = (course.categories || [course.category || '']).map((c) =>
        (c || '').toLowerCase().trim()
      );
      const skills = (course.skills || []).map((s) => (s || '').toLowerCase().trim());
      const shortDesc = (course.shortDescription || course.description || '').toLowerCase();

      // Check Rank 1: Title starts with query
      if (titleLower.startsWith(rawTerm)) {
        rankedList.push({ course, rank: 1 });
        seenIds.add(course.id);
        continue;
      }

      // Check Rank 2: Any word in the title starts with query
      const titleWords = titleLower.split(/\s+/);
      if (titleWords.some((w) => w.startsWith(rawTerm))) {
        rankedList.push({ course, rank: 2 });
        seenIds.add(course.id);
        continue;
      }

      // Check Rank 3: Title contains query anywhere
      if (titleLower.includes(rawTerm)) {
        rankedList.push({ course, rank: 3 });
        seenIds.add(course.id);
        continue;
      }

      // Check Rank 4: Category, skills, or short description contains query
      const categoryMatch = categories.some((c) => c.includes(rawTerm));
      const skillsMatch = skills.some((s) => s.includes(rawTerm));
      const descMatch = shortDesc.includes(rawTerm);

      if (categoryMatch || skillsMatch || descMatch) {
        rankedList.push({ course, rank: 4 });
        seenIds.add(course.id);
        continue;
      }
    }

    // Sort by rank ascending, then alphabetically by title
    rankedList.sort((a, b) => {
      if (a.rank !== b.rank) {
        return a.rank - b.rank;
      }
      return a.course.title.localeCompare(b.course.title);
    });

    return rankedList.map((item) => item.course);
  }, [query, allCourses]);

  // Reset selected index when searchResults change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle course navigation
  const handleSelectCourse = (course: Course) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    navigate(`/courses/${course.slug || course.id}`);
    if (onNavigate) {
      onNavigate();
    }
  };

  // Handle Enter on general search or selected item
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (selectedIndex >= 0 && searchResults[selectedIndex]) {
      handleSelectCourse(searchResults[selectedIndex]);
      return;
    }

    if (searchResults.length > 0) {
      // Default to first match if available
      handleSelectCourse(searchResults[0]);
      return;
    }

    // Otherwise navigate to catalog with search query parameter
    setIsOpen(false);
    navigate(`/courses?search=${encodeURIComponent(trimmed)}`);
    if (onNavigate) {
      onNavigate();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || searchResults.length === 0) {
      if (e.key === 'ArrowDown' && query.trim().length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev < searchResults.length - 1 ? prev + 1 : 0;
        scrollIntoView(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : searchResults.length - 1;
        scrollIntoView(next);
        return next;
      });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  const scrollIntoView = (index: number) => {
    if (!listRef.current) return;
    const items = listRef.current.children;
    if (items[index]) {
      (items[index] as HTMLElement).scrollIntoView({
        block: 'nearest'
      });
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const primaryCategory = (course: Course) => {
    const raw = (course.categories && course.categories[0]) || course.category || 'Program Track';
    return normalizeCategoryName(raw);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {variant === 'desktop' ? (
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={query}
              autoFocus={autoFocus}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                setIsOpen(val.trim().length > 0);
              }}
              onFocus={() => {
                if (query.trim().length > 0) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              className="w-36 xl:w-48 bg-slate-50 border border-slate-200/90 rounded-full py-1.5 pl-3.5 pr-8 text-xs focus:w-56 xl:focus:w-72 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 shadow-2xs"
            />
            {query.trim().length > 0 ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={query}
              autoFocus={autoFocus}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                setIsOpen(val.trim().length > 0);
              }}
              onFocus={() => {
                if (query.trim().length > 0) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-colors"
            />
            {query.trim().length > 0 ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </form>

      {/* Autocomplete Dropdown Panel */}
      {isOpen && query.trim().length > 0 && (
        <div
          className={`absolute pt-2 z-50 animate-fadeIn ${
            variant === 'desktop'
              ? 'top-full right-0 w-80 xl:w-96'
              : 'top-full left-0 right-0 w-full'
          }`}
        >
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-purple-950/10 overflow-hidden text-left divide-y divide-slate-100">
            
            {/* Header with Search Status */}
            <div className="px-3.5 py-2 bg-slate-50/80 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span className="text-slate-700 font-bold">
                Programs matching &ldquo;{query.trim()}&rdquo;
              </span>
              {searchResults.length > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-extrabold text-[10px]">
                  {searchResults.length} {searchResults.length === 1 ? 'course' : 'courses'}
                </span>
              )}
            </div>

            {/* Results List */}
            {searchResults.length > 0 ? (
              <ul
                ref={listRef}
                className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-slate-50 p-1.5 focus:outline-none"
                role="listbox"
              >
                {searchResults.map((course, index) => {
                  const isSelected = selectedIndex === index;
                  const catName = primaryCategory(course);
                  const isFree = (course.categories || [course.category]).some(
                    (c) => normalizeCategoryName(c) === 'Free Learning'
                  ) || course.price === 0;

                  return (
                    <li
                      key={course.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectCourse(course)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-purple-50 text-purple-950 ring-1 ring-purple-200'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      {/* Course Thumbnail or Icon */}
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 flex-shrink-0 flex items-center justify-center relative shadow-2xs">
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <BookOpen className="w-5 h-5 text-purple-600" />
                        )}
                        {isFree && (
                          <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-extrabold text-center uppercase tracking-tighter py-0.5">
                            FREE
                          </span>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-1.5 py-0.2 text-[10px] font-bold rounded uppercase tracking-wider ${
                              isFree
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : catName.includes('Tools')
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {catName}
                          </span>
                          {course.duration && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {course.duration}
                            </span>
                          )}
                        </div>

                        <h4
                          className={`text-xs sm:text-sm font-bold leading-snug truncate transition-colors ${
                            isSelected ? 'text-purple-700' : 'text-slate-900 group-hover:text-purple-600'
                          }`}
                        >
                          {course.title}
                        </h4>

                        {course.shortDescription && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 leading-tight">
                            {course.shortDescription}
                          </p>
                        )}
                      </div>

                      {/* Selection Chevron */}
                      <ChevronRight
                        className={`w-4 h-4 flex-shrink-0 transition-transform ${
                          isSelected
                            ? 'text-purple-600 translate-x-0.5'
                            : 'text-slate-300 group-hover:text-slate-500'
                        }`}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              /* No Results State */
              <div className="p-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  No courses found for &ldquo;{query.trim()}&rdquo;
                </h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Try searching for <strong>Python</strong>, <strong>Data Science</strong>, <strong>Power BI</strong>, <strong>Java</strong>, or <strong>Free Learning</strong>.
                </p>
              </div>
            )}

            {/* Footer Navigation Tip */}
            <div className="p-2.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 hidden sm:inline-flex items-center gap-1">
                <span>Use</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600 shadow-2xs">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600 shadow-2xs">
                  ↓
                </kbd>
                <span>to navigate</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/courses?search=${encodeURIComponent(query.trim())}`);
                  if (onNavigate) onNavigate();
                }}
                className="w-full sm:w-auto text-center font-bold text-purple-600 hover:text-purple-800 transition-colors inline-flex items-center justify-center gap-1 cursor-pointer ml-auto"
              >
                <span>View all in catalog</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
