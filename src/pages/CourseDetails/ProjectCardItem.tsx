import React, { useState } from 'react';
import { Calendar, FolderGit2 } from 'lucide-react';
import type { ProjectItem } from '../../types';

interface ProjectCardItemProps {
  projectItem: ProjectItem;
  getCategoryBadgeClass: (category?: string) => string;
}

export const ProjectCardItem: React.FC<ProjectCardItemProps> = ({
  projectItem,
  getCategoryBadgeClass
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const displayImage = projectItem.imageUrl || projectItem.image;
  const altText =
    projectItem.imageAlt ||
    `${projectItem.title} - ${projectItem.category || 'Data Science & AI'} Project`;

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-purple-300 transition-all duration-300 flex flex-col justify-between text-left">
      {/* 16:9 Project Visual Container */}
      <div className="relative w-full aspect-video bg-slate-100 overflow-hidden border-b border-slate-100 flex-shrink-0">
        {displayImage && !hasError ? (
          <>
            {!isLoaded && (
              <div className="absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center">
                <FolderGit2 className="w-8 h-8 text-slate-400 opacity-40 animate-pulse" />
              </div>
            )}
            <img
              src={displayImage}
              alt={altText}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {/* Subtle gradient overlay for hover contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </>
        ) : (
          /* Project-Specific Themed Fallback Placeholder */
          <div className="w-full h-full bg-gradient-to-br from-slate-50 via-purple-50/50 to-slate-100 flex flex-col items-center justify-center p-4 text-center select-none relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-200/30 rounded-full blur-xl pointer-events-none" />
            <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-purple-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <FolderGit2 className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-wide line-clamp-1 px-2">
              {projectItem.title}
            </span>
            <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider mt-0.5">
              {projectItem.category || 'Capstone Project'}
            </span>
          </div>
        )}
      </div>

      {/* Project Card Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-3">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {projectItem.category && (
              <span
                className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border shadow-2xs ${getCategoryBadgeClass(
                  projectItem.category
                )}`}
              >
                {projectItem.category}
              </span>
            )}

            {(projectItem.projectType || projectItem.duration) && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-md">
                {projectItem.projectType && <span>{projectItem.projectType}</span>}
                {projectItem.projectType && projectItem.duration && <span>•</span>}
                {projectItem.duration && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {projectItem.duration}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Project Title */}
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-950 leading-snug group-hover:text-purple-700 transition-colors">
            {projectItem.title}
          </h3>

          {/* Project Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {projectItem.description}
          </p>
        </div>

        {/* Technology Tags */}
        {projectItem.technologies && projectItem.technologies.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Technologies:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {projectItem.technologies.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
