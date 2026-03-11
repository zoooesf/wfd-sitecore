import React from 'react';
import { RichText, Text, Link, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useFrame } from 'lib/hooks/useFrame';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import Button from 'component-children/Shared/Button/Button';
import { cn } from 'lib/helpers/classname';
import {
  IconFeatureCardFieldsProps,
  IconFeatureCardProps,
} from 'components/IconFeatureCards/IconFeatureCard/IconFeatureCard';
import { SECONDARY_THEME } from 'lib/const';

const IconFeatureCard: React.FC<IconFeatureCardProps> = ({ fields }) => {
  const { effectiveTheme } = useFrame();

  // Icon background based on the card's applied theme
  const iconBgColor = effectiveTheme === SECONDARY_THEME ? 'bg-tertiary' : 'bg-secondary';
  const iconVariant = effectiveTheme === SECONDARY_THEME ? 'default' : 'white';

  return (
    <Wrapper fields={fields} data-component="IconFeatureCard" appliedTheme={effectiveTheme}>
      <div className="flex flex-grow flex-col gap-4 p-6 duration-300">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', iconBgColor)}>
          <IconFas
            icon={fields.imageIcon?.name as IconName}
            className="h-6 w-6"
            variant={iconVariant}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Text field={fields.heading} tag="h3" className="heading-2xl duration-300" />
          <RichText field={fields.subheading} className="richtext copy-lg" />
          <CardButton fields={fields} />
        </div>
      </div>
    </Wrapper>
  );
};

const CardButton: React.FC<IconFeatureCardFieldsProps> = ({ fields }) => {
  const { page } = useSitecore();
  const link = fields.link;
  const linkText = link?.value?.text;

  if (!page?.mode.isEditing && !linkText) return null;

  return (
    <Button className="mt-auto" variant="button" link={page?.mode.isEditing ? link : undefined}>
      {!page?.mode.isEditing && linkText}
    </Button>
  );
};

const Wrapper: React.FC<CardWrapperProps> = ({ fields, children, appliedTheme }) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;

  const cardClasses = cn(
    'card reverse group flex h-full w-full flex-col gap-4 bg-surface text-content',
    appliedTheme
  );

  const withLinkClasses = fields?.link?.value?.href
    ? 'no-underline cursor-pointer hover:shadow-2xl'
    : '';

  if (isEditing || !fields?.link?.value?.href) {
    return (
      <div data-component="IconFeatureCard" className={cardClasses}>
        {children}
      </div>
    );
  }

  return (
    <Link
      data-component="IconFeatureCard"
      className={cn(cardClasses, withLinkClasses)}
      field={fields.link}
    >
      {children}
    </Link>
  );
};

type CardWrapperProps = IconFeatureCardFieldsProps & {
  children?: React.ReactNode;
  appliedTheme: string;
};

export default IconFeatureCard;
