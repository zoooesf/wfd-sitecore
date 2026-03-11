import { Checkbox } from './Checkbox'; // Adjust the import path as necessary

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  value,
  onChange,
  stack = false,
  required = false,
  error,
}) => {
  const handleCheckboxChange = (checked: boolean, optionValue: string) => {
    const newValue = checked ? [...value, optionValue] : value.filter((v) => v !== optionValue);
    onChange(newValue);
  };

  return (
    <div
      data-component="CheckboxGroup"
      className={`flex flex-col gap-2 ${stack ? 'flex-col' : 'flex-row'}`}
      role="group"
      aria-labelledby={label}
    >
      {label && (
        <div className="heading-base text-copy" id={label}>
          {label} {required && <span className="text-red-500">*</span>}
        </div>
      )}
      <div className={`flex ${stack ? 'flex-col' : 'flex-row'} gap-2`}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) => handleCheckboxChange(checked, option.value)}
          />
        ))}
      </div>
      {error && (
        <label role="alert" className="form-error copy-xs text-red-500">
          {error}
        </label>
      )}
    </div>
  );
};

type CheckboxGroupProps = {
  label?: string;
  options: { label: string; value: string }[];
  value: string[];
  onChange: (selectedValues: string[]) => void;
  stack?: boolean;
  required?: boolean;
  error?: string;
};
