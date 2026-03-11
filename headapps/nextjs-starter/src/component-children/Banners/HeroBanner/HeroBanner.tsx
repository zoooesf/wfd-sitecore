import { useMemo } from 'react';
import { RichText } from '@sitecore-content-sdk/nextjs';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import { BackgroundImage } from 'component-children/Shared/BackgroundImage/BackgroundImage';
import { HeroBannerProps } from 'lib/types/components/Banners/hero-banner';
import { placeholderGenerator } from 'lib/helpers/sitecore';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers/classname';
import { useTranslation } from 'lib/hooks/useTranslation';

const HeroBanner: React.FC<HeroBannerProps> = ({ fields, params, rendering }) => {
  const { t } = useTranslation();
  const { contentAlignment, effectiveTheme } = useFrame();

  // Memoize class computations to avoid recalculations on re-renders
  const alignmentClasses = useMemo(
    () => contentAlignment || 'items-start justify-start text-left',
    [contentAlignment]
  );
  const innerContainerClasses = useMemo(
    () => cn('flex w-full max-w-outer-content flex-col gap-8 py-8', alignmentClasses),
    [alignmentClasses]
  );
  const contentClasses = useMemo(
    () => cn('flex h-1/2 w-full flex-col xl:w-3/5', alignmentClasses),
    [alignmentClasses]
  );
  const headingClasses = useMemo(() => cn('md:heading-5xl heading-4xl text-content'), []);
  const subheadingClasses = useMemo(
    () => cn('richtext copy-2xl w-full max-w-150 text-content'),
    []
  );
  const headingText = fields?.heading?.value || t('Hero Banner');

  return (
    <section
      data-component="HeroBanner"
      className={cn(
        'relative flex min-h-hero w-full items-center justify-center bg-cover bg-left px-8 text-content md:min-h-hero-lg lg:px-16',
        effectiveTheme
      )}
      role="region"
      aria-label={headingText}
    >
      <BackgroundImage fields={fields} />
      <div className="absolute inset-0 -z-10 h-full w-full bg-black/25" aria-hidden="true" />
      <div className={innerContainerClasses} aria-hidden="true">
        <div className={contentClasses}>
          <Text field={fields?.heading} tag="h1" className={headingClasses} />
          <RichText field={fields?.subheading} className={subheadingClasses} />
        </div>
        <Placeholder
          name={placeholderGenerator(params, 'buttons')}
          rendering={rendering}
          render={(components) => (
            <div className={cn('mt-auto flex justify-center gap-4', alignmentClasses)}>
              {components}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default HeroBanner;
