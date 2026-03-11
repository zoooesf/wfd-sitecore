import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
  Image,
  ImageField,
  LinkField,
  Placeholder,
  RichText,
  Text,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { placeholderGenerator } from 'lib/helpers';
import Button from 'component-children/Shared/Button/Button';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import Link from 'next/link';
import { cn } from 'lib/helpers/classname';
import { useTranslation } from 'lib/hooks/useTranslation';
import { FrameProvider } from 'lib/hooks/useFrame';
import { getGraphQlClient } from 'lib/graphql-client';
import { GetItemById } from 'graphql/generated/graphql-documents';

const FooterMainDefault: React.FC<FooterMainProps> = ({ rendering, params, fields }) => {
  const { t } = useTranslation();

  // Get datasource name for data-source-name attribute (use fetched item name, fallback to GUID)
  const datasourceName =
    (rendering as ComponentRendering & { itemName?: string }).itemName ||
    rendering.dataSource ||
    rendering.uid;

  // Check if Demo field is checked to hide component
  const isDemoHidden = fields?.demo?.value === '1' || fields?.demo?.value === true;

  return (
    <FrameProvider params={{ Styles: 'theme:secondary' }}>
      <div
        data-component="FooterMain"
        data-source-name={datasourceName}
        className={cn(
          'secondary w-full bg-surface px-8 text-content',
          'lg:px-16',
          isDemoHidden && 'hidden'
        )}
      >
        <div className="m-auto flex w-full max-w-outer-content flex-col items-center justify-between gap-6 lg:flex-row lg:items-stretch lg:gap-0">
          <div className="flex w-full flex-col items-center justify-center gap-10 py-8 md:w-1/4 lg:my-auto lg:items-start lg:justify-start">
            <ScrollUpButton mobile />
            <Link href="/" aria-label={t('Home')} className="block p-1" data-id="footerLogo">
              <Image className="h-5 w-auto invert lg:h-8" field={fields?.logo} />
            </Link>
          </div>
          <Line />
          <NewsletterColumn fields={fields} />
          <Line />
          <LinkColumn params={params} rendering={rendering} />
        </div>
      </div>
    </FrameProvider>
  );
};

const NewsletterColumn: React.FC<{ fields: FooterMainFields }> = ({ fields }) => {
  return (
    <div className="flex w-full shrink-0 basis-1/2 flex-col items-center justify-start gap-8 self-start px-0 lg:px-10">
      <div className="rounded-b-md bg-tertiary px-6 py-3">
        <IconFas icon="phone" variant="default" />
      </div>
      <div className="flex w-full flex-col items-center justify-start gap-6">
        <Text field={fields?.newsletterHeading} tag="h3" className="heading-base text-center" />
        <RichText field={fields?.newsletterBody} className="richtext text-center" />
        <Button link={fields?.newsletterLink} variant="button" color="tertiary" className="mb-8" />
      </div>
    </div>
  );
};

const LinkColumn: React.FC<ComponentProps> = ({ params, rendering }) => {
  return (
    <div className="link-column flex w-full flex-col items-start gap-4 pb-10 pt-6 md:w-1/4 lg:ml-8 lg:pb-10">
      <ScrollUpButton />
      <Placeholder name={placeholderGenerator(params, 'footermenu')} rendering={rendering} />
    </div>
  );
};

const Line = () => {
  return (
    <div className="h-0.5 w-1/2 flex-shrink-0 bg-content/25 lg:mb-10 lg:mt-20 lg:h-auto lg:w-0.5"></div>
  );
};

const ScrollUpButton: React.FC<{ mobile?: boolean }> = ({ mobile }) => {
  const { t } = useTranslation();
  const className = cn('items-center gap-2 self-center', {
    'lg:hidden': mobile,
    'hidden lg:flex': !mobile,
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button onClick={scrollToTop} variant="button" color="tertiary" className={className}>
      {t('Top')} <IconFas icon="chevron-up" variant="default" />
    </Button>
  );
};

type FooterMainFields = {
  newsletterHeading: Field<string>;
  newsletterBody: Field<string>;
  newsletterLink: LinkField;
  logo: ImageField;
  demo?: Field<string | boolean>;
};

type FooterMainProps = ComponentProps & {
  fields: FooterMainFields;
};

export const getComponentServerProps: GetComponentServerProps = async (rendering) => {
  const graphQLClient = getGraphQlClient();

  // Fetch item name for data-source-name attribute
  let itemName = null;
  if (rendering.dataSource) {
    try {
      const itemData = await graphQLClient.request(GetItemById.loc?.source.body || '', {
        itemId: rendering.dataSource,
        language: 'en',
      });
      itemName = (itemData as { item?: { name?: string } })?.item?.name || null;
    } catch (error) {
      console.error('Error fetching item name for footer:', rendering.dataSource, error);
    }
  }

  return {
    rendering: {
      ...rendering,
      itemName, // Add the item name to the rendering object
    },
  };
};

export const Default = withDatasourceCheck()<FooterMainProps>(FooterMainDefault);
