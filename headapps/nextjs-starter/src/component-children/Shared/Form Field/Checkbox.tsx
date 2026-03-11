import { useTranslation } from 'lib/hooks/useTranslation';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className,
  labelClassName,
  id,
  disabled,
  ...props
}) => {
  const randomId = React.useId();
  const checkboxId = id || `checkbox-${randomId}`;
  const errorId = `${checkboxId}-error`;

  return (
    <div
      data-component="Checkbox"
      className="flex flex-col gap-1"
      role="group"
      aria-labelledby={checkboxId}
    >
      <div className="copy-sm flex items-center gap-2 leading-none text-content">
        <CheckboxInput
          id={checkboxId}
          disabled={disabled}
          className={className}
          errorId={errorId}
          {...props}
        />
        <CheckboxLabel
          label={label}
          id={checkboxId}
          disabled={disabled}
          labelClassName={labelClassName}
        />
      </div>
      <CheckboxError error={error} id={errorId} />
    </div>
  );
};

const CheckboxInput: React.FC<CheckboxProps> = ({
  label,
  error,
  className,
  id,
  disabled,
  checked,
  errorId,
  onCheckedChange,
  ...props
}) => {
  const { t } = useTranslation();

  const disabledClass =
    'disabled:cursor-not-allowed disabled:border-content/50 disabled:bg-content/50';

  return (
    <input
      type="checkbox"
      id={id}
      disabled={disabled}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}
      aria-label={!label ? props['aria-label'] || t('Checkbox') : undefined}
      className={twMerge('h-4 w-4 rounded border bg-white', disabled && disabledClass, className)}
      {...props}
    />
  );
};

const CheckboxLabel: React.FC<CheckboxLabelProps> = ({ label, id, disabled, labelClassName }) => {
  const disabledClass = 'cursor-not-allowed text-content/50';

  if (!label) return null;

  return (
    <label
      htmlFor={id}
      className={twMerge('copy-base', disabled && disabledClass, labelClassName)}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
};

const CheckboxError: React.FC<CheckboxErrorProps> = ({ error, id }) => {
  if (!error) return null;

  return (
    <p id={id} className="form-error copy-xs text-red-500 pl-6" role="alert">
      {error}
    </p>
  );
};

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  errorId?: string;
};

type CheckboxErrorProps = {
  error?: string;
  id: string;
};

type CheckboxLabelProps = {
  label?: string;
  id: string;
  disabled?: boolean;
  labelClassName?: string;
};
