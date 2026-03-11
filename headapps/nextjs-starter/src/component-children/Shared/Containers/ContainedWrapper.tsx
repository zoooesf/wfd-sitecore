import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import React from 'react';
import { ThemeType } from 'lib/types';

export const ContainedWrapper: React.FC<ContainedWrapperProps> = ({
  children,
  theme,
  innerClassName,
  className,
}) => {
  const { padding, paddingDesktop, effectiveTheme } = useFrame();
  const appliedTheme = theme || effectiveTheme;
  const classes = cn(
    'relative w-full bg-surface px-8 text-content lg:px-16',
    padding,
    paddingDesktop,
    appliedTheme,
    className
  );
  const containedWrapperClass = cn('m-auto w-full max-w-outer-content', innerClassName);

  return (
    <div data-component="ContainedWrapper" className={classes}>
      <div className={containedWrapperClass}>{children}</div>
    </div>
  );
};

type ContainedWrapperProps = {
  children: React.ReactNode;
  theme?: ThemeType;
  innerClassName?: string;
  className?: string;
};
