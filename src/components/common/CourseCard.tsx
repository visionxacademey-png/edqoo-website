import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Star, PhoneCall, ArrowRight } from 'lucide-react';
import { getCacheBustedImageUrl, DEFAULT_ENGLISH_COURSE_FALLBACK } from '../../utils/imageUrl';
import { normalizeCategoryName, isEnglishMirrorCourse } from '../../data/courses';
import type { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  selectedCategory?: string;
  onEnquire?: (title: string, details?: any) => void;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  selectedCategory,
  onEnquire,
  className = ''
}) => {
  const navigate = useNavigate();
  const isSpokenTutorialOrPartner =
    isEnglishMirrorCourse(course) ||
    (course.categories || [course.category]).some((c: string) => {
      const norm = normalizeCategoryName(c);
      return norm === 'Spoken Tutorial' || norm === 'English Mirror';
    });

  const isFree =
    !isSpokenTutorialOrPartner &&
    ((course.categories || [course.category]).some(
      (c: string) => normalizeCategoryName(c) === 'Free Learning'
    ) || course.price === 0);

  return (
    <div
      onClick={() => navigate(`/courses/${course.slug}`)}
      className={`cursor-pointer flex flex-col justify-between overflow-hidden group bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-[#6D22B5] hover:shadow-md transition-all ${className}`}
    >
      {/* Clean Top Course Image without category pill overlaps */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
        <img
          src={getCacheBustedImageUrl(course.image, course.updatedAt || course.imageUpdatedAt, DEFAULT_ENGLISH_COURSE_FALLBACK)}
          alt={`${course.title} - Edqoo online course`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== DEFAULT_ENGLISH_COURSE_FALLBACK) {
              target.src = DEFAULT_ENGLISH_COURSE_FALLBACK;
            }
          }}
        />

        {/* Top-Right Badge: FREE or Live Hours Badge */}
        {isFree ? (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#6D22B5] text-white text-[10px] font-extrabold rounded-md shadow-sm uppercase tracking-wider">
            FREE
          </span>
        ) : course.liveHours ? (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#6D22B5] text-white text-[10px] font-extrabold rounded-md shadow-sm">
            {course.liveHours} Live
          </span>
        ) : null}
      </div>

      {/* Course Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-left">
        <div className="space-y-1.5">
          <h3 className="font-display font-bold text-sm text-slate-950 group-hover:text-black transition-colors line-clamp-2">
            <Link to={`/courses/${course.slug}`} onClick={(e) => e.stopPropagation()}>
              {course.title}
            </Link>
          </h3>
          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
            {course.shortDescription || course.description}
          </p>
        </div>

        {/* Feature / Skill Badges */}
        <div className="flex flex-wrap gap-1">
          {(course.skills || []).slice(0, 3).map((skill: string) => (
            <span
              key={skill}
              className="px-1.5 py-0.5 bg-[#F1E8FA] border border-[#E0CEF5] text-[#6D22B5] text-[9px] font-semibold rounded"
            >
              {skill}
            </span>
          ))}
          {(course.skills || []).length > 3 && (
            <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-medium rounded">
              +{(course.skills || []).length - 3}
            </span>
          )}
        </div>

        {/* Metadata: Duration & Rating */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
          <span className="flex items-center gap-1 font-bold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-[#6D22B5]" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            {course.rating > 0 ? (typeof course.rating === 'number' ? course.rating.toFixed(1) : course.rating) : '4.9'}
          </span>
        </div>

        {/* Actions: Enquire Now & Details */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 w-full">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onEnquire) {
                  onEnquire(course.title, {
                    category: isFree
                      ? 'Free Learning'
                      : selectedCategory === 'Tools and Upskills'
                      ? 'Tools and Upskills'
                      : course.category,
                    courseId: course.id,
                    categories: course.categories
                  });
                }
              }}
              className="btn-primary flex-1 py-1.5 text-[10px] font-bold rounded-lg inline-flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Enquire Now</span>
            </button>
            <Link
              to={`/courses/${course.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1.5 text-[10px] font-bold text-slate-600 hover:text-black rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors inline-flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
