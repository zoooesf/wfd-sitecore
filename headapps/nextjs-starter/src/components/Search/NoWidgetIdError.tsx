import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

type NoWidgetIdErrorProps = {
  params?: ComponentProps['params'];
};

export const NoWidgetIdError: React.FC<NoWidgetIdErrorProps> = ({ params }) => {
  const { page } = useSitecore();

  if (!page?.mode.isEditing) return null;

  return (
    <Frame params={params}>
      <div className="text-red-600 p-4 text-center">No widget id configured</div>
    </Frame>
  );
};
