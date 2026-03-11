import React from 'react';
import { Field, Placeholder, Text, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { placeholderGenerator } from 'lib/helpers';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';
import { useFrame } from 'lib/hooks/useFrame';
import { FullWidthWrapper } from 'component-children/Shared/Containers/FullWidthWrapper';
import { cn } from 'lib/helpers/classname';

const CardGridDefault: React.FC<CardGridProps> = (props) => {
  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <CardGridRendering {...props} />
    </Frame>
  );
};

const CardGridContentCentered: React.FC<CardGridProps> = (props) => {
  return (
    <Frame params={props.params}>
      <ContentCenteredRendering {...props} />
    </Frame>
  );
};
const CardGridFullWidth: React.FC<CardGridProps> = (props) => {
  return (
    <Frame params={props.params}>
      <FullWidthContentRendering {...props} />
    </Frame>
  );
};

const CardGridRendering: React.FC<CardGridProps> = ({ fields, params, rendering }) => {
  const { effectiveTheme, transparent } = useFrame();
  const transparentClass = transparent ? 'bg-transparent' : '';

  return (
    <ContainedWrapper theme={effectiveTheme} className={transparentClass}>
      <div data-component="CardGrid" className="flex w-full flex-col gap-4" data-variant="Default">
        <div className="flex flex-row items-center justify-between gap-4">
          <Text field={fields?.heading} tag="h2" className="heading-3xl leading-none" />
        </div>
        <PlaceholderContainer>
          <Placeholder name={placeholderGenerator(params, 'cardgrid')} rendering={rendering} />
        </PlaceholderContainer>
      </div>
    </ContainedWrapper>
  );
};

const ContentCenteredRendering: React.FC<CardGridProps> = ({ fields, params, rendering }) => {
  const { effectiveTheme, transparent } = useFrame();
  const transparentClass = transparent ? 'bg-transparent' : '';

  return (
    <ContainedWrapper theme={effectiveTheme} className={transparentClass}>
      <div
        data-component="CardGrid"
        data-variant="ContentCentered"
        className="flex w-full flex-col items-center gap-10"
      >
        <Text field={fields?.heading} tag="h2" className="heading-3xl leading-none" />
        <PlaceholderContainer>
          <Placeholder name={placeholderGenerator(params, 'cardgrid')} rendering={rendering} />
        </PlaceholderContainer>
      </div>
    </ContainedWrapper>
  );
};

const FullWidthContentRendering: React.FC<CardGridProps> = ({ fields, params, rendering }) => {
  const { effectiveTheme, transparent } = useFrame();
  const transparentClass = transparent ? 'bg-transparent' : '';

  return (
    <FullWidthWrapper theme={effectiveTheme} className={transparentClass}>
      <div
        data-component="CardGrid"
        data-variant="FullWidth"
        className="flex w-full flex-col items-center gap-10"
      >
        <Text field={fields?.heading} tag="h2" className="heading-3xl leading-none" />
        <PlaceholderContainer>
          <Placeholder name={placeholderGenerator(params, 'cardgrid')} rendering={rendering} />
        </PlaceholderContainer>
      </div>
    </FullWidthWrapper>
  );
};

const PlaceholderContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cardGrid = 'md:grid-cols-3' } = useFrame();
  const placeholderContainerClasses = cn('grid w-full grid-cols-1 gap-4', cardGrid);
  return <div className={placeholderContainerClasses}>{children}</div>;
};

type CardGridFields = {
  heading: Field<string>;
};

type CardGridProps = ComponentProps & {
  fields: CardGridFields;
};

export const Default = withDatasourceCheck()<CardGridProps>(CardGridDefault);
export const ContentCentered = withDatasourceCheck()<CardGridProps>(CardGridContentCentered);
export const FullWidth = withDatasourceCheck()<CardGridProps>(CardGridFullWidth);
