import { useState } from 'react';
import type { FC } from 'react';
import { cn } from 'lib/helpers/classname';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useFrame } from 'lib/hooks/useFrame';

/**
 * BypassBlock - Accessibility component that appears when Tab is pressed
 * Allows users to skip to main content
 */
export const BypassBlock: FC<BypassBlockProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();

  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-0 z-70 flex h-14 w-full items-center justify-center bg-surface transition-transform duration-200',
        // Visibility state
        isVisible ? 'translate-y-0' : '-translate-y-full',
        // Theme from useFrame hook (defaults to 'primary')
        effectiveTheme,
        // Additional classes
        className
      )}
      data-testid="bypass-block"
    >
      <div
        role="navigation"
        aria-label={t('Skip navigation')}
        className="flex w-full flex-row items-center justify-center px-4 md:max-w-outer-content lg:justify-start"
      >
        <a
          href="#content"
          className="font-medium text-content hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-content"
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
        >
          {t('Skip to main content')}
        </a>
      </div>
    </div>
  );
};

type BypassBlockProps = {
  className?: string;
};
