import type { PropsWithChildren } from 'react';

/**
 * BlurryOverlay component that blurs and darkens content
 * Used for modal overlays and authentication screens
 */
export const BlurryOverlay: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="persona-blur-overlay pointer-events-none select-none blur-md brightness-50 contrast-75 print:blur-none print:brightness-100 print:contrast-100"
      aria-hidden="true"
    >
      {children}
    </div>
  );
};
