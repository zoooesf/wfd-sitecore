import type { Meta, StoryObj } from '@storybook/nextjs';
import { Login } from 'component-children/Navigation/Login/Login';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { FrameProvider } from 'lib/hooks/useFrame';
import { getTheme } from 'lib/helpers/storybook';

const meta: Meta<typeof Login> = {
  title: 'Components/Navigation/Login',
  component: Login,
};

export default meta;
type Story = StoryObj<typeof meta>;

const getSessionDecorator = (loggedIn: boolean) => {
  const mockSession: Session = {
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      image: 'https://picsum.photos/200',
    },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DecoratorComponent = (Story: any, context: any) => {
    const theme = getTheme(context);
    const params = { Styles: `theme:${theme}` };

    return (
      <SessionProvider session={loggedIn ? mockSession : null}>
        <FrameProvider params={params}>
          <div className="flex h-full min-h-30 w-full">
            <div className={`${theme} relative flex w-full items-center justify-center bg-surface`}>
              <Story />
            </div>
          </div>
        </FrameProvider>
      </SessionProvider>
    );
  };

  return DecoratorComponent;
};

export const LoggedIn: Story = {
  decorators: [getSessionDecorator(true)],
};

export const LoggedOut: Story = {
  decorators: [getSessionDecorator(false)],
};
