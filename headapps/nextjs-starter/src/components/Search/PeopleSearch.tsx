import { useState, useEffect } from 'react';
import { WidgetsProvider } from '@sitecore-search/react';
import { useRouter } from 'next/router';
import { GlobalSearchProps } from 'lib/types/components/Search/global-search';
import Frame from 'component-children/Shared/Frame/Frame';
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { SEARCH_CONFIG } from 'lib/const/search-const';
import PeopleSearchComponentWidget from 'src/widgets/SearchResults/PeopleSearch';
import { NoWidgetIdError } from './NoWidgetIdError';

const PeopleSearchListingDefault: React.FC<GlobalSearchProps> = (props) => {
  const fields = props;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Check if router is ready and extract searchQuery from URL
    if (router.isReady) {
      const queryParam = router.query.searchQuery as string;
      if (queryParam) {
        setSearchQuery(queryParam);
      }
    }
  }, [router.isReady, router.query.searchQuery]);

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
        <PeopleSearchComponentWidget
          rfkId={rfkId}
          defaultKeyphrase={searchQuery}
          globalSearchFields={fields}
        />
      </WidgetsProvider>
    </Frame>
  );
};

export const Default = withDatasourceCheck()<GlobalSearchProps>(PeopleSearchListingDefault);
