// CUSTOMIZATION (Whole file) - Custom locale enforcement middleware
import { Middleware } from '@sitecore-content-sdk/nextjs/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, mainLanguage } from 'lib/i18n/i18n-config';

const matcherSkipPaths = [
  `api/`,
  `_next/`,
  `feaas-render`,
  `healthz`,
  `sitecore/api/`,
  `-/`,
  `favicon.ico`,
  `sc_logo.svg`,
  `people/`, // Added to support person pages
  `en/people/`, // Added to support person pages
  `fr-ca/personnes/`, // Added to support person pages
];

/**
 * This is the locale enforcement middleware for Next.js.
 * It ensures users always have a locale in their URLs.
 *
 * The `EnforceLocaleMiddleware` will:
 *  1. Check if the current request is using the default locale
 *  2. Determine the user's preferred locale from the NEXT_LOCALE cookie or fall back to mainLanguage
 *  3. Redirect to the preferred locale path while preserving the pathname and search parameters
 *  4. Skip redirects for specific paths (API routes, Next.js internals, static files, etc.)
 */
export class EnforceLocaleMiddleware extends Middleware {
  handle = async (req: NextRequest, res?: NextResponse): Promise<NextResponse> => {
    if (req.nextUrl.locale === defaultLocale && this.shouldPerformDefaultRedirect(req)) {
      //NEXT_LOCALE is set automatically when localeDetection is true
      const locale = req.cookies.get('NEXT_LOCALE')?.value || mainLanguage;
      return NextResponse.redirect(
        new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
      );
    }

    return res || NextResponse.next();
  };

  private shouldPerformDefaultRedirect = (req: NextRequest) => {
    //disable for experience editor and pages
    if (process.env.DISABLE_DEFAULT_REDIRECT === 'true') {
      return false;
    }

    // Include the / in the path to keep middleware set as OOTB.
    if (
      matcherSkipPaths.map((p) => '/' + p).some((path) => req.nextUrl.pathname.startsWith(path))
    ) {
      return false;
    }

    //skip for public files
    const PUBLIC_FILE = /\.(.*)$/;
    if (PUBLIC_FILE.test(req.nextUrl.pathname)) {
      return false;
    }

    return true;
  };
}
