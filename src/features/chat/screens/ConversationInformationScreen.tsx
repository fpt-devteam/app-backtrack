import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { useConversationDetail } from "@/src/features/chat/hooks";
import { PostType } from "@/src/features/post/types";
import {
  AppButton,
  AppImage,
  AppLoader,
  AppUserAvatar,
} from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { formatDate } from "@/src/shared/utils";
import { ArchiveIcon, ChatDotsIcon } from "phosphor-react-native";
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import type { AppUser } from "@/src/features/auth/types";
import type { ConversationPartner } from "@/src/features/chat/types";
import type { Post } from "@/src/features/post/types";
import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import type { IconProps } from "phosphor-react-native";
import type { ComponentType } from "react";

const MOCK_AUTHOR: AppUser = {
  id: "mock-author-001",
  email: "owner@example.com",
  phone: null,
  displayName: "Alex Johnson",
  avatarUrl: "",
  globalRole: "user",
  showEmail: false,
  showPhone: false,
};

const MOCK_POST: Post = {
  id: "mock-post-001",
  postType: PostType.Lost,
  item: {
    itemName: "Blue Leather Backpack",
    category: "bags",
    color: "Blue",
    brand: "Herschel",
    condition: null,
    material: "Leather",
    size: null,
    distinctiveMarks: null,
    additionalDetails: null,
  },
  imageUrls: [
    "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2Fcasio-2.jpg?alt=media&token=9497f7df-d640-4bd7-bf88-6bbca36f27aa",
  ],
  description: "Lost near the park entrance",
  distinctiveMarks: null,
  organization: null,
  eventTime: new Date("2026-04-08T14:30:00"),
  createdAt: new Date("2026-04-08T14:30:00"),
  author: MOCK_AUTHOR,
  location: { latitude: 10.762622, longitude: 106.660172 },
  externalPlaceId: null,
  displayAddress: "District 1, Ho Chi Minh City",
};

const POST_TYPE_LABEL: Record<string, string> = {
  [PostType.Lost]: "Lost item",
  [PostType.Found]: "Found item",
};

const PostInfoCard = ({ post }: { post: Post }) => {
  const imgUrl = post.imageUrls?.[0];
  const typeLabel = POST_TYPE_LABEL[post.postType] ?? post.postType;
  const dateLabel = formatDate(post.eventTime.toISOString());

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(POST_ROUTE.details(post.id))}
      style={{
        borderWidth: 0.75,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      }}
      className="flex-row gap-md bg-surface rounded-2xl border border-divider p-lg"
    >
      <AppImage
        source={{ uri: imgUrl }}
        className="w-20 aspect-square rounded-xl bg-muted"
      />

      <View className="flex-1 gap-xs justify-center">
        <Text
          className="text-base font-semibold text-textPrimary"
          numberOfLines={2}
        >
          {post.item.itemName}
        </Text>
        <Text className="text-sm text-textSecondary" numberOfLines={1}>
          {typeLabel} · {dateLabel}
        </Text>
        {post.displayAddress ? (
          <Text className="text-sm text-textSecondary" numberOfLines={1}>
            {post.displayAddress}
          </Text>
        ) : null}
        <Text className="text-sm font-semibold text-textPrimary">
          Show details &gt;
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
      {/* Post Card section*/}
      <View className="gap-lg">
        <PostInfoCard post={MOCK_POST} />

        <View className="flex-row gap-md">
          <View className="flex-1">
            <AppButton onPress={() => {}} title="Decline" variant="outline" />
          </View>
          <View className="flex-1">
            <AppButton onPress={() => {}} title="Resolve" variant="secondary" />
          </View>
        </View>
      </View>
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
