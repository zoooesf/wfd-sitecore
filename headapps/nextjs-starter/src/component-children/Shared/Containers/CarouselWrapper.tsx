import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import React from 'react';
import { ThemeType } from 'lib/types';

export const CarouselWrapper: React.FC<CarouselWrapperProps> = ({
  children,
  theme,
  innerClassName,
}) => {
  const { padding, paddingDesktop, effectiveTheme } = useFrame();
  const appliedTheme = theme || effectiveTheme;
  const classes = cn(
    'relative w-full bg-surface p-8 text-content lg:px-12 lg:py-15',
    padding,
    paddingDesktop,
    appliedTheme
  );
  const carouselWrapperClass = cn('m-auto w-full max-w-outer-content-carousel', innerClassName);

  return (
    <div data-component="CarouselWrapper" className={classes}>
      <div className={carouselWrapperClass}>{children}</div>
    </div>
  );
};

type CarouselWrapperProps = {
  children: React.ReactNode;
  theme?: ThemeType;
  innerClassName?: string;
};
