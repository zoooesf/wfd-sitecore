import { Login } from 'component-children/Navigation/Login/Login';
import { isAuthEnabled } from 'lib/helpers/auth';
import { GetComponentServerProps } from '@sitecore-content-sdk/nextjs';
import { fetchAuthConfig, AuthConfig } from 'lib/helpers/site-config-helpers';

type LoginDefaultProps = {
  authConfig?: AuthConfig | null;
};

const LoginDefault: React.FC<LoginDefaultProps> = ({ authConfig }) => {
  if (!isAuthEnabled()) {
    console.error(
      'Auth is not enabled - NEXT_PUBLIC_ENABLE_AUTH set to: ' + process.env.NEXT_PUBLIC_ENABLE_AUTH
    );
    return null;
  }
  return <Login authConfig={authConfig} />;
};

export const getComponentServerProps: GetComponentServerProps = async (_, layoutData) => {
  const siteName = layoutData.sitecore?.context?.site?.name;

  if (!siteName) {
    return {
      authConfig: null,
    };
  }

  try {
    const authConfig = await fetchAuthConfig(siteName);
    return {
      authConfig: authConfig || null,
    };
  } catch (error) {
    console.error('Error fetching auth config:', error);
    return {
      authConfig: null,
    };
  }
};

export const Default = LoginDefault;
