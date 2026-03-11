import React from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type SearchSkeletonThemeProps = {
  children: React.ReactNode;
};

/**
 * Wrapper component that configures react-loading-skeleton colors to match Tailwind theme.
 * Uses CSS variables for theme colors to support light/dark mode and custom themes.
 */
export const SearchSkeletonTheme: React.FC<SearchSkeletonThemeProps> = ({ children }) => {
  return (
    <SkeletonTheme baseColor="rgb(var(--text) / 0.1)" highlightColor="rgb(var(--text) / 0.05)">
      {children}
    </SkeletonTheme>
  );
};
