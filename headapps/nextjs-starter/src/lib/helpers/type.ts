import { QueryField } from 'lib/types/fields';

/**
 * Type guard to check if a field is a QueryField
 * @param field - The field to check
 * @returns True if the field is a QueryField
 */
export function isQueryField(field: unknown): field is QueryField {
  return field !== null && typeof field === 'object' && 'jsonValue' in field;
}
