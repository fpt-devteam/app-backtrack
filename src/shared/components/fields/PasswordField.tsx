import { BaseInputField } from "@/src/shared/components/fields/BaseInputField";
import React from "react";

type PasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
};

export const PasswordField = ({ value, onChange, onBlur, error }: PasswordFieldProps) => {
  return (
    <BaseInputField
      label="Password"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      textContentType="password"
      autoComplete="password"
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="next"
      secureTextEntry
    />
  );
};
