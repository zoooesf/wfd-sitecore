import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook to calculate and maintain the content height
 * based on viewport height minus header and footer heights.
 *
 * @param routeName - Optional route name to trigger recalculation on route changes
 * @returns The calculated height without footer
 */
export const useContentHeight = (routeName?: string) => {
  const [contentHeight, setContentHeight] = useState(800);
  const debouncedResizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleResize = useCallback(() => {
    requestAnimationFrame(() => {
      const footer = document.querySelector('footer');
      const header = document.querySelector('header');
      if (!footer || !header) return;

      const footerHeight = footer.getBoundingClientRect().height;
      const headerHeight = header.getBoundingClientRect().height;
      const pageHeight = window.innerHeight;
      const calculatedHeight = pageHeight - footerHeight - headerHeight;

      setContentHeight(calculatedHeight);
    });
  }, []);

  const debouncedResize = useCallback(() => {
    clearTimeout(debouncedResizeTimeoutRef.current);
    debouncedResizeTimeoutRef.current = setTimeout(handleResize, 300);
  }, [handleResize]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [routeName, handleResize, debouncedResize]);

  return contentHeight;
};
