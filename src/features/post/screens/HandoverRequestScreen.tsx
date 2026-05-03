import { useAppUser } from "@/src/features/auth/providers";
import {
  useCreateDirectConversation,
  useSendMessage,
} from "@/src/features/chat/hooks";
import { useCreateC2CReturnReport } from "@/src/features/handover/hooks";
import { MyPostCard, PostFormTextArea } from "@/src/features/post/components";
import { useGetPostById } from "@/src/features/post/hooks";
import { PostType } from "@/src/features/post/types";
import {
  AppBackButton,
  AppButton,
  AppInlineError,
  AppLoader,
  AppTipCard,
  AppUserAvatar,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { colors, metrics, typography } from "@/src/shared/theme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { SealCheckIcon } from "phosphor-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextStyle,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Params = {
  postId: string;
  otherPostId: string;
};

export default function HandoverRequestScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAppUser();
  const { postId, otherPostId } = useLocalSearchParams<Params>();

  const {
    isLoading,
    data: otherPost,
    error: postError,
  } = useGetPostById({ postId: otherPostId });

  const { isCreating, createC2CReturnReport } = useCreateC2CReturnReport();

  const { create, isCreating: isCreatingConversation } =
    useCreateDirectConversation();
  const { sendMessage, isSendingMessage } = useSendMessage();
  const [message, setMessage] = useState("");
  const isSubmitting = isCreating || isCreatingConversation || isSendingMessage;
  const isSubmitDisabled = isSubmitting || !message.trim();

  const handleCreateReturnReport = async () => {
    if (!otherPost || !user) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      const isFoundPost = otherPost.postType === PostType.Found;
      const finderPostId = isFoundPost ? otherPostId : postId;
      const ownerPostId = isFoundPost ? postId : otherPostId;

      const req = {
        finderPostId,
        ownerPostId,
      };

      const res = await createC2CReturnReport(req);

      const conversation = await create({
        memberId: otherPost.author.id,
      });

      const conversationId = conversation.data?.conversation?.conversationId;
      if (!conversationId) throw new Error("Missing conversation ID");

      await sendMessage({
        conversationId,
        request: { conversationId, type: "text", content: trimmedMessage },
      });

      if (res) {
        router.back();
        toast.success("Handover request sent successfully!");
      } else {
        toast.error("Failed to create handover request.");
      }
    } catch {
      toast.error("Failed to send handover request.");
      return;
    }
  };

  const renderContent = () => {
    if (isLoading) return <AppLoader />;

    if (!otherPost) {
      return (
        <View className="px-lg pt-lg">
          <AppInlineError
            message={postError?.message ?? "Failed to load post details."}
          />
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
          contentContainerStyle={{
            gap: metrics.spacing.lg,
            paddingTop: metrics.spacing.lg,
            paddingBottom: insets.bottom + 80,
            paddingHorizontal: metrics.spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-xs">
            <Text className="text-xl font-normal text-textPrimary">
              Request handover
            </Text>
            <Text className="text-sm font-thin text-textSecondary leading-5">
              Send a short message so the other person can review your request
              and start coordinating the return.
            </Text>
          </View>

          {/* Post Card */}
          <MyPostCard item={otherPost} />

          {/* Post Owner Information */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 320 }}
            className="gap-sm"
          >
            <Text className="text-lg font-normal text-textPrimary">
              Your host
            </Text>

            <View className="flex-row items-center gap-md">
              <AppUserAvatar
                avatarUrl={otherPost.author?.avatarUrl}
                size={metrics.spacing["2xl"]}
              />

              <View className="flex-1 flex-col gap-xs justify-between">
                <Text className="text-base text-textPrimary" numberOfLines={1}>
                  {otherPost.author.displayName}
                </Text>

                {/* Verified rows*/}
                <View
                  className="flex-row items-center self-start gap-xs rounded-full px-sm py-xs"
                  style={{
                    backgroundColor: colors.babu[100],
                  }}
                >
                  <SealCheckIcon
                    size={12}
                    color={colors.babu[500]}
                    weight="fill"
                  />
                  <Text
                    className="text-xs font-normal"
                    style={{ color: colors.babu[600] }}
                  >
                    Verified
                  </Text>
                </View>
              </View>
            </View>
          </MotiView>

          {/* Your message */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 120 }}
            className="gap-sm"
          >
            <Text className="text-lg font-normal text-textPrimary">
              Message
            </Text>

            <PostFormTextArea
              onChange={setMessage}
              value={message}
              placeholder="Example: I can describe the keychain attached to these keys, and I’m available near F-Town after 5 PM."
            />
          </MotiView>

          {/* Info Card  */}
          <AppTipCard
            title="What happens next"
            description="If they accept, a draft handover will appear for both of you and you can continue coordinating the return in chat."
            type="info"
          />
        </ScrollView>

        {/*  Sticky Footer  */}
        <View
          className="bg-surface border-t border-divider px-lg pt-md2"
          style={{ paddingBottom: insets.bottom }}
        >
          <AppButton
            title="Send handover request"
            onPress={handleCreateReturnReport}
            loading={isSubmitting}
            disabled={isSubmitDisabled}
            variant="secondary"
          />
        </View>
      </KeyboardAvoidingView>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Handover Request",
          headerRight: () => (
            <AppBackButton type="xIcon" showBackground={false} />
          ),
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />
      <View className="flex-1 bg-surface">{renderContent()}</View>
    </>
  );
}
