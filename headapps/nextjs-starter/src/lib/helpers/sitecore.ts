import { ComponentParams } from '@sitecore-content-sdk/nextjs';

export const placeholderGenerator = (params: ComponentParams, placeholderName: string) =>
  `${placeholderName}-${params.DynamicPlaceholderId}`;
