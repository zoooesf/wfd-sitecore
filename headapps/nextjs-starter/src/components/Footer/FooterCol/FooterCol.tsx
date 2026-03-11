import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
  Text,
  useSitecore,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { LinkGQLType } from 'lib/types';
import { Button } from 'component-children/Shared/Button/Button';
import { useAccordion } from 'lib/hooks/useAccordion';
import ButtonIcon from 'component-children/Shared/Button/ButtonIcon';
import { AccordionMotion } from 'component-children/Shared/Animation/AccordionMotion';
import { getGraphQlClient } from 'lib/graphql-client';
import { GetFooterColumnLinks } from 'graphql/generated/graphql-documents';
import { FOOTER_LINK_TEMPLATE_ID } from 'lib/graphql/id';
import { cn, getLayoutLanguage } from 'lib/helpers';
import { useTranslation } from 'lib/hooks/useTranslation';

const FooterColDefault: React.FC<FooterColProps> = (props) => {
  const { noContext } = useAccordion();
  const { t } = useTranslation();
  if (noContext) return <StaticView {...props} />;

  return (
    <div
      data-component="FooterCol"
      className="flex w-full flex-col items-start"
      role="navigation"
      aria-label={t('Footer Column')}
    >
      <MobileView {...props} />
      <DesktopView {...props} />
    </div>
  );
};

const StaticView: React.FC<FooterColProps> = ({ fields, rendering }) => (
  <div className="flex w-full flex-col items-start">
    <Text tag="h3" className="heading-sm text-content" field={fields?.heading} />
    <PageList rendering={rendering} />
  </div>
);

const MobileView: React.FC<FooterColProps> = ({ fields, rendering }) => {
  const accordionId = rendering.uid ?? '';
  const { toggleAccordion, isOpen } = useAccordion();
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  const isAccordionOpen = isEditing || isOpen(accordionId);
  const { t } = useTranslation();

  return (
    <div className={cn('w-full', 'lg:hidden')}>
      <button
        className="flex w-full cursor-pointer items-center justify-between gap-6"
        onClick={() => toggleAccordion(accordionId)}
        aria-expanded={isAccordionOpen}
        aria-controls={`footer-col-content-${accordionId}`}
      >
        <Text tag="h3" field={fields?.heading} className="heading-base text-start text-content" />
        <ButtonIcon
          unsetDefaultSize
          icon={isAccordionOpen ? 'chevron-up' : 'chevron-down'}
          label={isAccordionOpen ? t('Close') : t('Open')}
          iconPrefix="fas"
          className="w-4"
          withBackground={false}
          variant="white"
        />
      </button>
      <AccordionMotion isOpen={isAccordionOpen}>
        <PageList rendering={rendering} />
      </AccordionMotion>
    </div>
  );
};

const DesktopView: React.FC<FooterColProps> = ({ fields, rendering }) => {
  return (
    <div className={cn('hidden w-full flex-col items-start', 'lg:flex')}>
      <Text tag="h3" className="heading-sm text-content" field={fields?.heading} />
      <PageList rendering={rendering} />
    </div>
  );
};

const PageList: React.FC<FooterColRenderingType> = ({ rendering }) => {
  const linkListData = rendering?.data?.item?.links?.results;
  const { t } = useTranslation();

  if (!linkListData?.length) return null;

  return (
    <nav
      data-component="PageList"
      className={cn('grid w-full grid-cols-1 gap-3 pt-6', 'lg:pt-4')}
      aria-label={t('Footer Navigation')}
    >
      {linkListData.map((pagelink, idx) => (
        <PageItem
          key={`${pagelink.link.jsonValue.value.href}-${idx}`}
          {...pagelink}
          isFirst={idx === 0}
        />
      ))}
    </nav>
  );
};

const PageItem: React.FC<PageLinkType> = ({ link }) => {
  if (!link?.jsonValue?.value?.href) return <></>;

  return (
    <div data-component="PageItem" className="flex">
      <Button link={link?.jsonValue} variant="link" className="no-underline" />
    </div>
  );
};

type FooterColFields = {
  heading: Field<string>;
};

type FooterColRenderingType = {
  rendering: ComponentRendering & {
    data?: {
      item?: {
        links?: {
          results?: PageLinkType[];
        };
      };
    };
  };
};

type FooterColProps = ComponentProps &
  FooterColRenderingType & {
    fields: FooterColFields;
  };

type PageLinkType = {
  link: LinkGQLType;
  isFirst?: boolean;
};

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const language = getLayoutLanguage(layoutData);
  const graphQLClient = getGraphQlClient();

  // Only make the GraphQL request if we have a datasource
  if (!rendering.dataSource) {
    return {
      rendering,
      route: layoutData?.sitecore?.route,
    };
  }

  try {
    const data = await graphQLClient.request(GetFooterColumnLinks.loc?.source.body || '', {
      datasourcePath: rendering.dataSource,
      language,
      templateId: FOOTER_LINK_TEMPLATE_ID,
    });
    return {
      rendering: { ...rendering, data },
      route: layoutData?.sitecore?.route,
    };
  } catch (error) {
    console.error('Error fetching footer column data:', error);
    return {
      rendering,
      route: layoutData?.sitecore?.route,
    };
  }
};

export const Default = withDatasourceCheck()<FooterColProps>(FooterColDefault);
