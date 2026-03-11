import React from 'react';
import { BadgeColorType } from 'lib/types';
import { cn } from 'lib/helpers/classname';

/**
 * Badge component - Displays a styled badge with customizable theme and content
 * @param {BadgeProps} props - The component props
 * @returns {JSX.Element} A badge component
 */
export const Badge = React.memo<BadgeProps>(
  ({ children, className = '', theme = '', ...props }) => {
    if (!children) {
      throw new Error('Badge component requires children');
    }

    const badgeClass = cn(
      'eyebrow w-fit bg-surface p-2 text-center uppercase text-content',
      theme,
      className
    );

    return (
      <span className={badgeClass} {...props} data-component="Badge">
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export type BadgeProps = {
  theme?: BadgeColorType;
  children?: React.ReactNode;
  className?: string;
};

export default Badge;
