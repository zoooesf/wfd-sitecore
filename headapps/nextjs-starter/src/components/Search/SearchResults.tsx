import { useState, useEffect } from 'react';
import { WidgetsProvider } from '@sitecore-search/react';
import { useRouter } from 'next/router';
import GlobalSearchComponentWidget from '../../widgets/SearchResults/GlobalSearch';
import { GlobalSearchProps } from 'lib/types/components/Search/global-search';
import Frame from 'component-children/Shared/Frame/Frame';
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { SEARCH_CONFIG } from 'lib/const/search-const';
import { extractHashParams } from 'lib/helpers';
import { NoWidgetIdError } from './NoWidgetIdError';

const GlobalSearchlistingDefault: React.FC<GlobalSearchProps> = (props) => {
  const fields = props;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Check if router is ready and extract searchQuery from URL
    if (router.isReady) {
      // Extract search parameters from URL hash for state initialization
      const queryParam = extractHashParams(router);
      if (queryParam?.searchQuery) {
        setSearchQuery(queryParam.searchQuery);
      }
    }
  }, [router.isReady, router.asPath, router]);

  if (!router.isReady) {
    return null;
  }

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
        <GlobalSearchComponentWidget
          rfkId={rfkId}
          defaultKeyphrase={searchQuery}
          globalSearchFields={fields}
        />
      </WidgetsProvider>
    </Frame>
  );
};

export const Default = withDatasourceCheck()<GlobalSearchProps>(GlobalSearchlistingDefault);
