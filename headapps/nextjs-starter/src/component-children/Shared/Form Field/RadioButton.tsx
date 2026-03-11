import { useTranslation } from 'lib/hooks/useTranslation';
import React, { useState, useEffect } from 'react';

export const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  name,
  label,
  onChange,
  required = false,
  defaultValue = '',
  stacked = false,
  error: errorProp,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue);
      onChange(defaultValue);
    }
  }, [defaultValue, onChange]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    setTouched(true);
    setError('');
    onChange(value);
  };

  const handleBlur = () => {
    setTouched(true);
    if (required && !selectedValue) {
      setError(t('This field is required'));
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-surface text-content" data-component="RadioButton">
      <div className="heading-base">
        {label}
        {required && <span className="required text-red-500">*</span>}
      </div>

      <div className={`flex ${stacked ? 'flex-col gap-2' : 'flex-row gap-4'}`}>
        {options.map((option) => (
          <div key={option.value} className="copy-base flex items-center gap-1">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor={`${name}-${option.value}`}>{option.label}</label>
          </div>
        ))}
      </div>

      {((touched && error) || errorProp) && (
        <div className="copy-sm text-red-500">{errorProp || error}</div>
      )}
    </div>
  );
};
type RadioOption = {
  label: string;
  value: string;
};

type RadioButtonProps = {
  options: RadioOption[];
  name: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  defaultValue?: string;
  stacked?: boolean;
  error?: string;
};
