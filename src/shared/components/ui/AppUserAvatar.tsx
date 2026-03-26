import React, { useMemo } from "react";
import { Image, View } from "react-native";

type Props = {
  avatarUrl: string | undefined | null;
  size: number;
};

const FALLBACK =
  "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/avatars%2Ffallbacks%2Fuser.jpg?alt=media&token=8b9db7ec-7cfb-47a3-81d4-8eccbe121e84";

export const AppUserAvatar = ({ avatarUrl = FALLBACK, size = 56 }: Props) => {
  const displayAvatarUri = useMemo(() => {
    return avatarUrl || FALLBACK;
  }, [avatarUrl]);

  return (
    <View
      className="relative overflow-hidden border-2 rounded-full border-primary"
      style={{ width: size, height: size }}
    >
      <Image
        source={{ uri: displayAvatarUri }}
        resizeMode="contain"
        style={{ width: size, height: size }}
      />
    </View>
  );
};
