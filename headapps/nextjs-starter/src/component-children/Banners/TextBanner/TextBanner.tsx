import { JSX, useMemo } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { TextBannerProps } from 'lib/types/components/Banners/text-banner';
import { placeholderGenerator } from 'lib/helpers/sitecore';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers/classname';

const TextBanner = ({ fields, params, rendering }: TextBannerProps): JSX.Element => {
  const { effectiveTheme, contentAlignment } = useFrame();
  const innerContainerClasses = useMemo(
    () =>
      cn(
        'flex w-full flex-col gap-8',
        contentAlignment || 'items-center justify-center text-center'
      ),
    [contentAlignment]
  );
  const contentClasses = useMemo(
    () =>
      cn(
        'flex w-full flex-col xl:w-3/5',
        contentAlignment || 'items-center justify-center text-center'
      ),
    [contentAlignment]
  );
  const buttonContainerClasses = useMemo(
    () => cn('flex gap-4', contentAlignment || 'items-center justify-center text-center'),
    [contentAlignment]
  );

  return (
    <ContainedWrapper theme={effectiveTheme}>
      <section
        data-component="TextBanner"
        className="flex min-h-80 w-full flex-col items-center justify-center gap-8 py-15"
        aria-label={fields?.heading?.value}
        role="region"
      >
        <div className={innerContainerClasses}>
          <div className={contentClasses}>
            <Text field={fields?.heading} tag="h1" className="md:heading-5xl heading-4xl" />
            <RichText field={fields?.subheading} className="richtext w-full max-w-200" />
          </div>
          <Placeholder
            name={placeholderGenerator(params, 'buttons')}
            rendering={rendering}
            render={(components) =>
              components?.length > 0 && <div className={buttonContainerClasses}>{components}</div>
            }
          />
        </div>
      </section>
    </ContainedWrapper>
  );
};

export default TextBanner;
