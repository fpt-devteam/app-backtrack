import { SimilarPost } from "@/src/features/post/types";
import { AppImage } from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { MapPinIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import ScoreBadge from "./ScoreBadge";

type SimilarPostCardProps = {
  matchPost: SimilarPost;
  onPress: () => void;
};

export const SimilarPostCard = ({
  matchPost,
  onPress,
}: SimilarPostCardProps) => {
  const imgUrl = matchPost.imageUrls?.[0];

  const safeTitle = useMemo(
    () => matchPost.postTitle || "Untitled item",
    [matchPost],
  );

  const safeAddress = useMemo(() => {
    if (matchPost.displayAddress?.trim()) return matchPost.displayAddress;
    return "Unknown location";
  }, [matchPost]);

  const safeScore = useMemo(() => {
    if (matchPost.score == null) return 0;
    return Math.round(matchPost.score * 100);
  }, [matchPost]);

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed ? 0.97 : 1 }}
          transition={{ type: "timing", duration: 150 }}
          className="bg-surface rounded-xl overflow-hidden"
          style={{
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
        >
          <View className="w-full" style={{ aspectRatio: 1 }}>
            <AppImage
              style={{ width: "100%", height: "100%" }}
              source={{ uri: imgUrl }}
            />

            <View style={{ position: "absolute", top: 6, right: 6 }}>
              <ScoreBadge value={safeScore} />
            </View>
          </View>

          <View
            className="absolute bottom-0 left-0 right-0 px-md pb-md2 gap-xs"
            style={{ paddingTop: 72 }}
          >
            <LinearGradient
              colors={[
                "rgba(0, 0, 0, 0.92)",
                "rgba(0, 0, 0, 0.68)",
                "rgba(0, 0, 0, 0.32)",
                "rgba(0, 0, 0, 0.12)",
                "transparent",
              ]}
              locations={[0, 0.3, 0.58, 0.8, 1]}
              pointerEvents="none"
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            />
            <Text
              className="text-base font-normal text-white"
              numberOfLines={1}
            >
              {safeTitle}
            </Text>

            <View className="flex-row items-center gap-xs">
              <MapPinIcon size={16} color={colors.primary} weight="fill" />
              <Text
                className="flex-1 text-sm text-white font-thin"
                numberOfLines={1}
              >
                {safeAddress}
              </Text>
            </View>
          </View>
        </MotiView>
      )}
    </Pressable>
  );
};
