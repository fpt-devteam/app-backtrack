import { Envelope } from 'phosphor-react-native';
import React from 'react';
import { Text, TextInput, View } from 'react-native';

type EmailFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string
}

export const EmailField = ({ value, onChange, error }: EmailFieldProps) => {
  return (
    <View>
      <Text className="mb-2 text-base font-medium text-label">Email</Text>
      <View className={`flex-row gap-2 items-center rounded-lg border bg-white px-3 py-3 ${error ? "border-error" : "border-slate-200"}`}>
        <Envelope
          size={20}
          color={error ? "#dc2626" : "#70819a"}
        />

        <TextInput
          className="flex-1 text-input"
          placeholder="user@example.com"
          placeholderTextColor="#a0a9b8"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={onChange}
        />
      </View>

      {error && (
        <View className="flex-row items-center mt-1.5 px-1">
          <Text className="text-sm text-error">{error}</Text>
        </View>
      )}
    </View>
  )
}


