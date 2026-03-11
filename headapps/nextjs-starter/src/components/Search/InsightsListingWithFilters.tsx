import { WidgetsProvider } from '@sitecore-search/react';
import { useSitecore, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import SearchListingWithFiltersWidget from 'src/widgets/SearchResults/SearchListingWithFiltersResults';
import Frame from 'component-children/Shared/Frame/Frame';
import { SEARCH_CONFIG } from 'lib/const/search-const';
import { INSIGHTS_TEMPLATE_ID } from 'lib/graphql/id';
import { ARTICLE_VARIANTS } from 'lib/helpers/article-variants';
import { SearchListingWithFiltersProps } from 'lib/types/components/Search/search-listing-filters';
import { NoWidgetIdError } from './NoWidgetIdError';

const InsightsLisitngWithFiltersDefault: React.FC<SearchListingWithFiltersProps> = (props) => {
  const { page } = useSitecore();
  const itemId = page?.layout?.sitecore?.route?.itemId;
  const rfkId = props.fields?.widgetId?.value;

  if (!rfkId) {
    return <NoWidgetIdError params={props.params} />;
  }

  return (
    <Frame params={props.params}>
      <WidgetsProvider
        env={SEARCH_CONFIG.env}
        customerKey={SEARCH_CONFIG.customerKey}
        apiKey={SEARCH_CONFIG.apiKey}
        publicSuffix={false}
        debug={true}
      >
        <SearchListingWithFiltersWidget
          rfkId={rfkId}
          props={props}
          templateId={INSIGHTS_TEMPLATE_ID}
          variant={ARTICLE_VARIANTS.INSIGHTS}
          key={itemId}
        />
      </WidgetsProvider>
    </Frame>
  );
};

export const Default = withDatasourceCheck()<SearchListingWithFiltersProps>(
  InsightsLisitngWithFiltersDefault
);
