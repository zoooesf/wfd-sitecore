import { JSX, useMemo } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import { BackgroundImage } from 'component-children/Shared/BackgroundImage/BackgroundImage';
import { ContentBannerProps } from 'lib/types/components/Banners/content-banner';
import { placeholderGenerator } from 'lib/helpers/sitecore';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers/classname';

/**
 * ContentBanner - Main banner component with background image and content
 * @param {ContentBannerProps} props - Component props
 * @returns {JSX.Element} Banner section with background and content
 */
const ContentBanner = ({ fields, params, rendering }: ContentBannerProps): JSX.Element => {
  const { effectiveTheme, bannerContentAlignment: alignment } = useFrame();

  // Memoize class names to prevent unnecessary recalculations
  const className = useMemo(
    () =>
      cn(
        'relative flex min-h-hero w-full bg-cover bg-left text-content',
        'md:min-h-175',
        effectiveTheme
      ),
    [effectiveTheme]
  );

  const gradientClassName = useMemo(
    () =>
      cn(
        'absolute inset-0 bg-gradient-to-b from-transparent via-30% to-surface',
        alignment === 'md:mr-auto'
          ? 'lg:bg-gradient-to-l lg:via-30%'
          : 'lg:bg-gradient-to-r lg:via-30%'
      ),
    [alignment]
  );

  return (
    <section data-component="ContentBanner" className={className}>
      <BackgroundImage fields={fields} />
      <div className={gradientClassName} />
      <div className="relative w-full px-8 py-10 lg:px-16">
        <div className="m-auto h-full w-full max-w-outer-content">
          <Content fields={fields} params={params} rendering={rendering} />
        </div>
      </div>
    </section>
  );
};

/**
 * Content - Renders the text content, buttons, and decorative line
 * @param {BannerFieldsProps} props - Props containing banner fields
 * @returns {JSX.Element} Content container with heading, body text, and CTA
 */
const Content: React.FC<ContentBannerProps> = ({ fields, params, rendering }) => {
  const { bannerContentAlignment: alignment } = useFrame();

  // Memoize container class names based on alignment from frame context
  const containerClassName = useMemo(
    () =>
      cn(
        'flex h-full w-full flex-col justify-center gap-8 px-8 py-16 text-content md:w-120 lg:px-12',
        'md:w-140',
        'lg:px-12',
        alignment
      ),
    [alignment]
  );

  return (
    <div data-component="Content" className={containerClassName}>
      <div className="flex flex-col justify-center gap-6">
        <Text field={fields?.heading} tag="h2" className="heading-4xl text-content" />
        <RichText field={fields?.body} className="richtext w-full text-content" />
      </div>
      <Placeholder
        name={placeholderGenerator(params, 'buttons')}
        rendering={rendering}
        render={(components) => <div className="flex w-full gap-4">{components}</div>}
      />
    </div>
  );
};

export default ContentBanner;
