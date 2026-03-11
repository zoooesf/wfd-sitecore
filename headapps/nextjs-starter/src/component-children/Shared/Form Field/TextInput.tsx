import React, { ComponentPropsWithoutRef, forwardRef, memo } from 'react';
import { twMerge } from 'tailwind-merge';

// Move styles outside component to prevent recreation on each render
const STYLES = {
  base: 'w-full px-4 py-2 border rounded-md transition-all duration-200 focus:outline-none',
  active: 'border-blue-500 ring-2 ring-blue-200',
  error: 'border-red-500 ring-2 ring-red-200',
  disabled: 'bg-content/10 cursor-not-allowed opacity-60',
  default: 'border-content/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
} as const;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      value,
      onChange,
      placeholder,
      disabled = false,
      error,
      label,
      isActive = false,
      className,
      id = crypto.randomUUID(),
      type = 'text',
      required,
      ...restProps
    },
    ref
  ) => {
    const inputStyles = twMerge(
      STYLES.base,
      isActive && STYLES.active,
      error && STYLES.error,
      disabled && STYLES.disabled,
      !isActive && !error && !disabled && STYLES.default,
      className
    );

    return (
      <div data-component="TextInput" className="flex flex-col gap-2">
        <TextInputLabel id={id} label={label} required={required} />
        <TextInputSection
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          id={id}
          type={type}
          required={required}
          inputStyles={inputStyles}
          {...restProps}
        />
        <TextInputError id={id} error={error} />
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

const TextInputLabel = memo<TextInputLabelProps>(({ id, label, required }) => {
  if (!label) return null;

  return (
    <label data-component="TextInputLabel" htmlFor={id} className="heading-base text-copy">
      {label}
      {required && (
        <span className="text-red-500 ml-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
});
TextInputLabel.displayName = 'TextInputLabel';

const TextInputError = memo<TextInputErrorProps>(({ id, error }) => {
  if (!error) return null;

  return (
    <label
      data-component="TextInputError"
      htmlFor={id}
      id={`${id}-error`}
      className="copy-sm text-red-500 cursor-pointer"
      role="alert"
    >
      {error}
    </label>
  );
});
TextInputError.displayName = 'TextInputError';

const TextInputSection = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      value,
      onChange,
      placeholder,
      disabled,
      error,
      id,
      type,
      required,
      inputStyles,
      ...restProps
    },
    ref
  ) => {
    return (
      <input
        {...restProps}
        ref={ref}
        id={id}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-hidden="true"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputStyles}
      />
    );
  }
);
TextInputSection.displayName = 'TextInputSection';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'search';

type TextInputLabelProps = {
  id: string;
  label?: string;
  required?: boolean;
};

type TextInputErrorProps = { id: string; error?: string };

type TextInputProps = ComponentPropsWithoutRef<'input'> & {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  isActive?: boolean;
  className?: string;
  id?: string;
  type?: InputType;
  required?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputStyles?: string;
};
