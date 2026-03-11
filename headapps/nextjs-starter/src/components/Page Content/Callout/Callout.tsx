import {
  Field,
  LinkField,
  RichText,
  RichTextField,
  Text,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { Button } from 'component-children/Shared/Button/Button';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';

const CalloutDefault: React.FC<CalloutProps> = (props) => {
  return (
    <Frame params={props.params}>
      <Callout {...props} />
    </Frame>
  );
};

const Callout: React.FC<CalloutProps> = ({ fields }) => {
  const { effectiveTheme } = useFrame();

  return (
    <ContainedWrapper>
      <div
        data-component="Callout"
        className={cn(
          'flex flex-col gap-y-4 border-l-4 border-surface bg-surface/50 p-4',
          'md:p-6',
          effectiveTheme
        )}
        role="region"
        aria-labelledby="callout-heading"
      >
        <Text tag="h2" className="heading-2xl text-content" field={fields.heading} />
        <RichText field={fields.body} className="richtext text-content" />
        <Button
          link={fields.link}
          variant="link"
          iconRight="arrow-right-long"
          className="heading-base"
          iconClasses="text-content w-3 h-3"
        />
      </div>
    </ContainedWrapper>
  );
};

type CalloutFields = {
  heading: Field<string>;
  body: RichTextField;
  link: LinkField;
};

type CalloutProps = {
  fields: CalloutFields;
} & ComponentProps;

export const Default = withDatasourceCheck()<CalloutProps>(CalloutDefault);
