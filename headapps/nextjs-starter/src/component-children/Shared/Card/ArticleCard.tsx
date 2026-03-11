import { Text, useSitecore, RichText } from '@sitecore-content-sdk/nextjs';
import { ArticleDataType } from 'lib/types';
import moment from 'moment';
import Link from 'next/link';
import { getPageCategories } from 'lib/helpers/page-category';
import { formatNewsDisplayDateTime } from 'lib/helpers/time-date-helper';
import { ARTICLE_VARIANTS, ArticleVariant } from 'lib/helpers/article-variants';
import { cn } from 'lib/helpers';
import { useFrame } from 'lib/hooks/useFrame';
import { IconFas } from '../Icon/Icon';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { SECONDARY_THEME } from 'lib/const';

export const ArticleCard: React.FC<ArticleCardProps> = ({ fields, variant }) => {
  return (
    <Wrapper href={fields?.url?.path ?? ''}>
      <BodySection fields={fields} variant={variant} />
    </Wrapper>
  );
};

const Wrapper: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  const cardClasses =
    'rounded-lg relative overflow-hidden flex flex-col h-full w-full group cursor-pointer border border-content/20 no-link-style';

  if (isEditing) {
    return (
      <div className={cardClasses} data-component="ArticleCard">
        {children}
      </div>
    );
  }

  return (
    <Link href={href} className={cardClasses} data-component="ArticleCard">
      {children}
    </Link>
  );
};

const BodySection: React.FC<ArticleCardProps> = ({ fields, variant }) => {
  const bodyClasses = 'w-full p-4 flex flex-col gap-3';
  const { effectiveTheme } = useFrame();
  const textTheme = effectiveTheme === SECONDARY_THEME ? 'text-tertiary' : 'text-secondary';

  const categoryData = getPageCategories(fields?.pageCategory);
  const firstCategory = categoryData?.[0]?.fields?.pageCategory?.value;

  let contentType = 'Article';
  if (variant === ARTICLE_VARIANTS.NEWS) {
    contentType = 'News';
  } else if (variant === ARTICLE_VARIANTS.INSIGHTS) {
    contentType = 'Insights';
  }

  let formattedDate = '';
  let dateTimeValue = '';

  if (variant === ARTICLE_VARIANTS.NEWS && fields?.displayDateTime) {
    const { formattedDate: newsDate } = formatNewsDisplayDateTime(
      fields.displayDateTime,
      fields?.datePublished
    );
    formattedDate = newsDate;
    dateTimeValue = fields?.datePublished?.formattedDateValue || '';
  } else {
    formattedDate = fields?.datePublished?.formattedDateValue
      ? moment.utc(fields.datePublished.formattedDateValue, DATE_FORMAT).format(DATE_FORMAT)
      : '';
    dateTimeValue = fields?.datePublished?.formattedDateValue || '';
  }

  // Extract profile display names
  const profileNames =
    fields &&
    fields.profiles &&
    typeof fields.profiles === 'object' &&
    'targetItems' in fields.profiles
      ? (
          fields.profiles.targetItems as Array<{
            id: string;
            name: string;
            displayName?: string;
          }>
        )
          .map((profile) => profile.displayName || profile.name)
          .filter(Boolean)
      : [];

  const people = profileNames.length > 0 ? profileNames.join(', ') : '';

  return (
    <div className={bodyClasses}>
      <div className="copy-xs mb-2 flex flex-row items-center gap-2">
        {contentType && <span className={cn('copy-sm', textTheme)}>{contentType}</span>}
        {firstCategory && (
          <>
            {contentType && <span className={textTheme}>|</span>}
            <span className={cn('copy-sm', textTheme)}>{firstCategory}</span>
          </>
        )}
      </div>

      <Text
        field={fields?.heading?.jsonValue}
        tag="h4"
        className="heading-lg mb-3 line-clamp-3 block font-semibold group-hover:underline"
      />

      <RichText field={fields?.subheading?.jsonValue} className="richtext mb-3 line-clamp-3" />

      {people && variant !== ARTICLE_VARIANTS.NEWS && (
        <div className={cn('copy-xs mb-2 flex items-center gap-2', textTheme)}>
          <IconFas icon={'user' as IconName} className="w-4 min-w-4" color={effectiveTheme} />
          <span>{people}</span>
        </div>
      )}

      {formattedDate && (
        <div className={cn('copy-xs flex items-center gap-2', textTheme)}>
          <IconFas icon={'calendar' as IconName} className="w-4 min-w-4" color={effectiveTheme} />
          <time dateTime={dateTimeValue}>{formattedDate}</time>
        </div>
      )}
    </div>
  );
};

const DATE_FORMAT = 'MM/DD/YYYY';

type ArticleCardFieldsProps = {
  fields: ArticleDataType;
};

type ArticleCardProps = ArticleCardFieldsProps & {
  variant?: ArticleVariant;
};
