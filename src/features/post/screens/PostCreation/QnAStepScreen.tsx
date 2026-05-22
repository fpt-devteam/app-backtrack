import {
  PostFormTextArea,
  QnACard,
} from "@/src/features/post/components";
import { usePostCreationStore } from "@/src/features/post/hooks";
import { MAX_QNA_COUNT } from "@/src/features/post/store";
import { colors } from "@/src/shared/theme";
import { ArrowClockwiseIcon, PlusIcon } from "phosphor-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const QnAStepScreen = () => {
  const questions = usePostCreationStore((state) => state.questions);
  const subCategoryCode = usePostCreationStore((state) => state.subCategoryCode);
  const loadMockQuestions = usePostCreationStore(
    (state) => state.loadMockQuestions,
  );
  const addQuestion = usePostCreationStore((state) => state.addQuestion);
  const updateQuestion = usePostCreationStore((state) => state.updateQuestion);
  const deleteQuestion = usePostCreationStore((state) => state.deleteQuestion);
  const resetQuestions = usePostCreationStore((state) => state.resetQuestions);

  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [draftQuestion, setDraftQuestion] = useState("");
  const hasInitializedQuestions = useRef(false);

  useEffect(() => {
    if (!hasInitializedQuestions.current && questions.length === 0) {
      loadMockQuestions(subCategoryCode);
      hasInitializedQuestions.current = true;
    }
  }, [loadMockQuestions, questions.length, subCategoryCode]);

  const canAddMore = useMemo(
    () => questions.length < MAX_QNA_COUNT,
    [questions.length],
  );

  const handleAddQuestion = () => {
    const trimmedQuestion = draftQuestion.trim();
    if (!trimmedQuestion || !canAddMore) return;

    addQuestion({
      questionText: trimmedQuestion,
    });
    setDraftQuestion("");
    setIsAddingQuestion(false);
  };

  const handleCancelAddQuestion = () => {
    setDraftQuestion("");
    setIsAddingQuestion(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 p-lg"
          contentContainerClassName="gap-lg pb-xl"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text className="text-textPrimary font-normal text-2xl pr-lg tracking-tight">
              Set verification questions
            </Text>
            <Text className="text-textSecondary font-thin text-base mt-xs">
              Ask up to three questions that only the rightful owner can answer.
            </Text>
          </View>

          <View className="gap-md2">
            {questions.map((qna) => (
              <QnACard
                key={qna.questionText}
                qna={qna}
                onUpdate={updateQuestion}
                onDelete={deleteQuestion}
              />
            ))}
          </View>

          {isAddingQuestion && canAddMore && (
            <View
              className="rounded-md border bg-surface p-md2 gap-sm"
              style={{
                borderColor: colors.divider,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <Text className="text-sm font-normal text-textPrimary">
                Add a custom verification question
              </Text>

              <PostFormTextArea
                value={draftQuestion}
                onChange={setDraftQuestion}
                minHeight={88}
                placeholder="Ask something only the real owner would know."
              />

              <View className="flex-row justify-end gap-sm">
                <Pressable
                  onPress={handleCancelAddQuestion}
                  className="rounded-sm px-md py-sm"
                  style={{ backgroundColor: colors.muted }}
                >
                  <Text className="text-sm font-normal text-textPrimary">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleAddQuestion}
                  className="rounded-sm px-md py-sm"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <Text className="text-sm font-normal text-white">Add</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View className="flex-row items-center justify-between gap-md">
            {canAddMore ? (
              <Pressable
                onPress={() => setIsAddingQuestion(true)}
                className="flex-1 flex-row items-center justify-center gap-sm rounded-sm border px-md py-md"
                style={{ borderColor: colors.divider }}
              >
                <PlusIcon size={16} color={colors.text.primary} />
                <Text className="text-sm font-normal text-textPrimary">
                  Add Question
                </Text>
              </Pressable>
            ) : (
              <View
                className="flex-1 rounded-sm border px-md py-md"
                style={{ borderColor: colors.divider, opacity: 0.6 }}
              >
                <Text className="text-sm font-normal text-textMuted text-center">
                  Maximum of {MAX_QNA_COUNT} questions reached
                </Text>
              </View>
            )}

            <Pressable
              onPress={resetQuestions}
              className="flex-row items-center justify-center gap-xs rounded-sm border px-md py-md"
              style={{ borderColor: colors.divider }}
            >
              <ArrowClockwiseIcon size={16} color={colors.text.primary} />
              <Text className="text-sm font-normal text-textPrimary">Reset</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default QnAStepScreen;
