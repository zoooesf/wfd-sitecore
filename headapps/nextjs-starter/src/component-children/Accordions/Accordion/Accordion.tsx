import { Placeholder, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { AccordionProvider } from 'lib/hooks/useAccordion';
import Button from 'component-children/Shared/Button/Button';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { useFrame } from 'lib/hooks/useFrame';
import { AccordionProps } from 'components/Accordions/Accordion/Accordion';
import { placeholderGenerator } from 'lib/helpers';
import { PRIMARY_THEME, TERTIARY_THEME } from 'lib/const';

const Accordion: React.FC<AccordionProps> = ({ fields, rendering, params }) => {
  const { effectiveTheme, transparent } = useFrame();
  const transparentClass = transparent ? 'bg-transparent' : '';
  const buttonColor =
    effectiveTheme === PRIMARY_THEME || effectiveTheme === TERTIARY_THEME
      ? 'secondary'
      : 'tertiary';

  const accordionGroupId = `accordion-group-${params.id}-${params.renderingId}`;

  return (
    <ContainedWrapper theme={effectiveTheme} className={transparentClass}>
      <AccordionProvider>
        <div
          className="accordion flex w-full flex-col gap-4"
          data-component="Accordion"
          data-accordion-group={accordionGroupId}
        >
          <div className="flex flex-row items-center justify-between">
            <div className="mb-4 flex flex-col gap-4">
              <Text field={fields?.heading} tag="h2" className="heading-3xl leading-none" />
              <RichText field={fields?.subheading} className="richtext copy-xl leading-none" />
            </div>
            <Button className="h-fit" variant="button" color={buttonColor} link={fields?.link} />
          </div>
          <div className="flex w-full flex-col gap-4">
            <Placeholder name={placeholderGenerator(params, 'accordion')} rendering={rendering} />
          </div>
        </div>
      </AccordionProvider>
    </ContainedWrapper>
  );
};

export default Accordion;
