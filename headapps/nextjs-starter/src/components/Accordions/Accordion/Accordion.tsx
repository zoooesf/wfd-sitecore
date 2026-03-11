import { Field, LinkField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import Frame from 'component-children/Shared/Frame/Frame';
import Accordion from 'component-children/Accordions/Accordion/Accordion';

const AccordionDefault: React.FC<AccordionProps> = (props) => {
  return (
    <Frame params={props.params}>
      <Accordion {...props} />
    </Frame>
  );
};

type AccordionFields = {
  heading: Field<string>;
  subheading: Field<string>;
  link?: LinkField;
};

export type AccordionProps = ComponentProps & {
  fields: AccordionFields;
};

export const Default = withDatasourceCheck()<AccordionProps>(AccordionDefault);
