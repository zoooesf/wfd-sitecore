import React from 'react';
import { BadgeColorType } from 'lib/types';
import { cn } from 'lib/helpers/classname';

/**
 * Tag component - Displays a styled tag with customizable theme and content
 * @param {TagProps} props - The component props
 * @returns {JSX.Element} A tag component
 */
export const Tag = React.memo<TagProps>(({ children, className = '', theme = '', ...props }) => {
  if (!children) {
    throw new Error('Tag component requires children');
  }

  const badgeClass = cn(
    'copy-sm w-fit bg-surface px-2 py-1 text-center text-content',
    theme,
    className
  );

  return (
    <span className={badgeClass} {...props} data-component="Tag">
      {children}
    </span>
  );
});

Tag.displayName = 'Tag';

export type TagProps = {
  theme?: BadgeColorType;
  children?: React.ReactNode;
  className?: string;
};

export default Tag;
