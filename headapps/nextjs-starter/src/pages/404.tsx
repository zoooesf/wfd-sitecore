/*
 * When editing content in Sitecore Pages Builder for the _404 page,
 * a publish is needed in Sitecore to see the changes in the browser;
 * a front-end deployment is not needed for this page.
 * For more information, please refer to the Notion document:
 * "Error pages limitations and deployment behavior"
 */

// BEGIN CUSTOMIZATION - _XYZ convention error pages
import {
  SitecoreProvider,
  SitecorePageProps,
  Page,
  ComponentPropsContext,
} from '@sitecore-content-sdk/nextjs';
// END CUSTOMIZATION
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import { GetStaticProps } from 'next';
import scConfig from 'sitecore.config';
import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
// BEGIN CUSTOMIZATION - _XYZ convention error pages
import { JSX, useEffect } from 'react';
import { handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
// END CUSTOMIZATION

const Custom404 = (props: SitecorePageProps): JSX.Element => {
  // BEGIN CUSTOMIZATION - _XYZ convention error pages. Same as in [[...path]].tsx.
  useEffect(() => {
    // Since Sitecore Editor does not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);
  // END CUSTOMIZATION

  if (!(props && props.page)) {
    return <NotFound />;
  }

  // BEGIN CUSTOMIZATION - _XYZ convention error pages. Wrapped in ComponentPropsContext.
  return (
    <ComponentPropsContext value={props.componentProps || {}}>
      <SitecoreProvider api={scConfig.api} componentMap={components} page={props.page}>
        <Layout page={props.page} />
      </SitecoreProvider>
    </ComponentPropsContext>
  );
  // END CUSTOMIZATION
};

export const getStaticProps: GetStaticProps = async (context) => {
  // BEGIN CUSTOMIZATION - _XYZ convention error pages
  let props = {};
  const path = '/_404';
  // END CUSTOMIZATION
  let page: Page | null = null;

  if (scConfig.generateStaticPaths) {
    try {
      // BEGIN CUSTOMIZATION - _XYZ convention error pages
      page = context.preview
        ? await client.getPreview(context.previewData)
        : await client.getPage(path, { locale: context.locale });

      if (page) {
        props = {
          page,
          dictionary: await client.getDictionary({
            site: page.siteName,
            locale: page.locale,
          }),
          componentProps: await client.getComponentData(page.layout, context, components),
        };

        return {
          props,
          revalidate: 5, // In seconds
          notFound: !page,
        };
      }
      // END CUSTOMIZATION
    } catch (error) {
      console.log('Error occurred while fetching error pages');
      console.log(error);
    }
  }

  return {
    props: {
      page,
    },
  };
};

export default Custom404;
