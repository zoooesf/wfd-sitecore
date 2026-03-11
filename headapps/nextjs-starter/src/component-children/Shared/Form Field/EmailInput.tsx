import React, { useState } from 'react';
import { TextInput } from './TextInput';
import { useTranslation } from 'lib/hooks/useTranslation';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const EmailInput: React.FC<EmailInputProps> = ({
  onEmailChange,
  label,
  disabled = false,
  value = '',
  placeholder = 'example@domain.com',
  required = false,
}) => {
  const [email, setEmail] = useState(value);
  const [error, setError] = useState<string>();
  const { t } = useTranslation();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    const value = typeof e === 'string' ? e : e.target.value;
    setEmail(value);
    onEmailChange(value);

    if (error && isValidEmail(value)) {
      setError(undefined);
    }
  };

  const handleBlur = () => {
    if (email === '') {
      setError(undefined);
      return;
    }
    if (!isValidEmail(email)) {
      setError(t('Please enter a valid email address'));
    } else {
      setError(undefined);
    }
  };

  const inputLabel = label || t('Email Address');

  return (
    <TextInput
      type="email"
      value={email}
      onChange={handleEmailChange}
      onBlur={handleBlur}
      label={inputLabel}
      placeholder={placeholder}
      error={error}
      required={required}
      disabled={disabled}
    />
  );
};

type EmailInputProps = {
  onEmailChange: (email: string) => void;
  label?: string;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  required?: boolean;
};
