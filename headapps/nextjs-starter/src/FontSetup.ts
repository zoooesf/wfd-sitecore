//  CUSTOMIZATION (Whole file) - Font customization and support for PPMORI font
import localFont from 'next/font/local';

export const ppmori = localFont({
  src: [
    {
      path: '../public/fonts/ppmori/ppmori-extralight-webfont.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/ppmori/ppmori-regular-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ppmori/ppmori-semibold-webfont.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-ppmori',
});
