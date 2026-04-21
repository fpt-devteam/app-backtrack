import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { useConversationDetail } from "@/src/features/chat/hooks";
import { getHandoverStatusLabel } from "@/src/features/handover/components/handover.presentation";
import { useGetC2CReturnReportsByPartner } from "@/src/features/handover/hooks";
import type { Handover } from "@/src/features/handover/types";
import { AppImage, AppLoader, AppUserAvatar } from "@/src/shared/components";
import { HANDOVER_ROUTE } from "@/src/shared/constants";
import { formatDate } from "@/src/shared/utils";
import { ArchiveIcon, ChatDotsIcon } from "phosphor-react-native";
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import type { AppUser } from "@/src/features/auth/types";
import type { ConversationPartner } from "@/src/features/chat/types";
import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import type { IconProps } from "phosphor-react-native";
import type { ComponentType } from "react";

const HandoverInfoCard = ({ handover }: { handover: Handover }) => {
  const imgUrl =
    handover.finderPost?.imageUrls?.[0] ??
    handover.ownerPost?.imageUrls?.[0];
  const title =
    handover.finderPost?.postTitle ??
    handover.ownerPost?.postTitle ??
    "Handover";
  const statusLabel = getHandoverStatusLabel(handover.status);
  const dateLabel = formatDate(handover.createdAt);

  const handlePress = useCallback(() => {
    router.dismiss();
    router.push(HANDOVER_ROUTE.detail(handover.id));
  }, [handover.id]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={{
        borderWidth: 0.75,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      }}
      className="flex-row gap-md bg-surface rounded-2xl border border-divider p-md"
    >
      <AppImage
        source={{ uri: imgUrl }}
        className="w-20 aspect-square rounded-xl bg-muted"
      />
      <View className="flex-1 gap-xs justify-center">
        <Text
          className="text-base font-semibold text-textPrimary"
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text className="text-sm text-textSecondary" numberOfLines={1}>
          {statusLabel} · {dateLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

type ParticipantRowProps = {
  avatarUrl: string | null;
  name: string;
  role: string;
  isLast?: boolean;
};

const ParticipantRow = ({
  avatarUrl,
  name,
  role,
  isLast = false,
}: ParticipantRowProps) => (
  <View
    className={`flex-row items-center gap-md py-md ${!isLast ? "border-b border-divider" : ""}`}
  >
    <AppUserAvatar avatarUrl={avatarUrl} size={48} />
    <View className="flex-1 gap-xs">
      <Text className="text-base font-thin text-textPrimary">{name}</Text>
      <Text className="text-sm font-thin text-textSecondary">{role}</Text>
    </View>
  </View>
);

type ActionRowProps = {
  icon: ComponentType<IconProps>;
  label: string;
  onPress: () => void;
  isLast?: boolean;
};

const ActionRow = ({
  icon: Icon,
  label,
  onPress,
  isLast = false,
}: ActionRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.3}
    className={`flex-1 flex-row items-center gap-md py-md ${!isLast ? "border-b border-divider" : ""}`}
  >
    <Icon size={28} color={colors.black} />
    <Text className="text-base  font-thin text-textPrimary">{label}</Text>
  </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text className="text-lg font-normal text-textPrimary mb-sm">{title}</Text>
);

type Props = {
  conversationId: string;
};

const getParticipantInfo = (
  participant: AppUser | ConversationPartner | null | undefined,
  fallbackName: string,
): { name: string; avatarUrl: string | null } => {
  if (!participant) return { name: fallbackName, avatarUrl: null };

  return {
    name: participant.displayName ?? fallbackName,
    avatarUrl:
      "avatarUrl" in participant ? (participant.avatarUrl ?? null) : null,
  };
};

const ConversationInformationScreen = ({ conversationId }: Props) => {
  const { user } = useAppUser();
  const { data: conversation, isLoading } =
    useConversationDetail(conversationId);

  const partner = conversation?.partner;

  const { inProgressHandovers, isLoading: isHandoverLoading } =
    useGetC2CReturnReportsByPartner(partner?.id);

  const currentUser = getParticipantInfo(user, "You");
  const partnerInfo = getParticipantInfo(partner, "Unknown User");

  const handleMarkAsUnread = useCallback(() => {
    // TODO: Implement mark as unread
  }, []);

  const handleArchive = useCallback(() => {
    // TODO: Implement archive
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <AppLoader />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerClassName="px-lg pt-md pb-xl"
    >
      {/* Handover section — only shown when in-progress handovers exist */}
      {!isHandoverLoading && inProgressHandovers.length > 0 && (
        <View className="mt-xl">
          <SectionHeader title="Handover" />
          <View className="gap-md">
            {inProgressHandovers.map((handover) => (
              <HandoverInfoCard key={handover.id} handover={handover} />
            ))}
          </View>
        </View>
      )}

      {/* People in this conversation */}
      <View className="mt-xl">
        <SectionHeader title="In this conversation" />
        <ParticipantRow
          avatarUrl={currentUser.avatarUrl}
          name={currentUser.name}
          role="Owner"
        />
        <ParticipantRow
          avatarUrl={partnerInfo.avatarUrl}
          name={partnerInfo.name}
          role="Finder"
          isLast
        />
      </View>

      {/* Conversation actions */}
      <View className="mt-xl">
        <SectionHeader title="Conversation actions" />
        <ActionRow
          icon={ChatDotsIcon}
          label="Mark as unread"
          onPress={handleMarkAsUnread}
        />
        <ActionRow
          icon={ArchiveIcon}
          label="Archive"
          onPress={handleArchive}
          isLast
        />
      </View>
    </ScrollView>
  );
};

export default ConversationInformationScreen;
