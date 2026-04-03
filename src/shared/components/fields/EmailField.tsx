import { BaseInputField } from "@/src/shared/components/fields/BaseInputField";
import React from "react";

type EmailFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
};

export const EmailField = ({ value, onChange, onBlur, error }: EmailFieldProps) => {
  return (
    <BaseInputField
      label="Email"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      keyboardType="email-address"
      textContentType="emailAddress"
      autoComplete="email"
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="next"
    />
  );
};
