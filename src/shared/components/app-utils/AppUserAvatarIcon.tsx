import { useAppUser } from "@/src/features/auth/providers";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Image, ImageSourcePropType, Pressable, View } from "react-native";

const FALLBACK_AVATAR = require("@/assets/images/fallback_avatar.png");

const AppUserAvatarIcon = () => {
  const { user } = useAppUser();

  const source: ImageSourcePropType = useMemo(() => {
    const url = user?.avatar?.trim();
    return url ? { uri: url } : FALLBACK_AVATAR;
  }, [user?.avatar]);

  return (
    <Pressable
      onPress={() => {
        router.push("/(profile)");
        console.log("Move to profile screen");
      }}
    >
      <View className="relative">
        <View className="rounded-full">
          <Image
            source={source}
            resizeMode="cover"
            className="rounded-full"
            style={{ width: 36, height: 36 }}
          />
        </View>

        <View className="absolute -left-0.5 -bottom-0.5">
          <View className="h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
        </View>
      </View>
    </Pressable>
  );
};

export default AppUserAvatarIcon;
