import { useAppUser } from "@/src/features/auth/providers";
import * as Haptics from "expo-haptics";
import { PlusCircleIcon } from "phosphor-react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { Animated, Easing, Image, Pressable, Text, View } from "react-native";

type Props = {
  onPress?: () => void;
};

const FALLBACK_AVATAR = {
  uri: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
};

export const StartChatChip = ({ onPress }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { user } = useAppUser();

  const avatarSource = useMemo(() => {
    const url = user?.avatar?.trim();
    return url ? { uri: url } : FALLBACK_AVATAR;
  }, [user?.avatar]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  const animateTo = (toValue: number) => {
    Animated.timing(scale, {
      toValue,
      duration: 120,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => animateTo(0.95)}
      onPressOut={() => animateTo(1)}
      hitSlop={8}
    >
      <Animated.View
        className="items-center mr-4"
        style={{
          transform: [{ scale }],
        }}
      >
        {/* Avatar with Plus Icon */}
        <View className="relative" style={{ width: 80, height: 80 }}>
          {/* Avatar Background */}
          <Image
            source={avatarSource}
            resizeMode="cover"
            className="rounded-full border-2 border-primary"
            style={{ width: 80, height: 80 }}
          />

          {/* Plus Icon Overlay - Bottom Right */}
          <View
            className="absolute rounded-full bg-primary items-center justify-center"
            style={{
              width: 28,
              height: 28,
              bottom: -2,
              right: -2,
            }}
          >
            <PlusCircleIcon size={24} color="#fff" weight="fill" />
          </View>
        </View>

        {/* Name */}
        <Text
          className="text-xs font-sm text-slate-600 mt-2 text-center"
          numberOfLines={1}
        >
          Start Chat
        </Text>
      </Animated.View>
    </Pressable>
  );
};
