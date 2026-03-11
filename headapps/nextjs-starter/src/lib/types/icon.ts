export type IconSocialType =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'linkedin-in'
  | 'x-twitter'
  | 'envelope';

export type IconSolidType =
  | 'magnifying-glass'
  | 'bars'
  | 'xmark'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-up'
  | 'chevron-down'
  | 'arrow-left'
  | 'arrow-left-long'
  | 'arrow-right'
  | 'arrow-right-long'
  | 'filter'
  | 'angle-left'
  | 'angle-right'
  | 'circle-exclamation'
  | 'globe'
  | 'user'
  | 'download';
export type IconType = IconSocialType | IconSolidType;

export type IconFieldType = {
  name: IconType;
};
