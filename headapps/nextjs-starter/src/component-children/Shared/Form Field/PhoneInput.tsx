import React, { useState } from 'react';
import { TextInput } from './TextInput';
import { useTranslation } from 'lib/hooks/useTranslation';

export const PhoneInput: React.FC<PhoneNumberInputProps> = ({
  onChange,
  label = 'Phone Number',
  disabled = false,
  value = '',
  placeholder = '(555) 555-5555',
  required = false,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState(false);
  const { t } = useTranslation();

  const validatePhone = (value: string) => {
    if (!value) return undefined;
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length !== 10 ? t('Please enter a valid 10-digit phone number') : undefined;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    const value = typeof e === 'string' ? e : e.target.value;
    if (value === '') {
      setPhoneNumber('');
      onChange('');
      setError(undefined);
      return;
    }
    if (!/^[\d\s()-]*$/.test(value)) return;

    const cleaned = value.replace(/\D/g, '');

    let formatted = cleaned;
    if (cleaned.length > 0) {
      formatted = `(${cleaned.slice(0, 3)}`;
      if (cleaned.length > 3) {
        formatted += `) ${cleaned.slice(3, 6)}`;
      }
      if (cleaned.length > 6) {
        formatted += `-${cleaned.slice(6, 10)}`;
      }
    }

    setPhoneNumber(formatted);
    onChange(cleaned);

    if (cleaned.length === 10) {
      setError(undefined);
    }
  };

  return (
    <TextInput
      type="tel"
      value={phoneNumber}
      onChange={handlePhoneChange}
      onBlur={() => touched && setError(validatePhone(phoneNumber))}
      onFocus={() => {
        setTouched(true);
        setError(validatePhone(phoneNumber));
      }}
      label={label}
      placeholder={placeholder}
      error={error}
      required={required}
      disabled={disabled}
    />
  );
};

type PhoneNumberInputProps = {
  onChange: (phoneNumber: string) => void;
  label?: string;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  required?: boolean;
};
