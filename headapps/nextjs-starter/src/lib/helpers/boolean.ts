/**
 * Checks if a string value is set to 'true' (case-insensitive)
 * @param value - The string value to check
 * @returns Boolean indicating if the value is 'true'
 */
export const isTrueSet = (value?: string) => value?.toLowerCase?.() === 'true';

/**
 * Checks if a string value matches a specified true value
 * @param trueValue - The string value to consider as true
 * @param value - The string value to check
 * @returns Boolean indicating if the value matches the trueValue
 */
export const isTrueSetCustom = (trueValue: string, value?: string) => value === trueValue;
