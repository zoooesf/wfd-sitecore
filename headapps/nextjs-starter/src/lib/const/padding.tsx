const PADDING_LIST: {
  [key: string]: {
    top: string;
    bottom: string;
  };
} = {
  XS: {
    top: 'pt-xs',
    bottom: 'pb-xs',
  },
  Small: {
    top: 'pt-sm',
    bottom: 'pb-sm',
  },
  Medium: {
    top: 'pt-md',
    bottom: 'pb-md',
  },
  Large: {
    top: 'pt-lg',
    bottom: 'pb-lg',
  },
  XL: {
    top: 'pt-xl',
    bottom: 'pb-xl',
  },
};

const PADDING_LIST_DESKTOP: {
  [key: string]: {
    top: string;
    bottom: string;
  };
} = {
  XS: {
    top: 'lg:pt-xs',
    bottom: 'lg:pb-xs',
  },
  Small: {
    top: 'lg:pt-sm',
    bottom: 'lg:pb-sm',
  },
  Medium: {
    top: 'lg:pt-md',
    bottom: 'lg:pb-md',
  },
  Large: {
    top: 'lg:pt-lg',
    bottom: 'lg:pb-lg',
  },
  XL: {
    top: 'lg:pt-xl',
    bottom: 'lg:pb-xl',
  },
};

export { PADDING_LIST, PADDING_LIST_DESKTOP };
