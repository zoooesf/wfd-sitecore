import { useId } from 'react';
import { useTranslation } from 'lib/hooks/useTranslation';
import { CheckIcon } from '@radix-ui/react-icons';
import { PastEventsCheckboxStyled } from './styled';
type PastEventsCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const PastEventsCheckbox: React.FC<PastEventsCheckboxProps> = ({ checked, onChange }) => {
  const { t } = useTranslation();
  const checkboxId = 'past-events-checkbox-' + useId();

  return (
    <div className="flex items-start gap-4">
      <PastEventsCheckboxStyled.Checkbox
        id={checkboxId}
        checked={checked}
        onCheckedChange={onChange}
      >
        <PastEventsCheckboxStyled.Indicator>
          <CheckIcon />
        </PastEventsCheckboxStyled.Indicator>
      </PastEventsCheckboxStyled.Checkbox>
      <label
        htmlFor={checkboxId}
        className="w-full cursor-pointer select-none break-words text-content"
      >
        {t('Show past events')}
      </label>
    </div>
  );
};
