// Type definitions for Knowledge Center Resources API

export type TagItem = {
  id: string;
  name: string;
  displayName: string;
};

export type FileFieldValue = {
  src: string;
  name: string;
  displayName: string;
  title: string;
  keywords: string;
  description: string;
  extension: string;
  mimeType: string;
  size: string;
};

export type KnowledgeCenterResource = {
  itemId: string;
  language: string;
  tags: string; // Formatted like meta field: "year:2023,2024;topic:technology"
  file: {
    fileName: string;
    title: string;
    keywords: string;
    description: string;
    extension: string;
    size: string;
    url: string;
    lastUpdated: string;
  };
};

export type KnowledgeCenterResourcesResponse = {
  site: string;
  knowledgeCenterResources: KnowledgeCenterResource[];
  totalCount: number;
};

export type GraphQLKnowledgeCenterResource = {
  id: string;
  name: string;
  displayName: string;
  language: {
    name: string;
  };
  sxaTags: {
    targetItems: (TagItem & {
      title?: {
        value: string;
      };
    })[];
  };
  updatedDateTime: {
    value: string;
  };
  file: {
    jsonValue: FileFieldValue | { value: FileFieldValue };
  };
};

export type GraphQLKnowledgeCenterResponse = {
  item?: {
    id: string;
    name: string;
    displayName: string;
    children?: {
      pageInfo?: {
        endCursor?: string;
        hasNext?: boolean;
      };
      results?: GraphQLKnowledgeCenterResource[];
    };
  };
};
