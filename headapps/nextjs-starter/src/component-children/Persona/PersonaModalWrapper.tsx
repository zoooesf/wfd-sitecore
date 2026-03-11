import { useEffect } from 'react';
import type { PropsWithChildren, RefObject } from 'react';
import { cn } from 'lib/helpers';
import { Portal } from 'component-children/Shared/Portal/Portal';
import { ThemeType } from 'lib/types';
import { PRIMARY_THEME } from 'lib/const';

interface PersonaModalWrapperProps extends PropsWithChildren {
  /** Title ID for aria-labelledby */
  titleId: string;
  /** Description ID for aria-describedby */
  descriptionId: string;
  /** Maximum width of modal content (default: 'md') */
  maxWidth?: 'md' | 'lg' | 'xl';
  /** Whether to show overflow-y-auto on content wrapper (default: true) */
  scrollableContent?: boolean;
  /** Custom className for the modal wrapper */
  wrapperClassName?: string;
  /** Custom className for the content wrapper */
  contentClassName?: string;
  /** Theme class to apply (default: 'primary') */
  theme?: ThemeType;
  /** Optional ref for the modal content div (for click-outside detection) */
  contentRef?: RefObject<HTMLDivElement | null>;
}

export const PersonaModalWrapper: React.FC<PersonaModalWrapperProps> = ({
  children,
  titleId,
  descriptionId,
  maxWidth = 'md',
  scrollableContent = true,
  wrapperClassName = '',
  contentClassName = '',
  theme = PRIMARY_THEME,
  contentRef,
}) => {
  // Disable page scroll when modal is shown
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const maxWidthClass = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  const overflowClass = scrollableContent ? 'overflow-y-auto' : 'overflow-hidden';

  return (
    <Portal>
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-60 flex items-center justify-center duration-300 animate-in fade-in',
          wrapperClassName,
          'print:hidden'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div
          ref={contentRef}
          className={cn(
            theme,
            'pointer-events-auto relative mx-4 max-h-modal w-full rounded-lg border border-content/30 bg-surface text-content shadow-xl delay-100 duration-300 animate-in zoom-in-95 slide-in-from-top-5',
            'md:mx-4',
            maxWidthClass,
            overflowClass,
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};
