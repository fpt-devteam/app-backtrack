import { Eye, EyeSlash, Lock } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type PasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PasswordField = ({
  value,
  onChange,
  error
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text className="mb-2 text-base font-medium text-label">Password</Text>
      <View className={`flex-row gap-2 items-center rounded-lg border bg-white px-3 py-3 ${error ? "border-error" : "border-slate-200"}`}>
        <Lock
          size={20}
          color={error ? "#dc2626" : "#70819a"}
        />

        <TextInput
          className="flex-1 text-input"
          placeholder="***********"
          placeholderTextColor="#a0a9b8"
          clearTextOnFocus={true}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={onChange}
        />

        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          hitSlop={12}
        >
          {showPassword ? (
            <Eye size={20} color={error ? "#dc2626" : "#70819a"} />
          ) : (
            <EyeSlash size={20} color={error ? "#dc2626" : "#70819a"} />
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View className="flex-row items-center mt-1.5 px-1">
          <Text className="text-sm text-error">{error}</Text>
        </View>
      )}
    </View>
  )
}


