import { useAppUser } from "@/src/features/auth/providers";
import { useCreateC2CReturnReport } from "@/src/features/handover/hooks";
import { CreateC2CReturnReportRequest } from "@/src/features/handover/types";
import { PostStatusBadge } from "@/src/features/post/components";
import { useGetPostById } from "@/src/features/post/hooks";
import { PostType } from "@/src/features/post/types";
import {
  AppButton,
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
  const { isLoading, data: post } = useGetPostById({ postId });
  const { isCreating, createC2CReturnReport } = useCreateC2CReturnReport();
  const [message, setMessage] = useState("");

  const handleCreateReturnReport = async () => {
    if (!post || !user) return;

    try {
      const isFoundLost = post.postType === PostType.Found;
      const finderId = isFoundLost ? post.author.id : user.id;
      

      console.log("userId: ", user.id);
      console.log("post author id: ", post.author.id);

      const req: CreateC2CReturnReportRequest = {
        finderId,
        status: "Draft",
      };

      await createC2CReturnReport(req);

      toast.success("Send handover request successfully!");
      router.back();
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to send handover request.");
    }
  };

  const renderContent = () => {
    if (isLoading || !post) return <AppLoader />;

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

          {/* ──  About the host ────────────────────────────── */}
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
            <View className="px-md gap-sm">
              <View
                className="rounded-md border bg-surface"
                style={{ padding: metrics.spacing.md }}
              >
                <TextInput
                  value={message}
                  onChangeText={(t) =>
                    setMessage(t.slice(0, MAX_MESSAGE_LENGTH))
                  }
                  placeholder="Tell the host why you're the right person to receive this item..."
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
        </ScrollView>

        {/* ── Sticky Footer ──────────────────────────────────── */}
        <View
          className="bg-surface border-t border-divider px-lg pt-md"
          style={{ paddingBottom: insets.bottom + metrics.spacing.sm }}
        >
          <Text className="text-sm text-center text-textMuted mb-sm">
            The host will be notified and can confirm the handover.
          </Text>
          <AppButton
            title="Send Request"
            onPress={handleCreateReturnReport}
            loading={isCreating}
            disabled={isCreating}
          />
        </View>
      </KeyboardAvoidingView>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Handover Request",
          headerBackTitle: "Back",
        }}
      />
      <View className="flex-1 bg-surface">{renderContent()}</View>
    </>
  );
};

export default HandoverRequestScreen;
