import { imageFieldArgs, stringFieldArgs, linkFieldArgs } from '../mock';

const SPONSORS = [
  {
    id: 'sponsor-1',
    url: '/Settings/Component-Settings/Sponsors/Fishtank-Consulting',
    name: 'Fishtank Consulting',
    displayName: 'Fishtank Consulting',
    fields: {
      contentName: stringFieldArgs('Fishtank Consulting'),
      logo: imageFieldArgs(240, 120),
      link: linkFieldArgs('https://getfishtank.com', 'Fishtank Consulting', '_blank'),
    },
  },
  {
    id: 'sponsor-2',
    url: '/Settings/Component-Settings/Sponsors/Sitecore',
    name: 'Sitecore',
    displayName: 'Sitecore',
    fields: {
      contentName: stringFieldArgs('Sitecore'),
      logo: imageFieldArgs(240, 120),
      link: linkFieldArgs('https://sitecore.com', 'Sitecore', '_blank'),
    },
  },
  {
    id: 'sponsor-3',
    url: '/Settings/Component-Settings/Sponsors/Microsoft',
    name: 'Microsoft',
    displayName: 'Microsoft',
    fields: {
      contentName: stringFieldArgs('Microsoft'),
      logo: imageFieldArgs(240, 120),
      link: linkFieldArgs('https://microsoft.com', 'Microsoft', '_blank'),
    },
  },
  {
    id: 'sponsor-4',
    url: '/Settings/Component-Settings/Sponsors/Tech-Solutions',
    name: 'Tech Solutions',
    displayName: 'Tech Solutions',
    fields: {
      contentName: stringFieldArgs('Tech Solutions'),
      logo: imageFieldArgs(240, 120),
      link: linkFieldArgs('https://example.com', 'Tech Solutions', '_blank'),
    },
  },
  {
    id: 'sponsor-5',
    url: '/Settings/Component-Settings/Sponsors/Innovation-Labs',
    name: 'Innovation Labs',
    displayName: 'Innovation Labs',
    fields: {
      contentName: stringFieldArgs('Innovation Labs'),
      logo: imageFieldArgs(240, 120),
      link: linkFieldArgs('https://example.org', 'Innovation Labs', '_blank'),
    },
  },
];

export const sponsorFactory = (count = 3) => {
  return Array.from({ length: count }, (_, index) => SPONSORS[index % SPONSORS.length]);
};
