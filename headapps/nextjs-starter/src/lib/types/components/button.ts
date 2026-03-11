import { LinkField } from '@sitecore-content-sdk/nextjs';
import { ButtonColorType } from '../color';
import { IconType } from '../icon';

export type ButtonVariant = 'link' | 'button' | 'outline';

export type ButtonProps = {
  className?: string;
  color?: ButtonColorType;
  link?: LinkField;
  children?: React.ReactNode;
  iconLeft?: IconType;
  iconRight?: IconType;
  iconClasses?: string;
  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
