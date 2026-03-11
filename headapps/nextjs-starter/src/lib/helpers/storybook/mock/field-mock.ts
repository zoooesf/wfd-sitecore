import { ImageGQLType, LinkGQLType } from 'lib/types';
import { FTImageFieldArgsType } from 'lib/helpers/storybook';
import { ComponentParams, LinkField, PlaceholdersData } from '@sitecore-content-sdk/nextjs';

// without this, storybook complains that a component does not have a datasource and will show an error component.
export const withDatasourceCheckComponentArgs = {
  rendering: {
    componentName: 'Rendering',
    dataSource: '/sitecore',
  },
};

export const paramsArgs = (id: string, variant = 'Default', styles?: string) => {
  return {
    GridParameters: 'col-12',
    CacheClearingBehavior: 'Clear on publish',
    DynamicPlaceholderId: id,
    FieldNames: variant,
    Styles: styles ?? 'padding:bottom-lg padding:top-lg',
    styles: 'col-12 ',
  };
};

export const linkGQLArgs = (
  text = 'Read more',
  href = 'https://www.google.com/',
  url = '/FISHTANK/WWW/Home',
  target = '_target'
): LinkGQLType => {
  return { jsonValue: linkFieldArgs(href, text, target, url) };
};

export const linkFieldArgs = (
  href = 'https://www.google.com/',
  text = 'Read more',
  target = '_target',
  url = '/FISHTANK/WWW/Home'
): LinkField => {
  return {
    value: {
      class: '',
      id: crypto.randomUUID(),
      querystring: '',
      anchor: '',
      target,
      title: '',
      linktype: 'internal',
      text,
      url,
      href,
    },
  };
};

export const linkFieldArgsEmpty = {
  value: {
    href: '',
    text: '',
  },
};

export const imageGQLFieldArgs = (width = 320, height = 320): ImageGQLType => {
  return {
    src: `/tile-1.jpg`,
    alt: '',
    jsonValue: {
      value: {
        src: `/tile-1.jpg`,
        alt: '',
        width: `${width}`,
        height: `${height}`,
      },
    },
  };
};

export const imageFieldArgs = (width = 320, height = 320, id = 2): FTImageFieldArgsType => {
  return {
    value: {
      src: `/tile-1.jpg`,
      alt: `Mock Image Alt Id ${id}`,
      jsonValue: {
        value: {
          src: `/tile-1.jpg`,
          alt: `Mock Image Alt Id ${id}`,
          width: `${width}`,
          height: `${height}`,
        },
      },
    },
  };
};

export const backgroundFieldArgs = (color = 'white'): FTImageFieldArgsType => {
  return {
    value: {
      src: color === 'white' ? '/bg/wave-pattern-white.png' : '/bg/wave-pattern-black.jpg',
      alt: 'Mock Image Alt',
    },
  };
};

export const tileImageFieldArgs = (number = '1'): FTImageFieldArgsType => {
  return {
    value: {
      src: `/tile-${number}.jpg`,
      alt: 'Mock Image Alt',
    },
  };
};

export const stringFieldArgs = (text: string) => {
  return {
    value: text,
  };
};

export const jsonValueFieldArgs = (text: string) => {
  return {
    value: text,
    jsonValue: {
      value: text,
    },
  };
};

export const nameArgs = (name: string) => {
  return {
    name,
  };
};

export const createMockComponent = <T extends Record<string, unknown>>(
  componentName: string,
  fields: T,
  placeholders?: PlaceholdersData<string>,
  params?: ComponentParams
) => {
  return {
    uid: crypto.randomUUID(),
    componentName,
    dataSource: '/sitecore',
    fields,
    ...(placeholders && { placeholders }),
    params: params ?? paramsArgs(crypto.randomUUID()),
  };
};
