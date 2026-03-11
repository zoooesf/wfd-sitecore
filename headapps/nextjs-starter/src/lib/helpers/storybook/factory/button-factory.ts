export const buttonFactory = (count = 2) => {
  const buttons = Array(count)
    .fill(null)
    .map((_, index) => ({
      componentName: 'Button',
      dataSource: `/sitecore/cta-${index + 1}`,
      fields: {
        link: {
          value: {
            href: '#',
            text: `CTA Button ${index + 1}`,
          },
        },
        variant: {
          value: index === 0 ? 'primary' : 'link',
        },
        theme: {
          value: 'primary',
        },
      },
    }));
  return buttons;
};
