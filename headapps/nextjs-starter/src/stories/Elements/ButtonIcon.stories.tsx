import type { Meta } from '@storybook/nextjs';
import ButtonIcon from 'component-children/Shared/Button/ButtonIcon';
import { linkFieldArgs } from 'lib/helpers/storybook';

const meta = {
  title: 'Elements/ButtonIcon',
  component: ButtonIcon,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-screen-lg">
        <h1 className="mb-md text-3xl font-bold">ButtonIcon Component</h1>
        <div className="flex flex-col gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ButtonIcon>;

export default meta;

export const All = {
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: () => (
    <>
      <div className="grid w-full grid-cols-4">
        <ButtonIcon icon="instagram" link={linkFieldArgs()} label="Instagram" />
        <ButtonIcon icon="linkedin-in" link={linkFieldArgs()} label="LinkedIn" />
        <ButtonIcon icon="x-twitter" link={linkFieldArgs()} label="X" />
        <ButtonIcon icon="youtube" link={linkFieldArgs()} label="YouTube" />
      </div>
    </>
  ),
};
