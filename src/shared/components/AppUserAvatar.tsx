import React, { useMemo } from "react";
import { View } from "react-native";
import { AppImage } from "./AppImage";

type Props = {
  avatarUrl: string | undefined | null;
  size: number;
  borderRadius?: number;
};

const FALLBACK =
  "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/avatars%2Ffallbacks%2Fuser.jpg?alt=media&token=8b9db7ec-7cfb-47a3-81d4-8eccbe121e84";

export const AppUserAvatar = ({
  avatarUrl = FALLBACK,
  size = 56,
  borderRadius,
}: Props) => {
  const displayAvatarUri = useMemo(() => {
    return avatarUrl || FALLBACK;
  }, [avatarUrl]);

  return (
    <View
      className="relative overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: borderRadius ?? size / 2,
      }}
    >
      <AppImage
        url={displayAvatarUri}
        contentFit="contain"
        width={size}
        height={size}
      />
    </View>
  );
};
