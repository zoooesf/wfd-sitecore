import { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { HalfWidthImage } from 'component-children/Shared/Image/Image';
import Button from 'component-children/Shared/Button/Button';
import Badge from 'component-children/Shared/Badge/Badge';
import { useFrame } from 'lib/hooks/useFrame';
import { BadgeColorType } from 'lib/types';
import { cn } from 'lib/helpers/classname';
import { useImage } from 'lib/hooks/useImage';
import { ArticleBannerProps } from 'lib/types/components/Articles/article-banner';
import { useTranslation } from 'lib/hooks/useTranslation';
import { getPageCategories } from 'lib/helpers/page-category';
import { ARTICLE_VARIANTS } from 'lib/helpers/article-variants';

const ArticleBanner = ({ fields, variant, rendering }: ArticleBannerProps): JSX.Element => {
  const { contentAlignment, bannerImgLeft, effectiveTheme, padding, paddingDesktop } = useFrame();
  const imageSrc = useImage(fields);
  const { t } = useTranslation();

  // Set defaults and create class combinations
  const componentContentAlignment = contentAlignment || 'items-start text-left';
  const categoryData = getPageCategories(fields?.pageCategory);
  const category = categoryData?.[0]?.fields?.pageCategory;
  const { path } = rendering;

  // Consistent styling for all variants
  const BADGE_THEME: BadgeColorType = 'primary';
  const BUTTON_VARIANT = 'link';

  // Container classes organized by purpose
  const containerClasses = cn(
    // Base styles - use CSS custom properties that respect theme
    'flex min-h-banner w-full items-center justify-center bg-surface text-content',
    // Responsive adjustments
    'md:max-h-155 md:min-h-125',
    // Layout direction based on configuration
    bannerImgLeft ? 'flex-col-reverse lg:flex-row-reverse' : 'flex-col lg:flex-row',
    // Apply padding from Frame context
    padding,
    paddingDesktop,
    // Apply theme from Frame context with fallback
    effectiveTheme
  );

  // Content container classes
  const contentClasses = cn(
    // Base styles
    'flex flex-col justify-center gap-4 px-6 py-8',
    // Responsive padding
    'md:px-12',
    // Width constraints
    'lg:max-w-half-outer-content',
    // Alignment from configuration
    componentContentAlignment,
    // Position based on image placement
    bannerImgLeft ? 'lg:mr-auto' : 'lg:ml-auto',
    // Width adjustment based on image presence
    !fields?.image ? 'w-4/5' : 'w-full md:w-1/2'
  );

  return (
    <section
      data-component="ArticleBanner"
      data-variant={variant ?? ARTICLE_VARIANTS.DEFAULT}
      className={containerClasses}
      role="region"
      aria-label={fields?.heading?.value}
    >
      <div className={contentClasses} role="presentation">
        {category?.value && (
          <Badge theme={BADGE_THEME} className="rounded-md px-2 py-1">
            <Text editable={false} field={category} />
          </Badge>
        )}
        <Text
          field={fields?.heading}
          tag="h2"
          className="heading-3xl md:heading-4xl text-content"
        />
        <RichText className="richtext" field={fields?.subheading} />
        {path && (
          <Button
            className="mt-auto"
            variant={BUTTON_VARIANT}
            link={{
              value: {
                href: path,
                target: '_self',
                text: t('Read More'),
              },
            }}
            iconRight="chevron-right"
            iconClasses="w-2"
          />
        )}
      </div>
      <HalfWidthImage image={imageSrc} />
    </section>
  );
};

export default ArticleBanner;
