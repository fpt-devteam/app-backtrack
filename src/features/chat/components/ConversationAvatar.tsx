import { AppUser } from "@/src/features/auth/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  user: AppUser;
  size?: number;
};

const DEFAULT_AVATAR =
  "https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/461683548_1198517481229015_7424090049580943653_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGe4R0rAZ6KizCMf6s98VjLahJcSXqrbwlqElxJeqtvCbDHLiAfR6FBJIIbMsp53IAbXnG0j-jB-b0IhKIvy9Z5&_nc_ohc=VD-VwwX0dBwQ7kNvwEpHUJ8&_nc_oc=AdlL7o1kKWZZhJZLCx0eGZBbcgyr4DaAASzF5to0OMSIx4ZHOOEyZxpIwd3SVXZPcnraQoP__rzyLiLt1CBWtgrN&_nc_zt=23&_nc_ht=scontent.fsgn2-4.fna&_nc_gid=-aGvD83TF5Vyg92ltrto5g&oh=00_Afpe4dokC0iJhMxNhy_ifiQz4LAZxMabQBmck3_dgNvo4Q&oe=697B65D5";

export const ConversationAvatar = ({ user, size = 64 }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  const displayAvatar = useMemo(() => {
    if (user.avatar && user.avatar.trim() !== "") return user.avatar;
    return DEFAULT_AVATAR;
  }, [user.avatar]);

  useEffect(() => {
    setIsLoading(true);
  }, [displayAvatar]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <View
      className="relative overflow-hidden border-2 rounded-full border-primary"
      style={{ width: size, height: size }}
    >
      {isLoading && (
        <View className="absolute inset-0 z-10 rounded-full overflow-hidden">
          <ConversationAvatarSkeleton size={size} />
        </View>
      )}

      <Image
        source={{ uri: displayAvatar }}
        resizeMode="cover"
        style={{ width: size, height: size }}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />
    </View>
  );
};

export const ConversationAvatarSkeleton = ({
  size: _size = 64,
}: {
  size?: number;
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#e2e8f0",
      }}
    >
      <Animated.View
        style={[
          {
            width: "100%",
            height: "100%",
            backgroundColor: "#f1f5f9",
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};
