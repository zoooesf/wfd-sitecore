import React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

export const EditModeClickDisabler: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;

  if (!isEditing) {
    return <>{children}</>;
  }

  return (
    <div
      data-editing-disabled="true"
      // Prevent all clicks on the div and its children
      className="[&_*]:pointer-events-none"
      // Prevent keyboard navigation
      onKeyDownCapture={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      {children}
    </div>
  );
};
