import { Text, useSitecore, NextImage } from '@sitecore-content-sdk/nextjs';
import moment from 'moment';
import Link from 'next/link';
import { ResourceDataType } from 'lib/types';
import { pageEditCheck } from 'lib/helpers';
import { cn } from 'lib/helpers/classname';
import { getPageCategories } from 'lib/helpers/page-category';
import { useFrame } from 'lib/hooks/useFrame';
import { PRIMARY_THEME, TERTIARY_THEME } from 'lib/const';

export const ResourceCard: React.FC<ResourceCardProps> = ({ fields }) => {
  const { effectiveTheme } = useFrame();

  return (
    <ResourceCardWrapper href={fields?.url?.path ?? ''} effectiveTheme={effectiveTheme}>
      <BodySection fields={fields} effectiveTheme={effectiveTheme} />
      <ImageSection fields={fields} />
    </ResourceCardWrapper>
  );
};

const ResourceCardWrapper: React.FC<ResourceCardWrapperProps> = ({
  href,
  children,
  effectiveTheme,
}) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;

  // Theme-based border color
  const borderColorClass =
    effectiveTheme === PRIMARY_THEME || effectiveTheme === TERTIARY_THEME
      ? 'border-black/25'
      : 'border-content/25';

  const cardClasses = cn(
    'group relative flex w-full cursor-pointer flex-col gap-4 overflow-hidden border-b-1 bg-surface py-8 text-content no-underline hover:underline',
    'last:border-b-0',
    'md:flex-row',
    borderColorClass,
    effectiveTheme
  );

  if (isEditing) {
    return (
      <div className={cardClasses} data-component="ResourceCard">
        {children}
      </div>
    );
  }

  return (
    <Link href={href} className={cardClasses} data-component="ResourceCard">
      {children}
    </Link>
  );
};

const ImageSection: React.FC<ResourceCardFieldsProps> = ({ fields }) => {
  const { page } = useSitecore();
  return pageEditCheck(
    page,
    <div className="relative h-40 w-full flex-shrink-0 overflow-hidden md:w-1/3">
      <NextImage
        width={320}
        height={400}
        field={fields?.image.jsonValue}
        className="absolute left-0 top-0 h-full w-full object-cover"
      />
    </div>,
    fields?.image.jsonValue
  );
};

const BodySection: React.FC<ResourceCardFieldsProps> = ({ fields, effectiveTheme }) => {
  const categoryData = getPageCategories(fields?.pageCategory);
  const category = categoryData?.[0]?.fields?.pageCategory;
  const formattedDate = fields?.datePublished?.formattedDateValue
    ? moment.utc(fields.datePublished.formattedDateValue, 'MM/DD/YYYY').format('MMMM DD,YYYY')
    : '';

  // Theme-based border color for category divider
  const categoryBorderClass =
    effectiveTheme === PRIMARY_THEME || effectiveTheme === TERTIARY_THEME
      ? 'border-black'
      : 'border-content';

  return (
    <div
      className={cn('flex flex-col gap-3', fields?.image.jsonValue ? 'w-full md:w-2/3' : 'w-full')}
    >
      <div className="flex items-center gap-2">
        <Text
          editable={false}
          field={category}
          tag="p"
          className={cn('heading-sm border-r-1 pr-2 uppercase', categoryBorderClass)}
        />
        <Text field={{ value: formattedDate }} tag="label" className="copy-sm" />
      </div>
      <Text field={fields?.heading} tag="h4" className="heading-lg line-clamp-3" />
      <Text field={fields?.subheading ?? fields?.body} tag="p" className="copy-sm line-clamp-4" />
    </div>
  );
};

type ResourceCardWrapperProps = {
  href: string;
  children: React.ReactNode;
  effectiveTheme: string;
};

type ResourceCardFieldsProps = {
  fields: ResourceDataType;
  effectiveTheme?: string;
};

type ResourceCardProps = ResourceCardFieldsProps;
