import React from 'react';
import { useSitecore, Field } from '@sitecore-content-sdk/nextjs';
import { PageDataType, QueryField } from 'lib/types';
import Link from 'next/link';
import { formatDate } from 'lib/helpers';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from 'next/router';
import { PageCategoryField } from 'lib/helpers/page-category';
import { mainLanguage } from 'lib/i18n/i18n-config';

export const RecipePageListingCard: React.FC<PageDataType> = (page) => {
  const router = useRouter();

  if (!page) return null;

  // Get page category if available
  const pageCategoryField = page.pageCategory as PageCategoryField;
  const categories = Array.isArray(pageCategoryField)
    ? pageCategoryField
    : pageCategoryField?.jsonValue || [];
  const pageCategory = categories[0]?.fields?.pageCategory?.value || 'Content';

  // Get title from heading
  const headingField = page?.heading as QueryField;
  const title = headingField?.jsonValue?.value || page.name || '';

  // Get subheading/description if available
  const subheadingField = page.subheading as QueryField;
  const subheading = subheadingField?.jsonValue?.value || '';

  // Get lastUpdated date
  const lastUpdatedField = page.lastUpdated as Field<string>;
  const formattedDate = lastUpdatedField?.value
    ? formatDate(lastUpdatedField.value, router.locale || mainLanguage)
    : null;

  return (
    <Wrapper href={page.url.path}>
      <div className="flex flex-col gap-3 p-4">
        <div className="copy-xs flex flex-row items-center gap-2">
          {pageCategory && <span className="text-content">{pageCategory}</span>}
        </div>
        {title && (
          <h4 className="heading-lg block font-semibold text-content group-hover:underline">
            {title}
          </h4>
        )}
        {subheading && (
          <div className="line-clamp-3">
            <span className="copy-sm text-content">{subheading}</span>
          </div>
        )}
        {formattedDate && (
          <div className="copy-xs flex items-center gap-2 text-content">
            <IconFas icon={'calendar' as IconName} className="h-4 w-4" color="text-content" />
            <time>{formattedDate}</time>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  const cardClasses = `group border border-content/20 w-full flex flex-col h-auto cursor-pointer no-underline`;

  if (isEditing) {
    return (
      <div data-component="RecipePageListingCard" className={cardClasses}>
        {children}
      </div>
    );
  }

  return (
    <Link data-component="RecipePageListingCard" href={href} className={cardClasses}>
      {children}
    </Link>
  );
};
