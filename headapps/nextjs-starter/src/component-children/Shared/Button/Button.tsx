import React, { useMemo } from 'react';
import { Link as JSSLink, LinkField, useSitecore } from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { pageEditCheck } from 'lib/helpers';
import { ButtonProps, ButtonVariant, IconType } from 'lib/types';
import Icon from '../Icon/Icon';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import { PRIMARY_THEME, SECONDARY_THEME, TERTIARY_THEME } from 'lib/const';

/**
 * UI responsible for Links and Buttons. This should be able to decide
 * what to display on the Experience Editor and Rendering Page.
 * This can also be used as a simple button without any link involved
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  link,
  className = '',
  color,
  variant = 'button',
  iconLeft,
  iconRight,
  iconClasses = 'w-3',
  ...props
}) => {
  // Smart color logic: Check parent theme from Frame context
  const { effectiveTheme } = useFrame();

  // Determine button color based on whether color was explicitly set
  const buttonColor = color
    ? color // Explicitly set - respect it
    : effectiveTheme === PRIMARY_THEME || effectiveTheme === TERTIARY_THEME
      ? 'secondary' // Parent uses light theme → button defaults to dark
      : effectiveTheme === SECONDARY_THEME
        ? 'tertiary' // Parent uses dark theme → button defaults to yellow
        : 'primary'; // Fallback to primary

  const classes = useMemo(
    () =>
      cn(
        BUTTON_COMMON_CLASS,
        BASE_CLASSES[variant],
        variant !== 'link' && buttonColor !== 'none' ? buttonColor : undefined, // Only apply color theme for button/outline variants, unless explicitly set to 'none'
        className
      ),
    [variant, className, buttonColor]
  );

  if (link)
    return (
      <LinkButton
        link={link}
        iconLeft={iconLeft}
        iconRight={iconRight}
        classes={classes}
        iconClasses={iconClasses}
        variant={variant}
      />
    );

  return (
    <button data-component="Button" role="button" type="button" className={classes} {...props}>
      <ButtonContent
        content={children}
        iconLeft={iconLeft}
        iconRight={iconRight}
        iconClasses={iconClasses}
        variant={variant}
      />
    </button>
  );
};

const LinkButton: React.FC<LinkButtonProps> = ({
  link,
  iconLeft,
  iconRight,
  classes,
  iconClasses,
  variant,
}) => {
  const { page } = useSitecore();
  const { href, querystring, anchor, target, text } = link.value;

  const linkHref = useMemo(() => {
    if (querystring || anchor) {
      return {
        pathname: href,
        query: querystring || undefined,
        hash: anchor || undefined,
      };
    }
    return href ?? '';
  }, [href, querystring, anchor]);

  return pageEditCheck(
    page,
    <div data-component="Button" className={classes}>
      <ButtonContent
        content={<JSSLink data-component="Button" field={link} />}
        iconLeft={iconLeft}
        iconRight={iconRight}
        iconClasses={iconClasses}
        variant={variant}
      />
    </div>,
    href,
    href && text ? (
      <Link data-component="Button" className={classes} href={linkHref} target={target}>
        <ButtonContent
          content={text}
          iconLeft={iconLeft}
          iconRight={iconRight}
          iconClasses={iconClasses}
          variant={variant}
        />
      </Link>
    ) : (
      <></>
    )
  );
};

/**
 * Component for rendering button content with icons
 */
const ButtonContent: React.FC<ButtonContentProps> = ({
  content,
  iconLeft,
  iconRight,
  iconClasses,
  variant,
}) => (
  <>
    {iconLeft && (
      <IconInButton position="left" icon={iconLeft} iconClasses={iconClasses} variant={variant} />
    )}
    <span className="text-content">{content}</span>
    {iconRight && (
      <IconInButton position="right" icon={iconRight} iconClasses={iconClasses} variant={variant} />
    )}
  </>
);

const IconInButton: React.FC<IconInButtonProps> = ({ position, icon, iconClasses, variant }) => {
  const coloredIcon = useMemo(() => {
    if (variant === 'outline') {
      return 'text-content group-hover:text-content';
    }
    return 'text-content';
  }, [variant]);

  return (
    <Icon
      className={cn('my-auto', position === 'left' ? 'mr-3' : 'ml-3', iconClasses)}
      color={coloredIcon}
      prefix="fas"
      icon={icon}
    />
  );
};

type ButtonContentProps = {
  content: React.ReactNode;
  iconLeft?: IconType;
  iconRight?: IconType;
  iconClasses?: string;
  variant?: ButtonVariant;
};

type IconInButtonProps = {
  position: 'left' | 'right';
  icon: IconType;
  iconClasses?: string;
  variant?: ButtonVariant;
};

type LinkButtonProps = ButtonProps & {
  link: LinkField;
  classes: string;
};

const BUTTON_COMMON_CLASS = 'w-fit text-content duration-200 flex items-center group';

const BASE_CLASSES = {
  button: cn(
    'heading-sm rounded-1 bg-button-surface px-6 py-3 text-center',
    'hover:bg-button-surface/90',
    'group-hover:bg-button-surface/90'
  ),
  link: cn(
    'copy-sm text-content underline',
    'hover:underline hover:opacity-80',
    'group-hover:opacity-80'
  ),
  outline: cn(
    'heading-sm rounded-1 border-1 border-content bg-surface px-6 py-3 text-center text-secondary',
    'hover:border-content hover:bg-button-surface hover:text-content'
  ),
};

export default Button;
