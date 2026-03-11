import { RenderingProps } from 'lib/helpers/rendering-props';
import { ComponentParams } from '@sitecore-content-sdk/nextjs';
import { parseRenderingProps } from 'lib/helpers/rendering-props';
import React, { createContext, useContext } from 'react';
import { ThemeType } from 'lib/types';
import { PRIMARY_THEME } from 'lib/const';

type FrameContextValue = RenderingProps & {
  parentTheme?: string;
  effectiveTheme: ThemeType;
};

const FrameContext = createContext<FrameContextValue>({ effectiveTheme: PRIMARY_THEME });

export const FrameProvider: React.FC<FrameProps> = ({ params, componentName, children }) => {
  // Capture parent context before creating new one
  const parentContext = useContext(FrameContext);
  const currentProps = parseRenderingProps(params?.Styles, componentName);

  // Preserve parent's theme for smart defaults
  const contextValue: FrameContextValue = {
    ...currentProps,
    parentTheme: parentContext.theme || parentContext.parentTheme,
    effectiveTheme: (currentProps.theme ||
      parentContext.theme ||
      parentContext.parentTheme ||
      PRIMARY_THEME) as ThemeType,
  };

  return <FrameContext.Provider value={contextValue}>{children}</FrameContext.Provider>;
};

export const useFrame = (): FrameContextValue => {
  return useContext(FrameContext);
};

export type FrameProps = {
  params?: ComponentParams;
  children: React.ReactNode;
  componentName?: string;
};
