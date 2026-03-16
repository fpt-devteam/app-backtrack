import type { AppUser } from "@/src/features/auth/types";
import { ConversationAvatar } from "@/src/features/chat/components/ConversationAvatar";
import type { ConversationPartner } from "@/src/features/chat/types";
import { colors } from "@/src/shared/theme";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, DotsThreeOutlineIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

interface ConversationHeaderProps {
  user: AppUser | ConversationPartner | null;
  onPressMenu?: () => void;
}

export const ConversationHeader = ({
  user,
  onPressMenu,
}: ConversationHeaderProps) => {
  const router = useRouter();

  const displayPartnerName = useMemo(
    () => user?.displayName || "Chat",
    [user?.displayName],
  );

  return (
    <View className="bg-white border-b border-slate-200 px-4 py-3">
      <View className="flex-row items-center">
        {/* Left: Back */}
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          className="w-10 h-10 items-center justify-center -ml-1 mr-2"
        >
          <ArrowLeftIcon size={24} color={colors.slate[600]} />
        </Pressable>

        {/* Center: Avatar + Name (takes remaining space) */}
        <View className="flex-1 flex-row items-center min-w-0">
          <ConversationAvatar user={user} size={40} />

          <View className="ml-3 flex-1 min-w-0">
            <Text
              className="text-base font-semibold text-slate-900"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {displayPartnerName}
            </Text>

            <Text className="text-xs text-slate-500" numberOfLines={1}>
              Active now
            </Text>
          </View>
        </View>

        {/* Right: Menu */}
        <Pressable
          onPress={onPressMenu}
          hitSlop={10}
          className="w-10 h-10 items-center justify-start ml-2"
        >
          <DotsThreeOutlineIcon
            size={28}
            weight="duotone"
            color={colors.slate[700]}
          />
        </Pressable>
      </View>
    </View>
  );
};
