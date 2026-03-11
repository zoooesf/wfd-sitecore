import { useEffect, RefObject } from 'react';

export const useClickOutside = (
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if the clicked element is a link or inside a link
      const isLink = target.closest('a');
      if (isLink) return;

      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node)
      );

      if (isOutside) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, handler, enabled]);
};
