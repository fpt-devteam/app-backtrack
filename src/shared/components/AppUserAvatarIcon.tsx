import { useAppUser } from "@/src/features/auth/providers";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { PROFILE_ROUTE } from "../constants";
import { FALLBACK_AVATAR_SOURCE } from "../data";
import { AppImage } from "./AppImage";

export const AppUserAvatarIcon = () => {
  const { user } = useAppUser();

  const source = useMemo(() => {
    const url = user?.avatarUrl?.trim();
    return { uri: url || FALLBACK_AVATAR_SOURCE };
  }, [user?.avatarUrl]);

  const handlePress = () => {
    router.navigate(PROFILE_ROUTE.index);
  };

  return (
    <Pressable onPress={handlePress}>
      <View className="relative">
        <AppImage
          source={source}
          contentFit="cover"
          style={{
            width: 28,
            aspectRatio: 1,
            borderRadius: 999,
          }}
        />
      </View>
    </Pressable>
  );
};
