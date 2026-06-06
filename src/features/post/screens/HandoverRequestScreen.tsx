import { useAppUser } from "@/src/features/auth/providers";
import {
  useCreateDirectConversation,
  useSendMessage,
} from "@/src/features/chat/hooks";
import { useCreateC2CReturnReport } from "@/src/features/handover/hooks";
import { useSendNotification } from "@/src/features/notification/hooks";
import {
  MyPostCard,
  PostFormTextArea,
  QnAAnswerSection,
} from "@/src/features/post/components";
import { useAnswerQnA, useGetPostById } from "@/src/features/post/hooks";
import { useQnAStore } from "@/src/features/post/store";
import { PostType, type UserPost } from "@/src/features/post/types";
import {
  AppBackButton,
  AppButton,
  AppInlineError,
  AppLoader,
  AppTipCard,
  AppUserAvatar,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { CHAT_ROUTE, HANDOVER_ROUTE } from "@/src/shared/constants";
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

const DEFAULT_MESSAGE =
  "Chào bạn! mình đang quan tâm và muốn trao đổi về việc nhận lại món đồ này. Nếu được, chúng mình cùng bàn kỹ hơn về thời gian và địa điểm nhé!";

export default function HandoverRequestScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAppUser();
  const { postId, otherPostId } = useLocalSearchParams<Params>();

  const { buildAnswerRequests, canSubmitAnswers } = useQnAStore();
  const { answerQnA } = useAnswerQnA();

  const {
    isLoading,
    data: otherPost,
    error: postError,
  } = useGetPostById({
    postId: otherPostId,
    params: {
      isBlurImages: false,
    },
  });

  const { sendNotification } = useSendNotification();
  const { createC2CReturnReport } = useCreateC2CReturnReport();
  const { create } = useCreateDirectConversation();
  const { sendMessage } = useSendMessage();

  const [draftMessage, setDraftMessage] = useState(DEFAULT_MESSAGE);

  const [isSendLoading, setIsSendLoading] = useState(false);

  const isSentDisabled =
    isSendLoading || !draftMessage.trim() || !canSubmitAnswers();

  const getHandoverRoles = (postId: string, otherPost: UserPost) => {
    const isFoundPost = otherPost.postType === PostType.Found;
    return {
      finderPostId: isFoundPost ? otherPost.id : postId,
      ownerPostId: isFoundPost ? postId : otherPost.id,
    };
  };

  const handleCreateReturnReport = async () => {
    if (!otherPost || !user) return;

    try {
      setIsSendLoading(true);

      const trimmedMessage = draftMessage.trim();
      const { finderPostId, ownerPostId } = getHandoverRoles(postId, otherPost);
      const authorId = otherPost.author.id;

      const handoverRes = await createC2CReturnReport({
        finderPostId,
        ownerPostId,
      });

      if (!handoverRes?.id) {
        throw new Error("REPORT_CREATION_FAILED");
      }

      const convRes = await create({ memberId: authorId });
      const conversationId = convRes.data?.conversation?.conversationId;

      if (!conversationId) {
        throw new Error("CONVERSATION_CREATION_FAILED");
      }

      const qnaAnswerReqs = await buildAnswerRequests();

      if (qnaAnswerReqs === null) {
        throw new Error("QNA_ANSWER_BUILD_FAILED");
      }

      await Promise.all([
        sendMessage({
          conversationId,
          request: { type: "text", content: trimmedMessage },
        }),

        sendNotification({
          target: { userId: authorId },
          source: {
            name: `Request from ${user.displayName || "User"}`,
            eventId: Date.now().toString(),
          },
          title: "New Handover Request",
          body: trimmedMessage,
          type: "ChatEvent",
          data: { screenPath: CHAT_ROUTE.message(conversationId) },
        }),

        ...qnaAnswerReqs.map((req) => answerQnA(req)),
      ]);

      toast.success("Request Sent", "Your handover request is on its way!");
      router.dismissAll();
      router.push(HANDOVER_ROUTE.detail(handoverRes.id));
    } catch (error) {
      console.error("Handover request failed:", error);
      toast.error(
        "Send Failed",
        "Could not complete the handover request and verification answers. Please try again.",
      );
    } finally {
      setIsSendLoading(false);
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

    const showQnASection = otherPost.postType === PostType.Found;

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
          <MyPostCard item={otherPost} disabled={true} />

          {/* QnA Questions */}
          {showQnASection && (
            <QnAAnswerSection postId={otherPost.id} mode="create" />
          )}

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
              onChange={setDraftMessage}
              value={draftMessage}
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
            disabled={isSentDisabled}
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
          headerLeft: () => <AppBackButton />,
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />
      <View className="flex-1 bg-surface">
        {renderContent()}

        {isSendLoading ? (
          <View className="absolute inset-0 z-10 items-center justify-center bg-black/10">
            <AppLoader />
          </View>
        ) : null}
      </View>
    </>
  );
}
