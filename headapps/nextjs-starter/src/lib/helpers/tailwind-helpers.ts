/**
 * Used for spacing config in tailwindcss
 * @param start - start index
 * @param end - end index
 * @returns an array of multiples of 4 + rem, used in tailwindcss
 */

export const generateEvenNumbers = (start: number, end: number) => {
  const spacingScale: { [key: string]: string } = {};
  for (let i = start; i <= end; i++) {
    spacingScale[i] = `${(i * 4) / 16}rem`; // Convert to rem
  }
  return spacingScale;
};

export const DEFAULT_SPACING_SCALE = {
  xs: '0.5rem', // 8px
  sm: '1rem', // 16px
  md: '2rem', // 32px
  lg: '4rem', // 64px
  xl: '8rem', // 128px
  ...generateEvenNumbers(1, 200), // Generate even numbers from 1 (4) to 100 (400)
};
