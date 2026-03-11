import { Text, RichText, useSitecore, NextImage, Placeholder } from '@sitecore-content-sdk/nextjs';
import { useFrame } from 'lib/hooks/useFrame';
import { ContentBlockProps } from 'components/Page Content/ContentBlock/ContentBlock';
import { cn } from 'lib/helpers/classname';
import { placeholderGenerator } from 'lib/helpers';

export const ContentBlockImageLeft: React.FC<ContentBlockProps> = ({
  fields,
  params,
  rendering,
}) => {
  const { effectiveTheme, transparent } = useFrame();
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  const richtextClassName = cn('richtext w-full', { 'line-clamp-5': !isEditing });
  const containerClasses = cn(
    'reverse flex h-full w-full flex-col items-center justify-center gap-6 p-10 text-left text-black lg:py-15',
    'md:flex-row lg:items-start lg:gap-10',
    effectiveTheme,
    { 'bg-transparent': transparent }
  );

  return (
    <div className={containerClasses} data-component="ContentBlock">
      <div className="self-start lg:basis-64">
        <NextImage
          width={640}
          height={360}
          className="aspect-square h-auto w-full object-cover sm:w-64"
          field={fields?.image}
        />
      </div>
      <div className="flex w-full basis-1/2 flex-col items-center justify-center gap-5 text-center lg:items-start lg:text-left">
        <Text field={fields?.heading} tag="h2" className="heading-3xl max-w-screen-sm" />
        <RichText className={richtextClassName} field={fields?.body} />
        <Placeholder
          name={placeholderGenerator(params, 'buttons')}
          rendering={rendering}
          render={(components) => (
            <div className="mt-4 flex w-full justify-center gap-4 lg:justify-start">
              {components}
            </div>
          )}
        />
      </div>
    </div>
  );
};
