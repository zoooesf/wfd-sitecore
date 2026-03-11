import React from 'react';
import moment from 'moment';
import { CustomField, DateGQLType, ItemUrl } from 'lib/types';
import { Field, Link, LinkField, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers/classname';
import { PRIMARY_THEME, TERTIARY_THEME } from 'lib/const';

export const TextCard: React.FC<TextCardProps> = ({ fields }) => {
  const { page } = useSitecore();
  const { effectiveTheme } = useFrame();
  const isEditing = page?.mode.isEditing;

  // Dynamic border color based on theme: black for primary/tertiary, content color for secondary
  const borderColorClass =
    effectiveTheme === PRIMARY_THEME || effectiveTheme === TERTIARY_THEME
      ? 'border-black'
      : 'border-content';
  const hoverBorderColorClass =
    effectiveTheme === PRIMARY_THEME || effectiveTheme === TERTIARY_THEME
      ? 'hover:border-black/70'
      : 'hover:border-content/50';

  const cardClasses = cn(
    'reverse no-link-style group flex h-full w-full flex-col gap-4 overflow-hidden border bg-surface px-6 py-10 text-content transition-all duration-300 hover:border-content/50 hover:bg-content/5',
    borderColorClass,
    hoverBorderColorClass
  );

  const cardContent = (
    <>
      <CardEyebrow fields={fields} />
      <Text field={fields?.heading} tag="h4" className="heading-2xl line-clamp-3" />
    </>
  );

  const cardLink: LinkField = React.useMemo(
    () => ({
      value: {
        href: fields?.url?.path ?? '',
        text: fields?.heading?.value ?? '',
        target: '_self',
        linktype: 'internal',
        title: fields?.heading?.value ?? '',
      },
    }),
    [fields?.url?.path, fields?.heading?.value]
  );

  return (
    <div data-component="TextCard">
      {isEditing ? (
        <div className={cardClasses}>{cardContent}</div>
      ) : (
        <Link field={cardLink} className={cardClasses}>
          {cardContent}
        </Link>
      )}
    </div>
  );
};

// Used in LatestArticleGrid - Vertical List
export const TextRow: React.FC<TextCardProps> = ({ fields }) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  const cardClasses =
    'h-full flex flex-col gap-4 w-full group text-content transition-all duration-300 no-link-style';

  const cardContent = (
    <>
      <CardEyebrow fields={fields} />
      <Text
        field={fields?.heading}
        tag="h4"
        className="heading-2xl line-clamp-3 underline decoration-transparent transition-all duration-300 group-hover:decoration-content"
      />
    </>
  );

  const cardLink: LinkField = React.useMemo(
    () => ({
      value: {
        href: fields?.url?.path ?? '',
        text: fields?.heading?.value ?? '',
        target: '_self',
        linktype: 'internal',
        title: fields?.heading?.value ?? '',
      },
    }),
    [fields?.url?.path, fields?.heading?.value]
  );

  return (
    <div data-component="TextCard">
      {isEditing ? (
        <div className={cardClasses}>{cardContent}</div>
      ) : (
        <Link field={cardLink} className={cardClasses}>
          {cardContent}
        </Link>
      )}
    </div>
  );
};

const CardEyebrow: React.FC<TextCardFieldProps> = ({ fields }) => {
  const formattedDate = React.useMemo(() => {
    const date = fields?.datePublished?.formattedDateValue;
    return date
      ? moment.utc(date, 'MM/DD/YYYY').isValid()
        ? moment.utc(date, 'MM/DD/YYYY').format('MM/DD/YYYY')
        : ''
      : '';
  }, [fields?.datePublished?.formattedDateValue]);

  return (
    <div className="flex flex-row items-center gap-4">
      {fields?.category && (
        <>
          <Text
            editable={false}
            field={fields.category}
            tag="p"
            className="copy-sm font-bold uppercase"
          />{' '}
          <p className="copy-sm">|</p>
        </>
      )}
      {formattedDate && <p className="copy-sm">{formattedDate}</p>}
    </div>
  );
};

type TextCardFields = {
  heading?: CustomField;
  url: ItemUrl;
  category?: Field<string>;
  datePublished?: DateGQLType;
};

type TextCardFieldProps = {
  fields: TextCardFields;
};

type TextCardProps = {
  imageCard?: boolean;
} & TextCardFieldProps;
