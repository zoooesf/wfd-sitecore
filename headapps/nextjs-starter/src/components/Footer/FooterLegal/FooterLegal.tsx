import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
  Link,
  LinkField,
  Text,
  useSitecore,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import moment from 'moment';
import Button from 'component-children/Shared/Button/Button';
import { IconSocialType, IconType, LinkFieldProps } from 'lib/types';
import IconSocial from 'component-children/Shared/Icon/IconSocial';
import { getGraphQlClient } from 'lib/graphql-client';
import { FOOTER_SOCIAL_LINK_TEMPLATE_ID } from 'lib/graphql/id';
import { LinkGQLType } from 'lib/types';
import { pageEditCheck } from 'lib/helpers';
import { cn } from 'lib/helpers/classname';
import { GetFooterLegalSocialLinks } from 'graphql/generated/graphql-documents';
import { getLayoutLanguage } from 'lib/helpers';
import { FrameProvider } from 'lib/hooks/useFrame';

const FooterLegalDefault: React.FC<FooterLegalProps> = ({ className, fields, rendering }) => {
  const classes = cn('tertiary w-full bg-surface text-content', className);

  return (
    <FrameProvider params={{ Styles: 'theme:tertiary' }}>
      <div data-component="FooterLegal" className={classes}>
        <div className={cn('w-full px-8', 'lg:px-16')}>
          <div
            className={cn(
              'm-auto flex w-full max-w-outer-content flex-col flex-wrap items-center justify-between gap-6 py-8',
              'lg:flex-row'
            )}
          >
            <LegalRow fields={fields} />
            <Copyright fields={fields} />
            <SocialRow rendering={rendering} />
          </div>
        </div>
        <LandAcknowledgement fields={fields} />
      </div>
    </FrameProvider>
  );
};

const LegalButton = ({ link }: LinkFieldProps) => (
  <Button link={link} variant="link" className="no-underline" />
);

const LegalRow = ({ fields }: FooterLegalFields) => {
  const { privacyPolicyLink, tosLink, cookiePolicyLink } = fields;

  return (
    <div
      data-component="LegalRow"
      className={cn(
        'flex max-w-none flex-row flex-wrap items-center justify-center gap-6 bg-surface text-content',
        'lg:max-w-outer-content lg:items-start'
      )}
    >
      <LegalButton link={privacyPolicyLink} />
      <LegalButton link={tosLink} />
      <LegalButton link={cookiePolicyLink} />
    </div>
  );
};

const Copyright: React.FC<FooterLegalFields> = ({ fields }) => {
  const { copyright } = fields;
  const currentYear = moment.utc().format('YYYY');

  return (
    <div className="copy-sm flex-shrink-0 text-content">
      ©{currentYear + ' '}
      <Text className="copy-sm" field={copyright} />
    </div>
  );
};

const SocialRow: React.FC<FooterLegalRenderingType> = ({ rendering }) => {
  return (
    <div
      data-component="SocialRow"
      className={cn(
        'flex max-w-none flex-row flex-wrap items-center justify-center gap-6 bg-surface text-content',
        'lg:max-w-outer-content lg:justify-end'
      )}
    >
      {rendering?.socialLinks?.map((socialIcon, idx) => (
        <SocialIconLink key={idx} icon={socialIcon?.socialIcon?.value} link={socialIcon?.link} />
      ))}
    </div>
  );
};

const SocialIconLink: React.FC<SocialIconLinkProps> = ({ link, icon }) => {
  const classes = cn(
    'flex h-6 w-6 items-center justify-center rounded-full bg-black/10 duration-300',
    'hover:bg-black/20'
  );
  const { page } = useSitecore();

  return pageEditCheck(
    page,
    <div data-component="SocialIconLink" className={classes}>
      <IconSocial icon={icon} color="text-black" />
    </div>,
    link?.jsonValue?.value?.href,
    link?.jsonValue?.value?.href ? (
      <Link
        data-component="SocialIconLink"
        className={classes}
        field={link?.jsonValue}
        aria-label={icon}
      >
        <IconSocial icon={icon} color="text-black" />
      </Link>
    ) : (
      <></>
    )
  );
};

const LandAcknowledgement: React.FC<FooterLegalFields> = ({ fields }) => {
  const { page } = useSitecore();

  return (
    (page?.mode.isEditing || fields?.landAcknowledgement?.value) && (
      <FrameProvider params={{ Styles: 'theme:primary' }}>
        <div className={cn('primary w-full bg-surface px-8 text-content', 'lg:px-16')}>
          <div className="copy-sm flex-shrink-0 py-6">
            <Text field={fields?.landAcknowledgement} tag="p" className="text-center" />
          </div>
        </div>
      </FrameProvider>
    )
  );
};

type SocialIconLinkProps = {
  link?: LinkGQLType;
  icon: IconType;
};

type SocialLinkType = {
  link: LinkGQLType;
  socialIcon: {
    value: IconSocialType;
  };
};

type SocialMediaGraphQLResponseType = {
  item?: {
    socialLinks?: {
      results?: SocialLinkType[];
    };
  };
};

type FooterLegalFields = {
  fields: {
    copyright: Field<string>;
    privacyPolicyLink: LinkField;
    tosLink: LinkField;
    cookiePolicyLink: LinkField;
    landAcknowledgement: Field<string>;
  };
};

type FooterLegalRenderingType = {
  rendering: ComponentRendering & {
    socialLinks: SocialLinkType[];
  };
};

type FooterLegalProps = ComponentProps &
  FooterLegalFields &
  FooterLegalRenderingType & {
    className?: string;
  };

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const language = getLayoutLanguage(layoutData);
  const graphQLClient = getGraphQlClient();

  // Only make the GraphQL request if we have a datasource
  if (!rendering.dataSource) {
    return {
      rendering: { ...rendering, socialLinks: [] },
    };
  }

  try {
    const data: SocialMediaGraphQLResponseType = await graphQLClient.request(
      GetFooterLegalSocialLinks.loc?.source.body || '',
      {
        datasourcePath: rendering.dataSource,
        language,
        templateId: FOOTER_SOCIAL_LINK_TEMPLATE_ID,
      }
    );
    const socialLinks = data?.item?.socialLinks?.results || [];

    return {
      rendering: { ...rendering, socialLinks },
    };
  } catch (error) {
    console.error('Error fetching footer legal data:', error);
    return {
      rendering: { ...rendering, socialLinks: [] },
    };
  }
};

export const Default = withDatasourceCheck()<FooterLegalProps>(FooterLegalDefault);
