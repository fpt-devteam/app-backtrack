import { router } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import colors from "@/src/shared/theme/colors";
import { cn } from "@/src/shared/utils/cn";

type AppHeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightActionButton?: React.ReactNode;
};

export const AppHeader = ({
  title,
  showBackButton = true,
  onBackPress,
  rightActionButton
}: AppHeaderProps) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      {/* Back Button */}
      {showBackButton && (
        <Pressable
          onPress={handleBackPress}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            top: 12
          })}
        >
          <ArrowLeftIcon size={24} color={colors.black} weight="bold" />
        </Pressable>
      )}

      {/* Centered Title */}
      <Text className="text-3xl font-bold text-black">
        {title}
      </Text>

      {rightActionButton || <View style={{ width: 24 }} />}
    </View>
  );
};



export const DefaultTopRightActionButton = ({ lable, onPress, disabled, isSubmitting }: { lable: string; onPress: () => void; disabled?: boolean; isSubmitting?: boolean }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => ({
      opacity: pressed ? 0.5 : 1,
      top: 12
    })}
  >
    {isSubmitting ? (
      <ActivityIndicator />
    ) : (
      <Text className={cn("text-base font-semibold", disabled ? "text-gray-400" : "text-default")}> {lable}</Text>
    )}
  </Pressable>
);