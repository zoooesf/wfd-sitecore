export const mockLocation = (value: string) => {
  return [
    {
      id: crypto.randomUUID(),
      url: `/${value.toLowerCase()}`,
      name: value,
      displayName: value,
      fields: {
        contentName: { value: value },
      },
    },
  ];
};
