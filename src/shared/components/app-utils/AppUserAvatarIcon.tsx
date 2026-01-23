import { useAppUser } from "@/src/features/auth/providers";
import { RelativePathString, router } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, View } from "react-native";

const FALLBACK_SOURCE = { uri: "https://i.pravatar.cc/150?u=a04258a2462d826712d" };

export const AppUserAvatarIcon = () => {
  const { user } = useAppUser();

  const source = useMemo(() => {
    const url = user?.avatar?.trim();
    return url ? { uri: url } : FALLBACK_SOURCE;
  }, [user?.avatar]);

  const handlePress = () => {
    router.push("/profile" as RelativePathString);
  };

  return (
    <Pressable onPress={handlePress}>
      <View className="relative">
        <Image
          source={source}
          resizeMode="cover"
          className="w-8 h-8 rounded-full bg-gray-200"
        />
      </View>
    </Pressable>
  );
};