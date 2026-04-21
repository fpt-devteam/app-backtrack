import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { useConversationDetail } from "@/src/features/chat/hooks";
import { getHandoverCounterpart, getHandoverNextStep, getHandoverStatusLabel, getHandoverTitle, getViewerRoleContext } from "@/src/features/handover/components/handover.presentation";
import { useGetC2CReturnReportsByPartner } from "@/src/features/handover/hooks";
import type { Handover, ReturnReportStatus } from "@/src/features/handover/types";
import { AppImage, AppLoader, AppUserAvatar } from "@/src/shared/components";
import { HANDOVER_ROUTE } from "@/src/shared/constants";
import { ArchiveIcon, CaretRightIcon, ChatDotsIcon } from "phosphor-react-native";
import React, { useCallback } from "react";
import { InteractionManager, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

import type { AppUser } from "@/src/features/auth/types";
import type { ConversationPartner } from "@/src/features/chat/types";
import { colors, metrics } from "@/src/shared/theme";
import { router } from "expo-router";
import type { IconProps } from "phosphor-react-native";
import type { ComponentType } from "react";

const STATUS_THEME: Record<ReturnReportStatus, { bg: string; text: string }> = {
  Ongoing:   { bg: colors.kazan[100], text: colors.kazan[600] },
  Delivered: { bg: colors.info[100],  text: colors.info[500] },
  Confirmed: { bg: colors.babu[100],  text: colors.babu[500] },
  Rejected:  { bg: colors.error[100], text: colors.error[500] },
  Closed:    { bg: colors.hof[100],   text: colors.hof[400] },
};

const HandoverInfoCard = ({ handover }: { handover: Handover }) => {
  const { user } = useAppUser();
  const currentUserId = user?.id;

  const counterpart = getHandoverCounterpart(handover, currentUserId);
  const title = getHandoverTitle(handover);
  const statusLabel = getHandoverStatusLabel(handover.status);
  const nextStep = getHandoverNextStep(handover, currentUserId);
  const roleContext = getViewerRoleContext(handover, currentUserId);

  const imageUrl =
    handover.finderPost?.imageUrls?.[0] ?? handover.ownerPost?.imageUrls?.[0];

  const handlePress = useCallback(() => {
    // Dismiss the info modal first, then navigate once the dismiss animation
    // has fully completed — prevents two competing animations playing at once.
    router.dismiss();
    InteractionManager.runAfterInteractions(() => {
      router.push(HANDOVER_ROUTE.detail(handover.id));
    });
  }, [handover.id]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.84}
      className="flex-row items-center gap-md rounded-2xl bg-surface px-md py-md2 mb-md2 border border-divider"
      style={
        Platform.OS === "ios"
          ? metrics.shadows.level1.ios
          : metrics.shadows.level1.android
      }
    >
      <View className="relative">
        <AppImage
          source={{ uri: imageUrl }}
          style={{ width: 72, height: 72, borderRadius: 14 }}
          resizeMode="cover"
        />

        {counterpart && (
          <View
            className="absolute bottom-[-4] right-[-4]"
            style={{
              borderWidth: 2,
              borderColor: colors.white,
              borderRadius: 10,
            }}
          >
            <AppUserAvatar avatarUrl={counterpart.avatarUrl} size={26} borderRadius={8} />
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text
          className="text-sm font-semibold text-textPrimary"
          numberOfLines={1}
        >
          {title}
        </Text>

        <View className="flex-row items-center gap-xs flex-wrap">
          <View
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: STATUS_THEME[handover.status].bg }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: STATUS_THEME[handover.status].text }}
            >
              {statusLabel}
            </Text>
          </View>

          {counterpart?.displayName ? (
            <Text className="text-xs text-textSecondary" numberOfLines={1}>
              with {counterpart.displayName}
            </Text>
          ) : null}
        </View>

        <Text
          className="text-sm font-medium text-textPrimary mt-sm"
          numberOfLines={1}
        >
          {nextStep}
        </Text>

        <View className="gap-xs">
          <Text className="text-xs text-textMuted" numberOfLines={1}>
            {roleContext}
          </Text>
        </View>
      </View>

      <CaretRightIcon size={16} color={colors.text.muted} />
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
