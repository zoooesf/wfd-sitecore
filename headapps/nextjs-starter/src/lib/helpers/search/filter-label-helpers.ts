export const buildRangeLabel = (min: number | undefined, max: number | undefined): string => {
  return typeof min === 'undefined'
    ? `< $${max}`
    : typeof max === 'undefined'
      ? ` > $${min}`
      : `$${min} - $${max}`;
};

export const buildFacetLabel = (selectedFacet: Record<string, unknown>): string => {
  if ('min' in selectedFacet || 'max' in selectedFacet) {
    return buildRangeLabel(selectedFacet.min as number, selectedFacet.max as number);
  }
  return selectedFacet.valueLabel as string;
};
