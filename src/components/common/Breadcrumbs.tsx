import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbItem } from './StructuredData';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium ${className}`}
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-purple-600 transition-colors text-slate-600"
        title="Edqoo Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const itemName = item.name || item.label || '';
        const itemUrl = item.url || '#';

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
            {isLast || !item.url ? (
              <span
                className="font-bold text-purple-700 truncate max-w-[260px] sm:max-w-md"
                aria-current={isLast ? 'page' : undefined}
              >
                {itemName}
              </span>
            ) : (
              <Link
                to={itemUrl}
                className="hover:text-purple-600 transition-colors text-slate-600 truncate max-w-[200px]"
              >
                {itemName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

