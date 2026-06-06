import { MotiView } from "moti";
import React, { useEffect, useMemo, useRef } from "react";
import { Text, useWindowDimensions, View } from "react-native";

import { useAppUser } from "@/src/features/auth/providers";
import { HANDOVER_VERIFICATION_PLACEHOLDER } from "@/src/features/post/constants/handover-verification.constant";
import {
  useGetQnAWithAnswer,
  useQnAQuestions,
} from "@/src/features/post/hooks";
import {
  DraftQnAAnswer,
  MAX_IMAGE_PER_ANSWER,
  useQnAStore,
} from "@/src/features/post/store";
import { ANSWER_TYPE, type AppQnAAnswer } from "@/src/features/post/types";
import type { ImagePickerAsset } from "expo-image-picker";

import {
  AppImageSlot,
  AppInlineError,
  AppLoader,
  TouchableIconButton,
} from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import { ImageIcon, PenIcon } from "phosphor-react-native";

import { PostFormTextArea } from "./PostFormTextArea";

type QnAAnswerSectionProps = {
  postId: string;
  mode: "create" | "edit";
};

type QuestionAnswerItemProps = {
  answer: DraftQnAAnswer;
  onChangeText: (value: string) => void;
  onOpenImagePicker: () => void;
  onRemoveImage: (index: number) => void;
};

