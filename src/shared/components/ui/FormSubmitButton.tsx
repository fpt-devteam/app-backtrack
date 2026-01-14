import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

type FormSubmitButtonProps = {
  onPress: () => void;
  isLoading?: boolean;
  text: string;
};

const FormSubmitButton = ({
  onPress,
  isLoading = false,
  text
}: FormSubmitButtonProps) => {

  return (
    <View className="p-4 pb-0">
      <TouchableOpacity
        onPress={onPress}
        disabled={isLoading}
        className="h-12 items-center justify-center rounded-lg bg-primary"
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text className="text-base font-semibold text-white">{text}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default FormSubmitButton;
