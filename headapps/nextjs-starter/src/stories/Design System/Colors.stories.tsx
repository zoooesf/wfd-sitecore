import type { Meta, StoryObj } from '@storybook/nextjs';
import { cn } from 'lib/helpers/classname';
import { ThemeType } from 'lib/types';

// Local type extension for Storybook color showcase only
type ColorSwatchTheme = ThemeType | 'black' | 'white';

type ColorSwatchProps = {
  colorName: string;
  theme?: ColorSwatchTheme;
  hex?: string;
};

const ColorSwatch: React.FC<ColorSwatchProps> = ({ colorName, theme, hex }) => {
  return (
    <div className={cn('mb-4 flex flex-col', theme)}>
      <div className="mb-2 flex h-24 w-full flex-col items-center justify-center gap-1 rounded-md bg-surface shadow-md">
        <span className="heading-base text-content">{colorName}</span>
        <span className="copy-xs text-content">{hex}</span>
      </div>
    </div>
  );
};

const ColorPalette: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="heading-2xl mb-8">Theme Colors</h1>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <ColorSwatch colorName="Primary" theme="primary" hex="#CF222B" />
        <ColorSwatch colorName="Secondary" theme="secondary" hex="#990000" />
        <ColorSwatch colorName="Tertiary" theme="tertiary" hex="#636466" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <ColorSwatch colorName="Black" theme="black" hex="#000000" />
        <ColorSwatch colorName="White" theme="white" hex="#FFFFFF" />
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Design System/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const Colors: Story = {};
