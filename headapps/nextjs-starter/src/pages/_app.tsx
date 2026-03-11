import { JSX } from 'react';
import type { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import Bootstrap from 'src/Bootstrap';
import { SitecorePageProps } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
// BEGIN CUSTOMIZATION - Using Tailwind CSS instead of Bootstrap
import 'assets/global.scss';
// END CUSTOMIZATION
// BEGIN CUSTOMIZATION - Using Fontawesome
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// END CUSTOMIZATION
// BEGIN CUSTOMIZATION - Using next-auth
import { isAuthEnabled } from 'lib/helpers/auth';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
// END CUSTOMIZATION
// BEGIN CUSTOMIZATION - Theming
import mainTheme from 'assets/themes/main.module.scss';
import nonprofitTheme from 'assets/themes/nonprofit.module.scss';
// END CUSTOMIZATION

// BEGIN CUSTOMIZATION - Using Fontawesome
config.autoAddCss = false;
library.add(fas, fab);
// END CUSTOMIZATION

// BEGIN CUSTOMIZATION - Customizing page props to include session
function App({
  Component,
  pageProps,
}: AppProps<SitecorePageProps & { session?: Session | null }>): JSX.Element {
  // END CUSTOMIZATION
  const { dictionary, ...rest } = pageProps;

  //BEGIN CUSTOMIZATION - Loading site based CSS modules
  const siteName = pageProps?.page?.siteName?.toLowerCase() || 'default';

  // Map site -> CSS module. Importing statically is SSR-safe and avoids dynamic CSS pitfalls.
  type ThemeModule = { readonly [key: string]: string };
  const themeMap: Record<string, ThemeModule> = {
    //add site name and theme module here
    main: mainTheme,
    nonprofit: nonprofitTheme,
  };

  const theme = themeMap[siteName] || null;
  // END CUSTOMIZATION

  // BEGIN CUSTOMIZATION - Adding SessionProvider wrapper from next-auth/react for Auth0 login functionality if auth is enabled. Adding theme classes.
  const content = (
    <div className={theme?.vars}>
      <Bootstrap {...pageProps} />
      {/*
        // Use the next-localization (w/ rosetta) library to provide our translation dictionary to the app.
        // Note Next.js does not (currently) provide anything for translation, only i18n routing.
        // If your app is not multilingual, next-localization and references to it can be removed.
      */}
      <I18nProvider
        lngDict={dictionary}
        locale={pageProps.page?.locale || scConfig.defaultLanguage}
      >
        <Component {...rest} />
      </I18nProvider>
    </div>
  );

  if (isAuthEnabled()) {
    return <SessionProvider session={pageProps.session}>{content}</SessionProvider>;
  }

  return content;
  // END CUSTOMIZATION
}

export default App;
