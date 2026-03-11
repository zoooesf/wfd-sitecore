import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import React from 'react';
import { ThemeType } from 'lib/types';

/**
 * A wrapper component that provides full-width container with consistent padding
 * @param {React.ReactNode} children - Content to be wrapped
 * @param {ThemeType} theme - Theme variant - can be used to pass in custom classes
 * @param {string} innerClassName - Additional classes for inner container
 */
export const FullWidthWrapper: React.FC<FullWidthWrapperProps> = React.memo(
  ({ children, theme, innerClassName, className, ...props }) => {
    const { padding, paddingDesktop, effectiveTheme } = useFrame();
    const appliedTheme = theme || effectiveTheme;
    const classes = cn(
      'relative w-full bg-surface text-content',
      padding,
      paddingDesktop,
      appliedTheme,
      className
    );
    const containedWrapperClass = cn('w-full', innerClassName);

    return (
      <div data-component="FullWidthWrapper" className={classes} {...props}>
        <div className={containedWrapperClass}>{children}</div>
      </div>
    );
  }
);

FullWidthWrapper.displayName = 'FullWidthWrapper';

type FullWidthWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  theme?: ThemeType;
  innerClassName?: string;
};
