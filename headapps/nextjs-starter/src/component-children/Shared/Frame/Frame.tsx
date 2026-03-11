import { JSX } from 'react';
import { ComponentParams, ImageField, NextImage, useSitecore } from '@sitecore-content-sdk/nextjs';
import { cn } from 'lib/helpers/classname';
import { withPagesStyleChangeWatcher } from 'lib/hocs/withPagesStyleChangeWatcher';
import { FrameProvider } from 'lib/hooks/useFrame';

/**
 * Frame Component
 * A wrapper component that provides theming, padding, and background image capabilities
 */
const Frame = (props: FrameProps): JSX.Element => {
  return (
    <FrameProvider params={props.params} componentName={props.componentName}>
      <FrameRendering {...props} />
    </FrameProvider>
  );
};

const FrameRendering = ({
  fields,
  overrideClassName,
  className,
  containerClassName,
  children,
}: FrameProps): JSX.Element => {
  const { page } = useSitecore();
  const isEdit = !!page?.mode.isEditing;
  const classes = cn(overrideClassName ?? 'relative z-0', className);
  const containerClasses = cn('relative z-10', containerClassName);

  const shouldShowImage =
    fields?.backgroundImage && (!isEdit || fields.backgroundImage.value?.src?.includes('/-/media'));

  return (
    <div data-component="Frame" className={classes}>
      <div className={containerClasses}>{children}</div>

      {/* Only display in EE if image is selected */}
      {shouldShowImage && (
        <NextImage
          field={fields?.backgroundImage}
          alt=""
          width={1000}
          height={1000}
          className={`absolute inset-0 -z-20 h-full w-full object-cover`}
          fetchpriority="high"
          editable={false}
        />
      )}
    </div>
  );
};

type FrameFields = {
  backgroundImage?: ImageField;
};

export type FrameProps = React.PropsWithChildren<{
  params?: ComponentParams;
  fields?: FrameFields;
  className?: string;
  overrideClassName?: string;
  containerClassName?: string;
  componentName?: string;
}>;

export default withPagesStyleChangeWatcher<FrameProps>(Frame);
