import React from 'react';
import { Link, NextImage, RichText, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Badge } from 'component-children/Shared/Badge/Badge';
import { Button } from 'component-children/Shared/Button/Button';
import { cn } from 'lib/helpers/classname';
import { pageEditCheck } from 'lib/helpers/page-edit-check';
import { useFrame } from 'lib/hooks/useFrame';
import { useImage } from 'lib/hooks/useImage';
import { useTranslation } from 'lib/hooks/useTranslation';
import { CardBadgeProps, CardFieldsProps, CardProps } from 'components/Cards/Card/Card';

const Card: React.FC<CardProps> = ({ fields, textColor }) => {
  const { textColor: componentTextColor, contentAlignment, effectiveTheme } = useFrame();
  const imageSrc = useImage(fields);

  return (
    <Wrapper fields={fields}>
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <CardBadgeRendering badge={fields.badge} />
        <NextImage
          field={imageSrc}
          width={640}
          height={360}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div
        className={cn(
          'flex flex-grow flex-col justify-between gap-2 bg-surface text-content',
          contentAlignment,
          effectiveTheme
        )}
      >
        <CardHeading fields={fields} />
        <RichText className="richtext relative w-full" field={fields.body} />
        <CardButton fields={fields} textColor={componentTextColor || textColor} />
      </div>
    </Wrapper>
  );
};

const CardBadgeRendering: React.FC<CardBadgeProps> = React.memo(({ badge }) => {
  const { page } = useSitecore();

  if (!badge?.value) return null;

  return pageEditCheck(
    page,
    <Badge className="absolute left-4 top-4 z-10 p-2">
      <Text field={badge} />
    </Badge>,
    badge.value
  );
});
CardBadgeRendering.displayName = 'CardBadgeRendering';

const CardHeading: React.FC<CardFieldsProps> = React.memo(({ fields }) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  const headingClasses = cn('heading-lg text-content', { 'line-clamp-2': !isEditing });

  return <Text field={fields.heading} tag="h3" className={headingClasses} />;
});
CardHeading.displayName = 'CardHeading';

const CardButton: React.FC<CardWrapperProps> = React.memo(({ fields, textColor }) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  const buttonTheme = textColor === 'text-white' ? 'white' : 'tertiary';

  return (
    <Button
      className={cn('copy-xs mt-auto')}
      variant="link"
      {...(isEditing
        ? { link: fields.link }
        : {
            theme: buttonTheme,
            children: fields?.link?.value?.text,
          })}
    />
  );
});
CardButton.displayName = 'CardButton';

const Wrapper: React.FC<CardWrapperProps> = ({ fields, children }) => {
  const { effectiveTheme } = useFrame();
  const { page } = useSitecore();
  const { t } = useTranslation();
  const isEditing = page?.mode.isEditing;
  const cardClasses = cn(
    'no-link-style group flex h-full w-full flex-col gap-4 rounded-lg p-1',
    effectiveTheme
  );

  if (isEditing) {
    return (
      <div data-component="Card" className={cardClasses}>
        {children}
      </div>
    );
  }

  return (
    <>
      {fields.link?.value?.href ? (
        <Link
          data-component="Card"
          className={cardClasses}
          field={fields.link}
          aria-label={
            fields.heading?.value ? `${t('Read More')} ${fields.heading.value}` : t('Read More')
          }
        >
          {children}
        </Link>
      ) : (
        <div
          data-component="Card"
          className={cardClasses}
          aria-label={
            fields.heading?.value ? `${t('Read More')} ${fields.heading.value}` : t('Read More')
          }
        >
          {children}
        </div>
      )}
    </>
  );
};

type CardWrapperProps = CardFieldsProps & { children?: React.ReactNode };

export default Card;
