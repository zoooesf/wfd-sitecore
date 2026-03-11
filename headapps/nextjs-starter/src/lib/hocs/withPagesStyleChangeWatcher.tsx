import { ComponentParams, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useRef, useState, useEffect } from 'react';

// HOC that re-renders a React component when changing the styles in the right side panel of XM Cloud Pages.
// Author: David Ly, adapted by Jeff L'Heureux
// This is required because XM Cloud Pages directly applies the SXA style items values to the DOM elements. Our theming system does not store Tailwind classes in the SXA style items. It stores tokens that are processed by JavaScript code at component render time. We need to watch for DOM class attribute changes and re-render the component to compute and apply the new styles.
export function withPagesStyleChangeWatcher<P extends WithPagesStyleChangeWatcherProps>(
  WrappedComponent: React.ComponentType<P>
) {
  function WatcherComponent(props: P) {
    const ref = useRef<HTMLDivElement>(null);
    const [styles, setStyles] = useState(props?.params?.Styles ?? '');
    const context = useSitecore();

    const isEditing = context?.page?.mode.isEditing;

    useEffect(() => {
      if (!ref.current || !isEditing) {
        return;
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            // Ignore the 'component' class which is the first one.
            const [, ...classes] = ref.current?.classList.value.split(' ') ?? [];
            // Setting the styles state will trigger a re-render of the component.
            setStyles(classes.join(' '));
          }
        });
      });

      observer.observe(ref.current, { attributes: true });

      return () => {
        observer.disconnect();
      };
    }, [isEditing, props.params]);

    // Don't do anything if we're not editing
    if (!isEditing) {
      return <WrappedComponent {...props} />;
    }

    // We must check if props.params is defined because if the component has no styles set at all, it seems to be undefined.
    // This causes the first style change to not be rendered automatically and requires a page refresh. Subsequent changes are rendered correctly.
    if (props?.params) {
      // Update the Styles param from the current state before rendering
      props.params.Styles = styles;
    }

    return (
      <>
        {/* This needs to be a top level element with the "component" class, but it need not be visible */}
        <div ref={ref} className={'component ' + styles} style={{ display: 'none' }} />

        <WrappedComponent {...props} />
      </>
    );
  }

  return WatcherComponent;
}

type WithPagesStyleChangeWatcherProps = {
  params?: ComponentParams;
};