const QuestionAnswerItem = ({
  answer,
  onChangeText,
  onOpenImagePicker,
  onRemoveImage,
}: QuestionAnswerItemProps) => {
  const { width: screenWidth } = useWindowDimensions();

  if (answer.type === ANSWER_TYPE.TEXT) {
    const safeText = answer.draftText || "";

    return (
      <PostFormTextArea
        value={safeText}
        onChange={onChangeText}
        minHeight={64}
        placeholder={HANDOVER_VERIFICATION_PLACEHOLDER}
      />
    );
  }

  const imageSize = 0.15 * screenWidth;
  const images = answer.draftImages || [];
  const emptySlots = Math.max(0, MAX_IMAGE_PER_ANSWER - images.length);

  return (
    <View className="gap-2">
      <View className="flex-row flex-wrap gap-sm gap-y-2">
        {images.map((image, idx) => {
          return (
            <View key={`${answer.questionId}-${idx}`}>
              <AppImageSlot
                image={image}
                size={imageSize}
                onPress={onOpenImagePicker}
                onRemove={() => onRemoveImage(idx)}
              />
            </View>
          );
        })}

        {Array.from({ length: emptySlots }).map((_, idx) => {
          const slotIdx = images.length + idx;

          return (
            <View key={`${answer.questionId}-empty-${slotIdx}`}>
              <AppImageSlot
                image={null}
                size={imageSize}
                onPress={onOpenImagePicker}
                onRemove={() => onRemoveImage(slotIdx)}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const QnAAnswerSection = ({
  postId,
  mode = "create",
}: QnAAnswerSectionProps) => {
  const hasHydratedEditAnswers = useRef(false);
  const { data: questions, isLoading } = useQnAQuestions({ postId });
  const { user, isSyncing } = useAppUser();

  const {
    init,
    hydrateAnswers,
    answers,
    getQuestionText,
    changeMode,
    updateAnswerText: changeAnswerText,
    openPickerSheet,
    removeImage,
    reset,
  } = useQnAStore();

  const safeAnswererId = user?.id || "";

  const {
    data: qnaResults,
    isLoading: isQnALoading,
    error: qnaError,
  } = useGetQnAWithAnswer({
    postId,
    answererId: safeAnswererId,
  });

  const editDraftAnswers = useMemo(() => {
    if (mode !== "edit" || !questions?.length) return [];

    return questions.map((question): DraftQnAAnswer => {
      const qnaResult = qnaResults?.find((item) => item.id === question.id);
      const matchedAnswer = qnaResult?.answers.find(
        (answer) => answer.answererId === safeAnswererId
      );

      return mapAnswerToDraft(question.id, matchedAnswer);
    });
  }, [mode, qnaResults, questions, safeAnswererId]);

  const draftAnswer = useMemo(() => {
    if (mode === "create") return answers;

    return answers;
  }, [mode, answers]);

  useEffect(() => {
    if (!questions || questions.length === 0) return;

    init(postId, questions);

    return () => {
      hasHydratedEditAnswers.current = false;
      reset();
    };
  }, [init, postId, questions, reset]);

  useEffect(() => {
    if (mode !== "edit") return;
    if (!questions?.length || !qnaResults) return;
    if (hasHydratedEditAnswers.current) return;

    hydrateAnswers(editDraftAnswers);
    hasHydratedEditAnswers.current = true;
  }, [editDraftAnswers, hydrateAnswers, mode, qnaResults, questions]);

  if (isLoading || isSyncing) return <AppLoader />;

  if (mode === "edit" && isQnALoading) return <AppLoader />;

  if (!user) return <AppInlineError message="You need to be logged in." />;

  if (mode === "edit" && qnaError) {
    return <AppInlineError message={qnaError.message} />;
  }

  if (questions.length === 0) return null;

  return (
    <>
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 240, delay: 180 }}
        className="gap-md2"
      >
        <Text className="text-lg font-normal text-textPrimary">
          Verification Questions
        </Text>

        <View className="gap-md">
          {draftAnswer.map((answer, index) => {
            const number = index + 1;
            const questionText = getQuestionText(answer.questionId);
            const id = answer.questionId;

            return (
              <View key={id} className="gap-sm">
                {/* Question Text */}
                <View className="flex-row justify-between gap-md2">
                  <Text className="flex-1 text-md2 font-medium text-textPrimary leading-5">
                    {number}. {questionText}
                    <Text className="text-red-500 font-bold"> *</Text>
                  </Text>

                  {/* Change Type Button */}
                  <TouchableIconButton
                    icon={
                      <View>
                        {answer.type === ANSWER_TYPE.TEXT ? (
                          <ImageIcon size={20} color={colors.primary} />
                        ) : (
                          <PenIcon size={20} color={colors.primary} />
                        )}
                      </View>
                    }
                    onPress={() => {
                      if (answer.type === ANSWER_TYPE.IMAGE) {
                        changeMode(answer.questionId, ANSWER_TYPE.TEXT);
                        return;
                      }
                      changeMode(answer.questionId, ANSWER_TYPE.IMAGE);
                    }}
                  />
                </View>

                <QuestionAnswerItem
                  answer={answer}
                  onChangeText={(v) => changeAnswerText(answer.questionId, v)}
                  onOpenImagePicker={() => openPickerSheet(answer.questionId)}
                  onRemoveImage={(idx) => removeImage(answer.questionId, idx)}
                />
              </View>
            );
          })}
        </View>
      </MotiView>
    </>
  );
};

export default QnAAnswerSection;

const mapAnswerToDraft = (
  questionId: string,
  answer?: AppQnAAnswer
): DraftQnAAnswer => {
  if (!answer) {
    return {
      questionId,
      type: ANSWER_TYPE.TEXT,
      draftText: "",
      draftImages: [],
      existingImageUrls: [],
    };
  }

  if (answer.type === ANSWER_TYPE.IMAGE) {
    const existingImageUrls = answer.imageUrls ?? [];

    return {
      questionId,
      type: ANSWER_TYPE.IMAGE,
      draftText: "",
      draftImages: existingImageUrls.map(mapImageUrlToDraftImage),
      existingImageUrls,
    };
  }

  return {
    questionId,
    type: ANSWER_TYPE.TEXT,
    draftText: answer.answerText ?? "",
    draftImages: [],
    existingImageUrls: [],
  };
};

const mapImageUrlToDraftImage = (uri: string): ImagePickerAsset => ({
  uri,
  assetId: uri,
  width: 0,
  height: 0,
});
