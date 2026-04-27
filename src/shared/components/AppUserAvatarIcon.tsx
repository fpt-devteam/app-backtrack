import { useAppUser } from "@/src/features/auth/providers";
import { RelativePathString, router } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, View } from "react-native";

const FALLBACK_SOURCE = {
  uri: "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/avatars%2Ffallbacks%2Fuser.jpg?alt=media&token=8b9db7ec-7cfb-47a3-81d4-8eccbe121e84",
};

export const AppUserAvatarIcon = () => {
  const { user } = useAppUser();

  const source = useMemo(() => {
    const url = user?.avatarUrl?.trim();
    return url ? { uri: url } : FALLBACK_SOURCE;
  }, [user?.avatarUrl]);

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
