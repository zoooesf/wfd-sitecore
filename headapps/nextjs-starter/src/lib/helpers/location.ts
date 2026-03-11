import { JSONValueType } from 'lib/types';
import { LocationType } from '../types/fields';

export type LocationField = LocationType[] | JSONValueType<LocationType[]>;

export const getLocationData = (location?: LocationField): LocationType[] => {
  if (!location) return [];

  if ('jsonValue' in location) {
    return location.jsonValue || [];
  }

  return location;
};
