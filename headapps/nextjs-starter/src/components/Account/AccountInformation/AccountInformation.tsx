import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { CommonPageRouteFieldsType } from 'lib/types';
import { useTranslation } from 'lib/hooks/useTranslation';
import moment from 'moment';

const AccountInformationDefault: React.FC<AccountInformationProps> = (props) => {
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <AccountInformation {...props} />
    </Frame>
  );
};

const AccountInformation: React.FC<AccountInformationProps> = () => {
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as unknown as CommonPageRouteFieldsType;
  const { heading } = routeFields;
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  if (status === 'loading') {
    return (
      <ContainedWrapper>
        <article
          data-component="AccountMgmt"
          className="flex flex-col items-center justify-center gap-4 pb-16"
        >
          <div className="flex items-center justify-center">
            <p className="text-content-secondary">{t('Loading')}</p>
          </div>
        </article>
      </ContainedWrapper>
    );
  }

  if (!session) {
    return (
      <ContainedWrapper>
        <article
          data-component="AccountMgmt"
          className="flex flex-col items-center justify-center gap-4 pb-16"
        >
          <section className="w-full max-w-4xl">
            <Text field={heading} className="richtext w-full" />
          </section>
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <p className="text-content-secondary">{t('Account Requires Login')}</p>
          </div>
        </article>
      </ContainedWrapper>
    );
  }

  // Pull in the user from the session
  const { user } = session;

  return (
    <ContainedWrapper>
      <article
        data-component="AccountMgmt"
        className="flex flex-col items-center justify-center gap-8 pb-16"
      >
        <section className="w-full max-w-4xl">
          <Text tag="h2" field={heading} className="heading-lg mb-6" />
        </section>

        <section className="w-full max-w-4xl">
          <div className="secondary rounded-lg bg-surface p-8 text-content shadow-md">
            <div className="flex flex-col items-center space-y-6 md:flex-row md:space-x-6">
              {/* Profile Image */}
              {user?.image && (
                <div className="flex-shrink-0">
                  <Image
                    src={user.image}
                    alt={user.name || t('Profile picture')}
                    className="border-border h-48 w-48 rounded-full border-4"
                    width={96}
                    height={96}
                  />
                </div>
              )}

              {/* User Information */}
              <div className="space-y-4 text-left">
                {user?.name && (
                  <div>
                    <h3 className="text-2xl font-semibold text-content">{user.name}</h3>
                  </div>
                )}

                {user?.email && (
                  <div>
                    <p className="text-content-secondary text-lg">{user.email}</p>
                  </div>
                )}

                {/* Additional user info if available */}
                <div className="border-border border-t pt-4">
                  <dl className="space-y-2">
                    <div className="flex justify-between gap-2">
                      <dt className="text-content-secondary text-sm font-medium">
                        {t('Account Status')}
                      </dt>
                      <dd className="text-sm text-green-600">{t('Active')}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-content-secondary text-sm font-medium">
                        {t('Account Member Since')}
                      </dt>
                      <dd className="text-sm text-content">{moment.utc().format('MM/DD/YYYY')}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </ContainedWrapper>
  );
};

type AccountInformationProps = ComponentProps;

export const Default = AccountInformationDefault;
