// CUSTOMIZATION (whole file) - Moved and heavily customized
import React, { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
// BEGIN CUSTOMIZATION - Extra imports
import { ContainerProvider, useContainer } from 'lib/hooks/useContainer';
import Frame from 'component-children/Shared/Frame/Frame';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers';
import { Wrapper } from 'component-children/Shared/Containers/Wrapper';
import { useTranslation } from 'lib/hooks/useTranslation';
// END CUSTOMIZATION

/**
 * The number of columns that can be inserted into the column splitter component.
 * The maximum number of columns is 8.
 */
type ColumnNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * The width specified for each rendered column.
 * The key is the column number, and the value is the width.
 */
type ColumnWidths = {
  [K in ColumnNumber as `ColumnWidth${K}`]?: string;
};

/**
 * The styles specified for each rendered column.
 * The key is the column number, and the value is the styles.
 */
type ColumnStyles = {
  [K in ColumnNumber as `Styles${K}`]?: string;
};

interface ColumnSplitterProps extends ComponentProps {
  params: ComponentProps['params'] & ColumnWidths & ColumnStyles;
}

export const Default = ({ params, rendering }: ColumnSplitterProps): JSX.Element => {
  // BEGIN CUSTOMIZATION - Extract GridParameters instead of styles
  const { EnabledPlaceholders, RenderingIdentifier: id, GridParameters = '' } = params;
  // END CUSTOMIZATION

  // BEGIN CUSTOMIZATION - For custom implementation
  const { effectiveTheme, gap = 'none', padding, paddingDesktop } = useFrame();
  const { containerName } = useContainer();
  const containerMarginClass = GAP_CLASS_MAP[gap as keyof typeof GAP_CLASS_MAP].container;
  const columnMarginClass = GAP_CLASS_MAP[gap as keyof typeof GAP_CLASS_MAP].column;
  const styles = cn(GridParameters ?? '', containerMarginClass);
  const innerClassname = cn(padding, paddingDesktop);
  const { t } = useTranslation();
  // END CUSTOMIZATION

  const enabledColumns = EnabledPlaceholders?.split(',') ?? [];

  return (
    // BEGIN CUSTOMIZATION - Wrapping the component in a Frame and container
    <Frame params={params} componentName={COMPONENT_NAME}>
      <Wrapper theme={effectiveTheme} className="bg-surface">
        <ContainerProvider containerName={COMPONENT_NAME}>
          <div
            data-component={COMPONENT_NAME}
            className={cn(
              'flex flex-wrap items-stretch',
              styles,
              containerName === 'RowSplitter' ? innerClassname : ''
            )}
            id={id || undefined}
            aria-label={t('Column layout container')}
          >
            {enabledColumns.map((columnNum, index) => {
              const num = Number(columnNum) as ColumnNumber;
              const columnWidth = params[`ColumnWidth${num}`] ?? '';
              const columnStyle = params[`Styles${num}`] ?? '';
              const columnClassNames = cn(columnWidth, columnStyle, columnMarginClass, 'flex');

              return (
                <div key={index} className={columnClassNames}>
                  <div className="h-full w-full">
                    <Placeholder name={`column-${columnNum}-{*}`} rendering={rendering} />
                  </div>
                </div>
              );
            })}
          </div>
        </ContainerProvider>
      </Wrapper>
    </Frame>
    // END CUSTOMIZATION
  );
};

// BEGIN CUSTOMIZATION - Gap class map for different screen sizes
const GAP_CLASS_MAP = {
  none: {
    container: '',
    column: '',
  },
  md: {
    container: '-m-4',
    column: 'p-4',
  },
  lg: {
    container: '-m-4',
    column: 'p-6',
  },
};
// END CUSTOMIZATION

// BEGIN CUSTOMIZATION - Component name for consistency
const COMPONENT_NAME = 'ColumnSplitter';
// END CUSTOMIZATION
