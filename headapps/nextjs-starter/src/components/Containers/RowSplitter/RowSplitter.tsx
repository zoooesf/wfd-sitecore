// CUSTOMIZATION (whole file) - Moved and heavily customized
import React, { JSX } from 'react';
import { ComponentRendering, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
// BEGIN CUSTOMIZATION - Extra imports
import { ContainerProvider } from 'lib/hooks/useContainer';
import Frame from 'component-children/Shared/Frame/Frame';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
// END CUSTOMIZATION

/**
 * The number of rows that can be inserted into the row splitter component.
 * The maximum number of rows is 8.
 */
type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * The styles specified for each rendered row.
 * The key is the row number, and the value is the styles.
 */
type RowStyles = {
  [K in `Styles${RowNumber}`]?: string;
};

interface RowSplitterProps extends ComponentProps {
  rendering: ComponentRendering;
  params: ComponentProps['params'] & RowStyles;
}

export const Default = ({ params, rendering }: RowSplitterProps): JSX.Element => {
  const enabledPlaceholders = params.EnabledPlaceholders?.split(',') ?? [];
  const id = params.RenderingIdentifier;

  // BEGIN CUSTOMIZATION - For custom implementation
  const { effectiveTheme } = useFrame();
  const styles = `${params?.GridParameters ?? ''} ${params?.Styles ?? ''}`.trimEnd();
  // END CUSTOMIZATION

  return (
    // BEGIN CUSTOMIZATION - Wrapping the component in a Frame and container
    <Frame params={params} componentName={COMPONENT_NAME}>
      <ContainedWrapper theme={effectiveTheme} className="bg-surface">
        <ContainerProvider containerName={COMPONENT_NAME}>
          <div
            data-component={COMPONENT_NAME}
            className={cn('component row-splitter w-full', styles)}
            id={id || undefined}
          >
            {enabledPlaceholders.map((ph, index) => {
              const num = Number(ph) as RowNumber;
              const placeholderKey = `row-${num}-{*}`;
              const rowStyles = `${params[`Styles${num}`] ?? ''}`.trimEnd();

              return (
                <div key={index} className={rowStyles}>
                  <div className="w-full">
                    <Placeholder name={placeholderKey} rendering={rendering} />
                  </div>
                </div>
              );
            })}
          </div>
        </ContainerProvider>
      </ContainedWrapper>
    </Frame>
    // END CUSTOMIZATION
  );
};

// BEGIN CUSTOMIZATION - Component name for consistency
const COMPONENT_NAME = 'RowSplitter';
// END CUSTOMIZATION
