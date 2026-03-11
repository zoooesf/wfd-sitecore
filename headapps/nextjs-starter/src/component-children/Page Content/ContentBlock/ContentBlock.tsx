import { Text, RichText, useSitecore, NextImage, Placeholder } from '@sitecore-content-sdk/nextjs';
import { useFrame } from 'lib/hooks/useFrame';
import { placeholderGenerator } from 'lib/helpers';
import { cn } from 'lib/helpers/classname';
import { ContentBlockProps } from 'components/Page Content/ContentBlock/ContentBlock';

const ContentBlock: React.FC<ContentBlockProps> = ({ fields, params, rendering }) => {
  const { effectiveTheme } = useFrame();
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  const richtextClassName = cn('richtext w-full', {
    'line-clamp-5': !isEditing,
  });
  const containerClasses = cn(
    'flex h-full w-full flex-col items-start justify-start gap-5 bg-surface px-0 py-15 text-left text-content md:px-10',
    effectiveTheme
  );

  return (
    <div data-component="ContentBlock" className={containerClasses}>
      <NextImage
        width={640}
        height={360}
        className="aspect-square h-auto w-full object-cover sm:w-80"
        field={fields?.image}
      />
      <div className="flex w-full flex-col gap-5">
        <Text field={fields?.heading} tag="h2" className="heading-3xl" />
        <RichText className={richtextClassName} field={fields?.body} />
      </div>
      <Placeholder
        name={placeholderGenerator(params, 'buttons')}
        rendering={rendering}
        render={(components) => <div className="mt-auto flex w-full gap-4">{components}</div>}
      />
    </div>
  );
};

export default ContentBlock;
