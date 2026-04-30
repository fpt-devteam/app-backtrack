import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { useConversationDetail } from "@/src/features/chat/hooks";
import { useGetC2CReturnReportsByPartner } from "@/src/features/handover/hooks";
import { AppLoader, AppUserAvatar } from "@/src/shared/components";
import { ArchiveIcon, ChatDotsIcon } from "phosphor-react-native";
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import type { AppUser } from "@/src/features/auth/types";
import type { ConversationPartner } from "@/src/features/chat/types";
import { HandoverCard } from "@/src/features/handover/components";
import { colors } from "@/src/shared/theme";
import type { IconProps } from "phosphor-react-native";
import type { ComponentType } from "react";

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

type Props = {
  conversationId: string;
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
      contentContainerClassName="px-lg pb-xl"
    >
      {/* Handover section — only shown when in-progress handovers exist */}
      {!isHandoverLoading && inProgressHandovers.length > 0 && (
        <View className="mt-xl">
          <SectionHeader title="Handovers" />
          <View className="gap-md">
            {inProgressHandovers.map((handover) => (
              <HandoverCard key={handover.id} handover={handover} />
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
