import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition, IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';
import { memo } from 'react';
import { cn } from 'lib/helpers/classname';

/** Generic icon component that accepts any FontAwesome icon prefix */
const Icon: React.FC<IconProps> = memo(({ prefix, icon, className, spin, color, variant }) => (
  <FontAwesomeIcon
    icon={findIconDefinition({
      prefix,
      iconName: icon,
    })}
    className={getIconClasses(className, color, variant)}
    spin={spin}
  />
));
/** Convenience component for solid FontAwesome icons */
export const IconFas: React.FC<IconPrefixedProps> = memo(
  ({ icon, className, spin, color, variant }) => (
    <FontAwesomeIcon
      icon={findIconDefinition({
        prefix: 'fas',
        iconName: icon,
      })}
      className={getIconClasses(className, color, variant)}
      spin={spin}
    />
  )
);

/** Convenience component for brand FontAwesome icons */
export const IconFab: React.FC<IconPrefixedProps> = memo(
  ({ icon, className, spin, color, variant }) => (
    <FontAwesomeIcon
      icon={findIconDefinition({
        prefix: 'fab',
        iconName: icon,
      })}
      className={getIconClasses(className, color, variant)}
      spin={spin}
    />
  )
);

/** Utility function to generate icon classes */
export const getIconClasses = (
  className?: string,
  color?: string,
  variant: IconVariant = 'default'
): string => {
  // Theme-based color mapping
  const themeColorMap: Record<IconVariant, string> = {
    default: 'text-black',
    white: 'text-white',
    primary: 'text-primary',
    secondary: 'text-secondary',
    tertiary: 'text-tertiary',
  };

  // Use explicit color if provided, otherwise use theme variant
  const colorClass = color || themeColorMap[variant];

  return cn(className ?? 'h-4 w-4', colorClass);
};

/** Theme variants for icons */
export type IconVariant = 'default' | 'primary' | 'secondary' | 'tertiary' | 'white';

/** Props shared between Icon components */
type IconPrefixedProps = {
  /** The FontAwesome icon name */
  icon: IconName;
  /** Optional CSS classes */
  className?: string;
  /** Optional text color class (should be a Tailwind color class) */
  color?: string;
  /** Theme-based color variant */
  variant?: IconVariant;
  /** Whether the icon should spin */
  spin?: boolean;
};

type IconProps = {
  /** The FontAwesome icon prefix (e.g., 'fas', 'far') */
  prefix: IconPrefix;
} & IconPrefixedProps;

Icon.displayName = 'Icon';
IconFas.displayName = 'IconFas';
IconFab.displayName = 'IconFab';

export default Icon;
