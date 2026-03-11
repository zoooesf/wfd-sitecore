import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
  Placeholder,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { placeholderGenerator, cn } from 'lib/helpers';
import { AccordionProvider } from 'lib/hooks/useAccordion';
import { FrameProvider } from 'lib/hooks/useFrame';
import { getGraphQlClient } from 'lib/graphql-client';
import { GetItemById } from 'graphql/generated/graphql-documents';

type FooterMenuProps = ComponentProps & {
  fields?: {
    demo?: Field<string | boolean>;
  };
};

const FooterMenuDefault: React.FC<FooterMenuProps> = ({ rendering, params, fields }) => {
  // Get datasource name for data-source-name attribute (use fetched item name, fallback to GUID)
  const datasourceName =
    (rendering as ComponentRendering & { itemName?: string }).itemName ||
    rendering.dataSource ||
    rendering.uid;

  // Check if Demo field is checked to hide component
  const isDemoHidden =
    fields?.demo?.value === '1' || fields?.demo?.value === true || fields?.demo?.value === 'true';

  return (
    <FrameProvider params={{ Styles: 'theme:secondary' }}>
      <div
        data-component="FooterMenu"
        data-source-name={datasourceName}
        className={cn(
          'secondary relative w-full bg-surface text-content',
          isDemoHidden && 'hidden'
        )}
      >
        <AccordionProvider>
          <div className="m-auto w-full max-w-outer-content border-t border-content/25 px-8 pb-10 pt-8 lg:px-16">
            <div className="grid gap-y-8 lg:grid-cols-4 lg:gap-5">
              <Placeholder
                name={placeholderGenerator(params, 'footermenu')}
                rendering={rendering}
              />
            </div>
          </div>
        </AccordionProvider>
      </div>
    </FrameProvider>
  );
};

export const getComponentServerProps: GetComponentServerProps = async (rendering) => {
  const graphQLClient = getGraphQlClient();

  // Fetch item name for data-source-name attribute
  let itemName = null;
  if (rendering.dataSource && GetItemById.loc?.source.body) {
    try {
      const itemData = await graphQLClient.request(GetItemById.loc.source.body, {
        itemId: rendering.dataSource,
        language: 'en',
      });
      itemName = (itemData as { item?: { name?: string } })?.item?.name || null;
    } catch (error) {
      console.error('Error fetching item name for footer menu:', rendering.dataSource, error);
    }
  }

  return {
    rendering: {
      ...rendering,
      itemName, // Add the item name to the rendering object
    },
  };
};

export const Default = withDatasourceCheck()<FooterMenuProps>(FooterMenuDefault);
