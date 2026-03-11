import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

/**
 * Portal component for rendering children into a DOM node outside the component hierarchy
 * Safe for Next.js SSR/SSG - only renders on client after hydration
 */
export const Portal = ({ children, containerId = 'modal-root' }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This only runs on the client after hydration
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // During SSR or before hydration, return null
  if (!mounted) {
    return null;
  }

  // Additional safety check for browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  const container = document.getElementById(containerId);

  // If container doesn't exist, log error and return null
  if (!container) {
    console.error(`Portal container with id "${containerId}" not found`);
    return null;
  }

  return createPortal(children, container);
};
