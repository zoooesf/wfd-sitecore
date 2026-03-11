import type { Meta } from '@storybook/nextjs';
import { AwakeToggle } from 'component-children/Shared/Button/AwakeToggle';
import Button from 'component-children/Shared/Button/Button';

const meta = {
  title: 'Elements/Button',
  component: Button,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-screen-lg">
        <h1 className="mb-md text-3xl font-bold">Button Component</h1>
        <div className="flex flex-col gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

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
        <Button color="primary">Button</Button>
        <Button color="secondary">Button</Button>
        <Button color="tertiary">Button</Button>
        <AwakeToggle />
      </div>
      <div className="grid w-full grid-cols-4">
        <Button color="primary" variant="outline">
          Button
        </Button>
        <Button color="secondary" variant="outline">
          Button
        </Button>
        <Button color="tertiary" variant="outline">
          Button
        </Button>
      </div>
      <div className="grid w-full grid-cols-4">
        <Button color="primary" variant="link">
          Button
        </Button>
        <Button color="secondary" variant="link">
          Button
        </Button>
        <Button color="tertiary" variant="link">
          Button
        </Button>
      </div>
    </>
  ),
};

export const WithIcon = {
  globals: {
    theme: '',
    paddingTop: '',
    paddingBottom: '',
  },
  render: () => (
    <>
      <div className="grid w-full grid-cols-4">
        <Button iconLeft="chevron-left" color="primary">
          Button
        </Button>
        <Button iconLeft="chevron-left" color="secondary">
          Button
        </Button>
        <Button iconLeft="chevron-left" color="tertiary">
          Button
        </Button>
      </div>
      <div className="grid w-full grid-cols-4">
        <Button iconRight="chevron-right" color="primary" variant="outline">
          Button
        </Button>
        <Button iconRight="chevron-right" color="secondary" variant="outline">
          Button
        </Button>
        <Button iconRight="chevron-right" color="tertiary" variant="outline">
          Button
        </Button>
      </div>
      <div className="grid w-full grid-cols-4">
        <Button iconRight="chevron-right" color="primary" variant="link">
          Button
        </Button>
        <Button iconRight="chevron-right" color="secondary" variant="link">
          Button
        </Button>
        <Button iconRight="chevron-right" color="tertiary" variant="link">
          Button
        </Button>
      </div>
    </>
  ),
};
