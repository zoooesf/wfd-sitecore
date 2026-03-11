import { LinkField, Link as JSSLink } from '@sitecore-content-sdk/nextjs';
import { IconType } from 'lib/types';
import Icon, { IconVariant } from '../Icon/Icon';
import { IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { cn } from 'lib/helpers/classname';

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  iconPrefix = 'fab',
  icon,
  link,
  className,
  label,
  onClick,
  withBackground = true,
  unsetDefaultSize = false,
  variant = 'default',
  iconColor,
}) => {
  const classes = cn(
    'flex items-center justify-center rounded-full duration-300',
    {
      'bg-surface hover:bg-surface/80': withBackground,
      'h-6 w-6': !unsetDefaultSize,
    },
    className
  );

  if (!!link) {
    return (
      <JSSLink data-component="ButtonIcon" className={classes} aria-label={label} field={link}>
        <IconElement prefix={iconPrefix} icon={icon} variant={variant} iconColor={iconColor} />
      </JSSLink>
    );
  }

  if (onClick) {
    return (
      <button data-component="ButtonIcon" className={classes} aria-label={label} onClick={onClick}>
        <IconElement prefix={iconPrefix} icon={icon} variant={variant} iconColor={iconColor} />
      </button>
    );
  }

  return (
    <div data-component="ButtonIcon" className={classes} role="presentation" aria-label={label}>
      <IconElement prefix={iconPrefix} icon={icon} variant={variant} iconColor={iconColor} />
    </div>
  );
};

const IconElement: React.FC<{
  prefix: IconPrefix;
  icon: IconType;
  variant: IconVariant;
  iconColor?: string;
}> = ({ prefix, icon, variant, iconColor }) => (
  <Icon prefix={prefix} icon={icon} variant={variant} color={iconColor} />
);

type ButtonIconProps = {
  className?: string;
  link?: LinkField;
  iconPrefix?: IconPrefix;
  icon: IconType;
  label: string;
  onClick?: () => void;
  withBackground?: boolean;
  unsetDefaultSize?: boolean;
  variant?: IconVariant;
  iconColor?: string;
};

export default ButtonIcon;
