/**
 * This Layout is needed for Starter Kit.
 */
import React, { JSX } from 'react';
import Head from 'next/head';
// BEGIN CUSTOMIZATION - Persona Access Control
import {
  Placeholder,
  Field,
  DesignLibrary,
  Page,
  Item,
  RouteData,
} from '@sitecore-content-sdk/nextjs';
// END CUSTOMIZATION
import Scripts from 'src/Scripts';
import SitecoreStyles from 'src/components/content-sdk/SitecoreStyles';
// BEGIN CUSTOMIZATION - Additional imports
import Metadata from 'component-children/Foundation/BasePage/Metadata';
import { ContextPageTagsProvider } from 'lib/contexts/page-tags-context';
import { useContentHeight } from 'lib/hooks/useContentHeight';
import { BypassBlock } from 'component-children/Navigation/Header/BypassBlock';
import { ppmori } from 'src/FontSetup';
import { PersonaProvider } from 'lib/contexts/persona-context';
import { PersonaAuthenticationCheck } from 'component-children/Persona';
import { usePersona } from 'lib/hooks/persona';
import { BlurryOverlay } from 'component-children/Shared/BlurryOverlay/BlurryOverlay';
// END CUSTOMIZATION

interface LayoutProps {
  page: Page;
}

// CUSTOMIZATION - No need for the RouteFields interface as we moved the title generation elsewhere

// BEGIN CUSTOMIZATION - Persona Access Control
const AllSiteContent: React.FC<{
  route: RouteData<Record<string, Field | Item | Item[]>> | null;
}> = ({ route }) => {
  const heightWithoutFooter = useContentHeight(route?.name);

  return (
    <>
      <header className="font-ppmori">
        <div id="header">{route && <Placeholder name="headless-header" rendering={route} />}</div>
      </header>
      <main className="font-ppmori">
        <div id="content" style={{ minHeight: heightWithoutFooter + 'px' }}>
          {route && <Placeholder name="headless-main" rendering={route} />}
        </div>
      </main>
      <footer className="font-ppmori">
        <div id="footer">{route && <Placeholder name="headless-footer" rendering={route} />}</div>
      </footer>
    </>
  );
};

/**
 * LayoutContent component that applies blur based on persona access state
 */
const LayoutContent: React.FC<{
  route: RouteData<Record<string, Field | Item | Item[]>> | null;
}> = ({ route }) => {
  const { hasAccessIssue } = usePersona();

  return (
    <PersonaAuthenticationCheck>
      {hasAccessIssue ? (
        <BlurryOverlay>
          <AllSiteContent route={route} />
        </BlurryOverlay>
      ) : (
        <AllSiteContent route={route} />
      )}
    </PersonaAuthenticationCheck>
  );
};
// END CUSTOMIZATION

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  // CUSTOMIZATION (this line) - Move the title generation elsewhere. No need for the fields variable.
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';
  // BEGIN CUSTOMIZATION - For Storybook support - Custom import path configured in tsconfig.json
  const importMapDynamic = () => import('dot-sitecore/import-map');
  // END CUSTOMIZATION

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <Head>
        {/* CUSTOMIZATION (this line)- Move the title generation to <Metadata> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* BEGIN CUSTOMIZATION - Add page metadata */}
      <Metadata route={route} />
      {/* END CUSTOMIZATION */}

      {/* BEGIN CUSTOMIZATION - Accessibility Bypass Block Staticaly placed before any other component. */}
      <BypassBlock />
      {/* END CUSTOMIZATION */}

      {/* root placeholder for the app, which we add components to using route data */}
      {/* CUSTOMIZATION (next line)- Custom fonts, etc. */}
      <div className={`${mainClassPageEditing} ${ppmori.variable} bg-surface`} role="presentation">
        {mode.isDesignLibrary ? (
          <DesignLibrary loadImportMap={importMapDynamic} />
        ) : (
          // BEGIN CUSTOMIZATION - Persona Access Control, tags, custom fonts, etc.
          <PersonaProvider>
            <ContextPageTagsProvider>
              <LayoutContent route={route} />
              <div id="modal-root" className="font-ppmori" />
            </ContextPageTagsProvider>
          </PersonaProvider>
          // END CUSTOMIZATION
        )}
      </div>
    </>
  );
};

export default Layout;
