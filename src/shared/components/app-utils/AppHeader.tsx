import { router } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import colors from "../../theme/colors";

type AppHeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightActionButton?: React.ReactNode;
};

const AppHeader = ({
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
      <Text className="text-xl font-bold text-black">
        {title}
      </Text>

      {rightActionButton || <View style={{ width: 24 }} />}
    </View>
  );
};

export default AppHeader;
