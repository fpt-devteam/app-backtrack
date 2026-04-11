import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  onPress: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  loading?: boolean;
};

const DOT_DELAYS = [0, 150, 300];

export const TouchableIconButton = ({
  onPress,
  icon,
  disabled,
  loading,
}: Props) => {
  const isDisabled = disabled || loading;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      hitSlop={8}
      className="items-center justify-center"
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.9 : 1,
      })}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <View className="flex-row items-center gap-1.5">
          {DOT_DELAYS.map((delay) => (
            <MotiView
              key={`loading-dot-${delay}`}
              from={{ translateY: 0, opacity: 0.65 }}
              animate={{ translateY: -6, opacity: 1 }}
              transition={{
                type: "timing",
                duration: 360,
                delay,
                loop: true,
                repeatReverse: true,
              }}
              className="h-1.5 w-1.5 rounded-full bg-primary"
            />
          ))}
        </View>
      ) : (
        icon
      )}
    </Pressable>
  );
};
