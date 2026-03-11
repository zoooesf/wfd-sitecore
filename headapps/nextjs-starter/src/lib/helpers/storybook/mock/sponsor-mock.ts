import { SponsorType } from 'lib/types';
import { stringFieldArgs, linkFieldArgs, imageFieldArgs } from './field-mock';

export const mockSponsor = {
  fields: {
    contentName: stringFieldArgs('Sponsor Company'),
    logo: imageFieldArgs(240, 120),
    link: linkFieldArgs('https://example.com', 'Sponsor Company', '_blank'),
  },
} as SponsorType;
