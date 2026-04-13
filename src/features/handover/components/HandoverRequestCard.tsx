import { Handover } from "@/src/features/handover/types";
import { colors } from "@/src/shared/theme";
import { CalendarBlankIcon, CheckIcon, XIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  handover: Handover;
};

const MOCK_IMAGE =
  "https://hips.hearstapps.com/hmg-prod/images/most-popular-dog-breeds-kerry-blue-terrier-68096bdb872b7.jpg?crop=0.668xw:1.00xh;0.0833xw,0";

const MOCK_AVATAR_IMAGE =
  "https://hips.hearstapps.com/clv.h-cdn.co/assets/16/18/gettyimages-586890581.jpg?crop=0.668xw:1.00xh;0.219xw,0";

const MOCK_TITLE = "Vintage Woasfasfasdfasdfasdfasdfasdfoden Chair";

const MOCK_SUBTITLE =
  "John Doe, I want to return this item because it is not as described. The item is in good condition and I have all the original packaging.";

export const HandoverRequestCard = ({ handover }: Props) => {
  const imageUrl = useMemo(() => {
    return MOCK_IMAGE;
  }, [handover]);

  const avartaImageUrl = useMemo(() => {
    return MOCK_AVATAR_IMAGE;
  }, [handover]);

  const displayUsername = useMemo(() => {
    return MOCK_TITLE;
  }, [handover]);

  const displayEventDate = useMemo(() => {
    const eventDate = new Date(handover.createdAt);
    return eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [handover]);

  return (
    <View className="flex-row items-center gap-md py-md border-b border-divider">
      {/* Post Image & Avatar */}
      <View className="relative ">
        <Image
          source={{ uri: imageUrl }}
          className="w-20 aspect-square rounded-lg"
        />

        <Image
          source={{ uri: avartaImageUrl }}
          className="absolute bottom-[-12] right-[-8] w-12 aspect-square rounded-full border-2 border-white"
        />
      </View>

      {/* Post Information */}
      <View className="flex-1 flex-col gap-xs">
        <Text className="font-normal" numberOfLines={1}>
          {displayUsername}
        </Text>

        <Text
          className="font-thin text-sm text-textSecondary"
          numberOfLines={2}
        >
          {MOCK_SUBTITLE}
        </Text>

        {/* Event Date */}
        <View className="flex-row gap-xs">
          <CalendarBlankIcon size={12} color={colors.text.muted} />
          <Text className="font-thin text-xs text-textSecondary">
            {displayEventDate}
          </Text>
        </View>
      </View>

      {/* Button Actions */}
      <View className="flex-row gap-sm">
        <Pressable
          className="p-xs rounded-full border"
          style={{
            borderColor: colors.status.error,
          }}
        >
          <XIcon size={16} color={colors.status.error} />
        </Pressable>

        <Pressable
          className="p-xs rounded-full border"
          style={{
            borderColor: colors.status.success,
          }}
        >
          <CheckIcon size={16} color={colors.status.success} />
        </Pressable>
      </View>
    </View>
  );
};
