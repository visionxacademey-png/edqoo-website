import React from 'react';

interface CourseSkeletonProps {
  count?: number;
  className?: string;
}

export const CourseSkeleton: React.FC<CourseSkeletonProps> = ({ count = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col justify-between overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-2xs animate-pulse"
        >
          {/* Card Image Skeleton */}
          <div className="relative aspect-[16/10] bg-slate-200 overflow-hidden">
            {/* Shimmer gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
            
            {/* Top-left category tag badge skeleton */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              <div className="h-5 w-24 bg-slate-300/80 rounded-md" />
            </div>

            {/* Top-right badge skeleton */}
            <div className="absolute top-3 right-3">
              <div className="h-5 w-14 bg-slate-300/80 rounded-md" />
            </div>
          </div>

          {/* Card Content Skeleton */}
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
            <div className="space-y-2">
              {/* Title lines */}
              <div className="h-4 bg-slate-200 rounded-md w-4/5" />
              <div className="h-4 bg-slate-200 rounded-md w-3/5" />
              
              {/* Short description line */}
              <div className="h-3 bg-slate-100 rounded-md w-full mt-1.5" />
            </div>

            {/* Skill tags skeleton */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <div className="h-4 w-16 bg-purple-100/70 rounded" />
              <div className="h-4 w-14 bg-purple-100/70 rounded" />
              <div className="h-4 w-12 bg-purple-100/70 rounded" />
            </div>

            {/* Meta info bar (Duration, Live hours, Rating) */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
              <div className="h-3.5 w-20 bg-slate-200 rounded" />
              <div className="h-3.5 w-16 bg-slate-200 rounded" />
              <div className="h-3.5 w-12 bg-amber-100 rounded" />
            </div>

            {/* Bottom Actions skeleton */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <div className="h-8 flex-1 bg-purple-200/60 rounded-lg" />
              <div className="h-8 w-20 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
