import type { Meta, StoryObj } from '@storybook/nextjs';

type TypographyExampleProps = {
  className: string;
  name: string;
  sample: string;
};

const TypographyExample: React.FC<TypographyExampleProps> = ({ className, name, sample }) => {
  return (
    <div className="mb-6 flex flex-col">
      <div className="mb-2 flex items-baseline justify-between border-b border-gray-200 pb-2">
        <span className="copy-base font-semibold">{name}</span>
        <span className="copy-xs text-gray-500">{className}</span>
      </div>
      <div className={`${className} break-words`}>{sample}</div>
    </div>
  );
};

const TypographyShowcase: React.FC = () => {
  const sampleText = 'The quick brown fox jumps over the lazy dog';
  const headingSample = 'Typography Example';

  return (
    <div className="mx-auto p-6">
      <h1 className="heading-3xl mb-8">Typography System</h1>

      <section className="mb-12">
        <h2 className="heading-xl mb-6 border-b border-gray-200 pb-2">Headings</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <TypographyExample className="heading-8xl" name="Heading 8XL" sample={headingSample} />
          <TypographyExample className="heading-7xl" name="Heading 7XL" sample={headingSample} />
          <TypographyExample className="heading-6xl" name="Heading 6XL" sample={headingSample} />
          <TypographyExample className="heading-5xl" name="Heading 5XL" sample={headingSample} />
          <TypographyExample className="heading-4xl" name="Heading 4XL" sample={headingSample} />
          <TypographyExample className="heading-3xl" name="Heading 3XL" sample={headingSample} />
          <TypographyExample className="heading-2xl" name="Heading 2XL" sample={headingSample} />
          <TypographyExample className="heading-xl" name="Heading XL" sample={headingSample} />
          <TypographyExample className="heading-lg" name="Heading LG" sample={headingSample} />
          <TypographyExample className="heading-base" name="Heading Base" sample={headingSample} />
          <TypographyExample className="heading-sm" name="Heading SM" sample={headingSample} />
          <TypographyExample className="heading-xs" name="Heading XS" sample={headingSample} />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="heading-xl mb-6 border-b border-gray-200 pb-2">Body Copy</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <TypographyExample className="copy-8xl" name="Copy 8XL" sample={sampleText} />
          <TypographyExample className="copy-7xl" name="Copy 7XL" sample={sampleText} />
          <TypographyExample className="copy-6xl" name="Copy 6XL" sample={sampleText} />
          <TypographyExample className="copy-5xl" name="Copy 5XL" sample={sampleText} />
          <TypographyExample className="copy-4xl" name="Copy 4XL" sample={sampleText} />
          <TypographyExample className="copy-3xl" name="Copy 3XL" sample={sampleText} />
          <TypographyExample className="copy-2xl" name="Copy 2XL" sample={sampleText} />
          <TypographyExample className="copy-xl" name="Copy XL" sample={sampleText} />
          <TypographyExample className="copy-lg" name="Copy LG" sample={sampleText} />
          <TypographyExample className="copy-base" name="Copy Base" sample={sampleText} />
          <TypographyExample className="copy-sm" name="Copy SM" sample={sampleText} />
          <TypographyExample className="copy-xs" name="Copy XS" sample={sampleText} />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="heading-xl mb-6 border-b border-gray-200 pb-2">Special Text</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <TypographyExample className="eyebrow" name="Eyebrow" sample="EYEBROW TEXT" />
        </div>
      </section>
      <section className="mb-12">
        <h2 className="heading-xl mb-6 border-b border-gray-200 pb-2">Default Font</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <h1>Heading 1 Typography Example</h1>
          <h2>Heading 2 Typography Example</h2>
          <h3>Heading 3 Typography Example</h3>
          <h4>Heading 4 Typography Example</h4>
          <h5>Heading 5 Typography Example</h5>
          <h6>Heading 6 Typography Example</h6>
        </div>
      </section>
    </div>
  );
};

const meta: Meta = {
  title: 'Design System/Typography',
  component: TypographyShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof TypographyShowcase>;

export const Typography: Story = {};
