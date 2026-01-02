import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type ConfirmPasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const ConfirmPasswordField = ({
  value,
  onChange,
  error
}: ConfirmPasswordFieldProps) => {
  const [show, setShow] = useState(false);

  return (
    <View>
      <Text className="mb-2 text-base font-medium text-label">Confirm Password</Text>
      <View className={`flex-row gap-2 items-center rounded-lg border bg-white px-3 py-3 ${error ? "border-error" : "border-slate-200"}`}>
        <Ionicons
          name="checkmark-circle-outline"
          size={20}
          color={error ? "#dc2626" : "#70819a"}
        />

        <TextInput
          className="flex-1 text-input"
          placeholder="***********"
          placeholderTextColor="#a0a9b8"
          clearTextOnFocus={true}
          secureTextEntry={!show}
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={onChange}
        />

        <TouchableOpacity
          onPress={() => setShow((prev) => !prev)}
          hitSlop={12}
        >
          <Ionicons
            name={show ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={error ? "#dc2626" : "#70819a"}
          />
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

export default ConfirmPasswordField
