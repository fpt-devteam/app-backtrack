import type { AppUser } from "@/src/features/auth/types";
import type { ConversationPartner } from "@/src/features/chat/types";
import { AppUserAvatar, TouchableIconButton } from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

type Props = {
  partner: AppUser | ConversationPartner | null;
};

export const ConversationHeader = ({ partner }: Props) => {
  const router = useRouter();

  const displayPartnerName = useMemo(() => {
    return partner?.displayName || "Unknown User";
  }, [partner]);

  const displayPartnerAvatar = useMemo(() => {
    if (!partner) return null;
    return "avatarUrl" in partner ? partner.avatarUrl : partner.avatarUrl;
  }, [partner]);

  const handleNavigateBack = () => {
    router.back();
  };

  return (
    <View className="bg-white border-b border-slate-200 px-4 py-3">
      <View className="flex-row items-center gap-2">
        {/* Left: Back */}
        <TouchableIconButton
          onPress={handleNavigateBack}
          icon={<ArrowLeftIcon size={24} color={colors.primary} />}
        />

        {/* Center: Avatar + Name (takes remaining space) */}
        <View className="flex-1 flex-row items-center min-w-0">
          <AppUserAvatar avatarUrl={displayPartnerAvatar} size={40} />

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
      </View>
    </View>
  );
};
