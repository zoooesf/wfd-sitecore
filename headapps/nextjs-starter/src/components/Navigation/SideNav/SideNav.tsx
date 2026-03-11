import { ComponentProps } from 'lib/component-props';
import {
  Field,
  Text,
  ComponentRendering,
  ComponentParams,
  GetComponentServerProps,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { AccordionProvider, useAccordion } from 'lib/hooks/useAccordion';
import Frame from 'component-children/Shared/Frame/Frame';
import { AccordionMotion } from 'component-children/Shared/Animation/AccordionMotion';
import { Button } from 'component-children/Shared/Button/Button';
import ButtonIcon from 'component-children/Shared/Button/ButtonIcon';
import { IconType, LinkGQLType } from 'lib/types';
import { getGraphQlClient } from 'lib/graphql-client';
import { GetSideNavigation } from 'graphql/generated/graphql-documents';
import { cn } from 'lib/helpers/classname';
import { getLayoutLanguage } from 'lib/helpers';
import { useTranslation } from 'lib/hooks/useTranslation';

const SideNavDefault: React.FC<SideNavProps> = (props) => {
  return (
    <Frame params={props.params}>
      <SideNavRendering {...props} />
    </Frame>
  );
};

const SideNavRendering: React.FC<SideNavProps> = ({ ...props }) => {
  const sidenavGroupId = `sidenav-group-${props.params?.id}`;

  const navigationGroups = props.rendering?.data?.item?.children?.results?.map(
    ({ heading, children }: SideNavGroupDataType) => ({
      heading: { value: heading.value },
      links: children.results.map(({ link }) => link),
    })
  );

  // No groups to display
  if (!navigationGroups?.length) return null;

  const themeClasses = cn(
    'ml-auto mt-10 w-full max-w-xs rounded-lg border border-primary bg-primary p-6'
  );

  return (
    <div data-component="SideNav" className={themeClasses}>
      <Text field={props.fields?.heading} tag="h2" className="heading-xl mb-6 text-content" />
      <AccordionProvider>
        <nav className="flex flex-col gap-2" data-accordion-group={sidenavGroupId}>
          {navigationGroups?.map((group, index) => (
            <SideNavDropdown
              key={index}
              fields={group}
              params={props.params}
              groupId={sidenavGroupId}
              index={index}
            />
          ))}
        </nav>
      </AccordionProvider>
    </div>
  );
};

const SideNavDropdown: React.FC<SideNavDropdownProps> = ({ fields, params, index }) => {
  const dropdownId = `sidenav-dropdown-${params?.id}-${index}`;
  const { toggleAccordion, isOpen } = useAccordion();
  const isDropdownOpen = isOpen(dropdownId);

  return (
    <div
      data-component="SideNavDropdown"
      className={cn(
        'w-full overflow-hidden border-neutral-200',
        'not-last-child:mb-2 not-last-child:border-b not-last-child:pb-6'
      )}
    >
      <DropdownButton
        isOpen={isDropdownOpen}
        toggleAccordion={() => toggleAccordion(dropdownId)}
        dropdownId={dropdownId}
        heading={fields?.heading}
      />
      <AccordionMotion isOpen={isDropdownOpen}>
        <DropdownLinks links={fields?.links} />
      </AccordionMotion>
    </div>
  );
};

const DropdownButton: React.FC<{
  isOpen: boolean;
  toggleAccordion: () => void;
  dropdownId: string;
  heading: Field<string>;
}> = ({ isOpen, toggleAccordion, dropdownId, heading }) => {
  const { t } = useTranslation();

  return (
    <button
      className={cn(
        'flex w-full items-center justify-between rounded-md p-3',
        'hover:bg-surface/10'
      )}
      onClick={toggleAccordion}
      aria-expanded={isOpen}
      data-dropdown-id={dropdownId}
    >
      <Text field={heading} tag="span" className="heading-base text-content" />
      <ButtonIcon
        icon={isOpen ? 'chevron-up' : 'chevron-down'}
        label={isOpen ? t('Close') : t('Open')}
        iconPrefix="fas"
        className="text-content"
        withBackground={false}
      />
    </button>
  );
};

const DropdownLinks: React.FC<{ links: LinkGQLType[] }> = ({ links }) => (
  <div className="flex flex-col gap-2 pl-4 pt-2">
    {links?.map((link, index) => (
      <SideNavLink key={index} link={link} />
    ))}
  </div>
);

const SideNavLink: React.FC<{ link: LinkGQLType }> = ({ link }) => {
  if (!link?.jsonValue?.value?.href) return <></>;
  const isExternalLink = link?.jsonValue?.value?.linktype === 'external';

  return (
    <div data-component="SideNavLink">
      <Button
        link={link?.jsonValue}
        variant="link"
        color="primary"
        className={cn(
          'copy-base flex items-center text-left text-content',
          'hover:decoration-black'
        )}
        iconRight={isExternalLink ? ('arrow-up-right-from-square' as IconType) : undefined}
        iconClasses={cn('h-3 w-3 !text-content', 'hover:heading-base')}
      />
    </div>
  );
};

// Types
type SideNavFields = {
  heading: Field<string>;
};

type SideNavProps = ComponentProps & {
  fields: SideNavFields;
  rendering?: SideNavRenderingType & (ComponentRendering | string);
};

export type SideNavDropdownFields = {
  heading: Field<string>;
  links: LinkGQLType[];
};

type SideNavDropdownProps = {
  fields: SideNavDropdownFields;
  params: ComponentParams;
  groupId?: string;
  index: number;
};

export type SideNavLinkDataType = {
  link: LinkGQLType;
};

type SideNavGroupDataType = {
  heading: {
    value: string;
  };
  children: {
    results: SideNavLinkDataType[];
  };
};

type SideNavRenderingType = {
  data: {
    item: {
      children: {
        results: SideNavGroupDataType[];
      };
    };
  };
};

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const language = getLayoutLanguage(layoutData);
  const graphQLClient = getGraphQlClient();
  const SIDENAV_GROUP_TEMPLATE_ID = '{B5661A7F-1BA0-4BEA-9333-8894FDC37924}';
  const SIDENAV_LINK_TEMPLATE_ID = '{93193400-F14B-4614-BC49-A888E15373E7}';

  // Only make the GraphQL request if we have a datasource
  if (!rendering.dataSource) {
    return {
      rendering,
    };
  }

  try {
    const data = await graphQLClient.request(GetSideNavigation.loc?.source.body || '', {
      datasourcePath: rendering.dataSource,
      language,
      sideNavGroupTemplateId: SIDENAV_GROUP_TEMPLATE_ID,
      sideNavLinkTemplateId: SIDENAV_LINK_TEMPLATE_ID,
    });
    return {
      rendering: { ...rendering, data },
    };
  } catch (error) {
    console.error('Error fetching side navigation data:', error);
    return {
      rendering,
    };
  }
};

export const Default = withDatasourceCheck()<SideNavProps>(SideNavDefault);
