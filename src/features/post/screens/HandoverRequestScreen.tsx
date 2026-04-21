import { useAppUser } from "@/src/features/auth/providers";
import {
  useCreateDirectConversation,
  useSendMessage,
} from "@/src/features/chat/hooks";
import { useCreateC2CReturnReport } from "@/src/features/handover/hooks";
import { CreateC2CReturnReportRequest } from "@/src/features/handover/types";
import { PostStatusBadge } from "@/src/features/post/components";
import { useGetPostById } from "@/src/features/post/hooks";
import { PostType } from "@/src/features/post/types";
import {
  AppButton,
  AppInlineError,
  AppImage,
  AppLoader,
  AppUserAvatar,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { colors, metrics } from "@/src/shared/theme";
import { formatIsoDate } from "@/src/shared/utils/datetime.utils";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import {
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  SealCheckIcon,
} from "phosphor-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_MESSAGE_LENGTH = 300;

type Params = {
  postId: string;
};

const HandoverRequestScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAppUser();
  const { postId } = useLocalSearchParams<Params>();
  const { isLoading, data: post, error: postError } = useGetPostById({ postId });
  const { create: createConversation, isCreating: isCreatingConversation } =
    useCreateDirectConversation();
  const { sendMessage, isSendingMessage } = useSendMessage();
  const { isCreating, createC2CReturnReport } = useCreateC2CReturnReport();
  const [message, setMessage] = useState("");
  const [hasCreatedReturnReport, setHasCreatedReturnReport] = useState(false);
  const isSubmitting = isCreating || isCreatingConversation || isSendingMessage;
  const isSubmitDisabled = isSubmitting || !message.trim();

  const handleCreateReturnReport = async () => {
    if (!post || !user) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      const isFoundPost = post.postType === PostType.Found;

      const req: CreateC2CReturnReportRequest = {
        finderId: isFoundPost ? post.author.id : user.id,
        ownerId: isFoundPost ? user.id : post.author.id,
        finderPostId: isFoundPost ? post.id : undefined,
        ownerPostId: isFoundPost ? undefined : post.id,
        status: "Ongoing",
      };

      if (!hasCreatedReturnReport) {
        await createC2CReturnReport(req);
        setHasCreatedReturnReport(true);
      }

      try {
        const conversation = await createConversation({ memberId: post.author.id });
        const conversationId = conversation.data?.conversation?.conversationId;

        if (!conversationId) throw new Error("Missing conversation ID");

        await sendMessage({
          conversationId,
          request: { conversationId, type: "text", content: trimmedMessage },
        });

        toast.success("Send handover request successfully!");
      } catch {
        toast.warning(
          "Handover request sent",
          "Your message could not be delivered in chat. Try sending it again.",
        );
        return;
      }
    } catch {
      toast.error("Failed to send handover request.");
      return;
    }

    router.back();
  };

  const renderContent = () => {
    if (isLoading) return <AppLoader />;

    if (!post) {
      return (
        <View className="px-lg pt-lg">
          <AppInlineError message={postError?.message ?? "Failed to load post details."} />
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top + 44}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-lg pt-xl gap-xs">
            <Text className="text-2xl font-semibold text-textPrimary">
              Request handover
            </Text>
            <Text className="text-sm text-textSecondary leading-5">
              Send a short message so the other person can review your request
              and start coordinating the return.
            </Text>
          </View>

          {/* ── 1. Post Card ─────────────────────────────────── */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 40 }}
          >
            <View className="px-lg pt-xl pb-xl">
              <View
                className="flex-row gap-sm bg-surface rounded-2xl border border-divider p-md"
                style={{
                  ...(Platform.OS === "ios"
                    ? metrics.shadows.level1.ios
                    : metrics.shadows.level1.android),
                }}
              >
                <AppImage
                  source={{ uri: post.imageUrls[0] }}
                  className="w-24 rounded-xl aspect-square"
                  resizeMode="cover"
                />

                <View className="flex-1 gap-xs">
                  <View className="flex-row justify-between items-start gap-xs">
                    <Text
                      className="flex-1 text-base font-semibold text-textPrimary"
                      numberOfLines={2}
                    >
                      {post.item.itemName}
                    </Text>
                    <PostStatusBadge status={post.postType} />
                  </View>

                  <View className="gap-xxs">
                    <View className="flex-row items-center gap-xs">
                      <MapPinIcon
                        size={13}
                        color={colors.mutedForeground}
                        weight="regular"
                      />
                      <Text
                        className="flex-1 text-sm text-textSecondary"
                        numberOfLines={1}
                      >
                        {post.displayAddress}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-xs">
                      <ClockIcon
                        size={13}
                        color={colors.mutedForeground}
                        weight="regular"
                      />
                      <Text
                        className="flex-1 text-sm text-textSecondary"
                        numberOfLines={1}
                      >
                        {formatIsoDate(post.eventTime)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </MotiView>

          {/* ──  About the other person ────────────────────── */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 200 }}
          >
            <View className="px-lg py-xl gap-md">
              <View
                className="bg-surface border border-divider rounded-xl"
                style={{
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center gap-md p-md">
                  <View className="relative">
                    <AppUserAvatar
                      avatarUrl={post.author?.avatarUrl}
                      size={60}
                    />
                    <View className="absolute bottom-[-4] right-0 bg-primary rounded-full p-1 border border-surface">
                      <SealCheckIcon
                        size={12}
                        color={colors.white}
                        weight="fill"
                      />
                    </View>
                  </View>

                  <View className="flex-1 gap-xs">
                    <Text className="text-base font-semibold text-textPrimary">
                      {post.author?.displayName ?? "Anonymous"}
                    </Text>

                    <View className="gap-xxs">
                      <View className="flex-row items-center gap-xs">
                        <EnvelopeIcon
                          size={14}
                          color={colors.mutedForeground}
                        />
                        <Text
                          className="flex-1 text-sm text-textSecondary"
                          numberOfLines={1}
                        >
                          {post.author?.showEmail && post.author?.email
                            ? post.author.email
                            : "Email not available"}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-xs">
                        <PhoneIcon size={14} color={colors.mutedForeground} />
                        <Text
                          className="flex-1 text-sm text-textSecondary"
                          numberOfLines={1}
                        >
                          {post.author?.showPhone && post.author?.phone
                            ? post.author.phone
                            : "Phone not available"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </MotiView>

          {/* ── Your message ──────────────────────────────── */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 120 }}
          >
            <View className="px-lg gap-sm">
              <View className="gap-xs">
                <Text className="text-base font-semibold text-textPrimary">
                  Message
                </Text>
                <Text className="text-sm text-textSecondary leading-5">
                  Explain why this item may be yours or add meetup details to
                  help the other person review your request.
                </Text>
              </View>

              <View
                className="rounded-2xl border border-divider bg-surface"
                style={{ padding: metrics.spacing.md }}
              >
                <TextInput
                  value={message}
                  onChangeText={(t) => setMessage(t.slice(0, MAX_MESSAGE_LENGTH))}
                  placeholder="Example: I can describe the keychain attached to these keys, and I’m available near F-Town after 5 PM."
                  placeholderTextColor={colors.mutedForeground}
                  multiline
                  textAlignVertical="top"
                  cursorColor={colors.black}
                  style={{
                    minHeight: 96,
                    lineHeight: 22,
                    color: colors.text.primary,
                  }}
                />
              </View>

              <View className="flex-row justify-end">
                <Text className="text-sm text-textMuted">
                  {message.length}/{MAX_MESSAGE_LENGTH}
                </Text>
              </View>
            </View>
          </MotiView>

          <View className="px-lg pt-lg pb-md">
            <View className="rounded-2xl border border-divider bg-canvas px-md py-md2">
              <Text className="text-sm font-semibold text-textPrimary mb-xs">
                What happens next
              </Text>
              <Text className="text-sm text-textSecondary leading-5">
                If they accept, a draft handover will appear for both of you and
                you can continue coordinating the return in chat.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* ── Sticky Footer ──────────────────────────────────── */}
        <View
          className="bg-surface border-t border-divider px-lg pt-md"
          style={{ paddingBottom: insets.bottom + metrics.spacing.sm }}
        >
          <Text className="text-sm text-center text-textMuted mb-sm">
            The other person will review this request before the handover moves
            into coordination.
          </Text>
          <AppButton
            title="Send handover request"
            onPress={handleCreateReturnReport}
            loading={isSubmitting}
            disabled={isSubmitDisabled}
          />
        </View>
      </KeyboardAvoidingView>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Request handover",
          headerBackTitle: "Back",
        }}
      />
      <View className="flex-1 bg-surface">{renderContent()}</View>
    </>
  );
};

export default HandoverRequestScreen;
