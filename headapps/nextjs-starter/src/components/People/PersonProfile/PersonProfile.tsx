import { JSX } from 'react';
import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import PersonProfileRendering from 'component-children/People/PersonProfile/PersonProfile';

interface ComponentProps {
  rendering: ComponentRendering;
  params: { [key: string]: string };
}

const PersonProfile = ({ params }: ComponentProps): JSX.Element => {
  return (
    <Frame params={params}>
      <PersonProfileRendering />
    </Frame>
  );
};

export const Default = PersonProfile;
