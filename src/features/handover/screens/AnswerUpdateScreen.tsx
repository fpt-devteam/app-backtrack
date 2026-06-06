import { useAppUser } from "@/src/features/auth/providers";
import { useGetC2CReturnReportById } from "@/src/features/handover/hooks";
import { QnAAnswerSection } from "@/src/features/post/components";
import { useAnswerQnA } from "@/src/features/post/hooks";
import { useQnAStore } from "@/src/features/post/store";
import {
  AppBackButton,
  AppButton,
  AppInlineError,
  AppLoader,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { typography } from "@/src/shared/theme/typography";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, TextStyle, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AnswerUpdateScreenParams = {
  handoverId: string;
};

const AnswerUpdateScreen = () => {
  const insets = useSafeAreaInsets();
  const { handoverId } = useLocalSearchParams<AnswerUpdateScreenParams>();

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { user: currentUser, isSyncing } = useAppUser();
  const { answerQnA } = useAnswerQnA();
  const { buildAnswerRequests, canSubmitAnswers } = useQnAStore();

  const {
    data: handover,
    isLoading: isHandoverLoading,
    error: handoverError,
  } = useGetC2CReturnReportById(handoverId);

  const renderContent = () => {
    const isLoading = isHandoverLoading || isSyncing;
    if (isLoading) {
      return (
        <View className="flex-1 justify-center item-center">
          <AppLoader />
        </View>
      );
    }

    const postId = handover?.finderPost?.id;
    const isError = !!handoverError || !handover || !currentUser || !postId;

    if (isError) {
      return (
        <View className="flex-1 justify-center item-center">
          <AppInlineError
            message={
              handoverError?.message || "Failed to load handover details"
            }
          />
        </View>
      );
    }

    return (
      <ScrollView className="py-md">
        <QnAAnswerSection postId={postId} mode="edit" />
      </ScrollView>
    );
  };

  const isSaveButtonDisabled = !canSubmitAnswers();
  const isSaveButtonLoading = isSaving;

  const handleSave = async () => {
    const qnaAnswerReqs = await buildAnswerRequests();
    if (!qnaAnswerReqs) return;
    try {
      setIsSaving(true);

      await Promise.all([qnaAnswerReqs.map((req) => answerQnA(req))]);

      toast.success("Success", "Save success!");
      router.back();
    } catch {
      toast.error("Error", "Error when saving!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Update Your Answer",
          headerBackVisible: false,
          headerLeft: () => <AppBackButton type="xIcon" />,
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      <View className="flex-1 px-md bg-surface">{renderContent()}</View>

      <View
        className="bg-surface border-t border-divider px-lg pt-md2"
        style={{
          paddingBottom: insets.bottom,
        }}
      >
        <AppButton
          title="Save"
          variant="secondary"
          onPress={handleSave}
          loading={isSaveButtonLoading}
          disabled={isSaveButtonDisabled}
        />
      </View>
    </>
  );
};

export default AnswerUpdateScreen;
