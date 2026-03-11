export type ListingQueryResultsType<T> = {
  item: {
    pages: {
      results: T[];
      total: number;
      pageInfo: {
        endCursor: string;
        hasNext: boolean;
      };
    };
  };
};

export type ListingSearchResultsType<T> = {
  search: {
    results: T[];
    total: number;
    pageInfo: {
      endCursor: string;
      hasNext: boolean;
    };
  };
};
