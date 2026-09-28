import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global Route Scroll Restoration Handler
 * 
 * Ensures that navigating between pages always starts at Y = 0 (top of page)
 * with instant behavior, while safely preserving legitimate in-page section scrolling.
 */
export const ScrollToTop = () => {
  const location = useLocation();
  const prevPathnameRef = useRef<string>(location.pathname);

  // Disable automatic browser history scroll restoration on client
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const isNewPage = prevPathnameRef.current !== location.pathname;
    prevPathnameRef.current = location.pathname;

    // If an anchor hash is explicitly provided (e.g. /courses#curriculum)
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // When entering a new page or when navigation occurs without an anchor hash
    if (isNewPage || !location.hash) {
      // 1. Instant window scroll to absolute top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });

      // 2. Direct DOM scroll reset for cross-browser reliability
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 3. Reset any scrollable main container (e.g., inside dashboard/admin views)
      const mainElement = document.querySelector('main');
      if (mainElement && mainElement.scrollTop > 0) {
        mainElement.scrollTop = 0;
      }

      // 4. Request animation frame safeguard for async/lazy-loaded chunk mounting
      const rafId = requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant' as ScrollBehavior,
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        const innerMain = document.querySelector('main');
        if (innerMain && innerMain.scrollTop > 0) {
          innerMain.scrollTop = 0;
        }
      });

      return () => {
        cancelAnimationFrame(rafId);
      };
    }
  }, [location.pathname, location.hash, location.key]);

  return null;
};
