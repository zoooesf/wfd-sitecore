import { useEffect } from 'react';

/**
 * Hook to handle browser back/forward navigation for search widgets.
 *
 * This hook manages two critical aspects of browser navigation:
 *
 * 1. **Back/Forward Detection**: When the user presses the back or forward button,
 *    the page is reloaded to reinitialize the Sitecore Search state with the new URL
 *    parameters. A flag is set in sessionStorage to prevent duplicate URL pushes
 *    during the reload cycle.
 *
 * 2. **Flag Cleanup**: After all effects have had a chance to check the browser
 *    navigation flag, it is cleared to allow normal URL updates to resume.
 *
 * The sessionStorage flag `__isBrowserNavigation` persists across the page reload
 * and is checked by URL synchronization hooks to prevent them from pushing duplicate
 * history entries during the reload process.
 *
 * Note: window.location.reload() does NOT clear browser forward/back history.
 * It only reloads the current URL that the browser navigated to.
 *
 * @example
 * // Use this hook in any search component that needs browser navigation support
 * function MySearchComponent() {
 *   useBrowserNavigation();
 *   // ... rest of component
 * }
 */
export const useBrowserNavigation = (): void => {
  /**
   * Effect to clear the browser navigation flag after all effects have checked it.
   * This runs once on mount and clears the flag after a delay to ensure all useEffects
   * in the component and other hooks have had a chance to check it.
   */
  useEffect(() => {
    const isBrowserNav =
      typeof window !== 'undefined' && sessionStorage.getItem('__isBrowserNavigation') === 'true';

    if (isBrowserNav) {
      // Clear the flag after all effects have had a chance to check it
      // This delay ensures both the component's useEffect and other hooks have run
      const timeoutId = setTimeout(() => {
        sessionStorage.removeItem('__isBrowserNavigation');
      }, 500); // 500ms delay to be safe

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, []); // Run once on mount

  /**
   * Effect to handle browser back/forward navigation.
   * When the user presses back/forward buttons, we need to reload the page to reinitialize
   * the Sitecore Search state with the new URL parameters.
   *
   * We use sessionStorage to persist a flag across the reload that prevents both the main
   * component and other hooks from pushing duplicate URL entries during the reload process.
   */
  useEffect(() => {
    const handlePopState = () => {
      // Set a flag in sessionStorage that persists across page reload
      // This prevents URL pushing during the reload cycle
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('__isBrowserNavigation', 'true');
      }

      // Reload the page to reinitialize search state with new URL
      window.location.reload();
    };

    // Listen for popstate which fires for browser back/forward
    window.addEventListener('popstate', handlePopState);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
};
