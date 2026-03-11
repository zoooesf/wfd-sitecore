import { ImageGQLType } from 'lib/types';

export enum LinkTypes {
  Internal = 'internal',
  External = 'external',
}

export enum SocialIcons {
  Instagram = 'instagram',
  LinkedIn = 'linkedin-in',
  Twitter = 'x-twitter',
  YouTube = 'youtube',
}

export type FTImageFieldArgsType = {
  value: ImageGQLType;
};
