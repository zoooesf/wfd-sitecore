import { useRef, useMemo, useState } from 'react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { ArticleDataType, ThemeType } from 'lib/types';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { ArticleListingProps } from 'lib/types/components/Articles/article-listing';
import { useContextPageTags } from 'lib/contexts/page-tags-context';
import { hasMatchingTags } from 'lib/helpers/merge-page-tags';
import { useTranslation } from 'lib/hooks/useTranslation';
import { getNoResultsMessageByVariant } from 'lib/helpers/listing/article-listing';
import ArticleListGrid from './ArticleListGrid';
import { ARTICLE_VARIANTS, ArticleVariant } from 'lib/helpers/article-variants';
import { useFrame } from 'lib/hooks/useFrame';
import { EditModeClickDisabler } from 'component-children/Shared/Containers/EditModeClickDisabler';

const ArticleListingRendering: React.FC<ArticleListingProps> = ({ fields, rendering, variant }) => {
  const { effectiveTheme } = useFrame();
  const searchRef = useRef<HTMLDivElement>(null);
  const { pageTags } = useContextPageTags();
  const { t } = useTranslation();

  const filterEnabled = useMemo(() => {
    const fields = rendering?.fields || {};
    const filterByTagsField =
      fields.filterByTags &&
      typeof fields.filterByTags === 'object' &&
      'value' in fields.filterByTags
        ? fields.filterByTags.value
        : undefined;

    return filterByTagsField;
  }, [rendering?.fields]);

  const [filteringFailed, setFilteringFailed] = useState(false);

  const results = useMemo(() => {
    const allResults = (rendering?.data || []) as ArticleDataType[];

    setFilteringFailed(false);

    if (!filterEnabled || !pageTags.length) {
      return allResults;
    }

    const filteredResults = allResults.filter((articleItem) => {
      if (!articleItem) return false;

      const articleTags = Array.isArray(articleItem?.sxaTags?.targetItems)
        ? articleItem.sxaTags.targetItems
        : [];

      return hasMatchingTags(pageTags, articleTags);
    });

    if (filteredResults.length === 0) {
      setFilteringFailed(true);
      return allResults;
    }

    return filteredResults;
  }, [rendering?.data, filterEnabled, pageTags]);

  if (!rendering?.data) {
    return <NoResults theme={effectiveTheme} heading={fields?.heading} variant={variant} />;
  }

  return (
    <ContainedWrapper theme={effectiveTheme}>
      <div
        data-component="ArticleListing"
        data-variant={variant || ARTICLE_VARIANTS.DEFAULT}
        ref={searchRef}
      >
        <Text tag="h2" field={fields?.heading} className="heading-lg mb-6" />
        {filterEnabled && pageTags.length > 0 && (
          <div className="mb-4 text-sm">
            {fields?.tagsHeading?.value ? (
              <Text field={fields.tagsHeading} tag="span" className="font-semibold" />
            ) : (
              <span className="font-semibold">{t('Filtering by tags:')}</span>
            )}{' '}
            {pageTags.map((tag) => tag.displayName || tag.name).join(', ')}
            {filteringFailed && (
              <div className="mt-2 text-amber-600">
                {fields?.noResultsText?.value ? (
                  <Text field={fields.noResultsText} />
                ) : (
                  <>{t(getNoResultsMessageByVariant(variant))}</>
                )}
              </div>
            )}
          </div>
        )}
        <EditModeClickDisabler>
          <ArticleListGrid
            results={results}
            searchRef={searchRef}
            variant={variant}
            itemsPerPage={fields?.PageSizeCount?.value}
          />
        </EditModeClickDisabler>
      </div>
    </ContainedWrapper>
  );
};

const NoResults: React.FC<NoResultsProps> = ({
  heading,
  theme,
  variant = ARTICLE_VARIANTS.DEFAULT,
}) => {
  const { t } = useTranslation();

  const dictionaryKey = getNoResultsMessageByVariant(variant);

  return (
    <ContainedWrapper theme={theme}>
      <div data-component="ArticleListing" className="py-8">
        <Text tag="h2" field={heading} className="heading-lg mb-6" />
        <p className="text-center text-gray-600">{t(dictionaryKey)}</p>
      </div>
    </ContainedWrapper>
  );
};

type NoResultsProps = {
  heading: Field<string>;
  theme: ThemeType;
  variant?: ArticleVariant;
};

export default ArticleListingRendering;
