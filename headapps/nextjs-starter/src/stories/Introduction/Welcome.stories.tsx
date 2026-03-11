import { Meta } from '@storybook/nextjs';

export default {
  title: 'Introduction/Welcome',
  parameters: {
    layout: 'fullscreen',
    previewTabs: {
      canvas: { hidden: false },
      'storybook/docs/panel': { hidden: true },
    },
  },
} as Meta;

type WelcomeProps = {
  title: string;
};

const Welcome: React.FC<WelcomeProps> = ({ title }) => {
  return (
    <div className="mx-auto max-w-inner-content p-8">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="mb-4 text-4xl font-bold">{title}</h1>
        <p className="text-lg">
          A modern, component-based design system for building Sitecore XM Cloud experiences
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-1 bg-surface p-6 shadow-md">
          <h2 className="mb-3 text-2xl font-bold">Component Library</h2>
          <p className="mb-4">
            TIDAL provides a comprehensive set of reusable components designed for Sitecore XM Cloud
            headless implementations.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Fully typed React components</li>
            <li>Sitecore JSS integration</li>
            <li>Responsive and accessible</li>
            <li>Customizable with Tailwind CSS</li>
          </ul>
        </div>

        <div className="rounded-1 bg-surface p-6 shadow-md">
          <h2 className="mb-3 text-2xl font-bold">Getting Started</h2>
          <p className="mb-4">
            Explore our component library to understand how to implement and customize TIDAL
            components in your project.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Browse components by category</li>
            <li>View component variants and props</li>
            <li>Copy code examples</li>
            <li>Test interactions in the Canvas tab</li>
          </ul>
        </div>
      </div>

      <div className="mb-12 rounded-1 bg-surface p-6 shadow-md">
        <h2 className="mb-3 text-2xl font-bold">Design Principles</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-xl font-bold">Modular</h3>
            <p>
              Components are designed to be combined in various ways to create complex layouts while
              maintaining consistency.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold">Accessible</h3>
            <p>
              All components follow WCAG guidelines to ensure they are usable by everyone, including
              people with disabilities.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold">Performant</h3>
            <p>
              Components are optimized for performance, with careful attention to bundle size and
              rendering efficiency.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-1 bg-primary bg-opacity-10 p-6">
        <h2 className="mb-3 text-2xl font-bold">Need Help?</h2>
        <p className="mb-4">
          If you have questions or need assistance with TIDAL components, check out these resources:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              href="https://www.notion.so/getfishtank/Sitecore-Component-Creation-149b4ffdd71e8045836fdd42bce4780c?pvs=4"
              className="hover:underline"
            >
              Sitecore Component Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.notion.so/getfishtank/Project-Integration-Documentation-14bb4ffdd71e80dca6dff77ee75b59c0?pvs=4"
              className="hover:underline"
            >
              Project Integration Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.notion.so/getfishtank/11ab4ffdd71e8066b489e3023b65ca15?v=e430326ac9564e18abb18951e6a199b8&pvs=4"
              className="hover:underline"
            >
              Component Library
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const TidalWelcome = {
  render: () => <Welcome title="Welcome to TIDAL" />,
  name: 'Welcome',
};
