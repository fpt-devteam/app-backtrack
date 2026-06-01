import { PostFormTextArea } from "@/src/features/post/components/PostFormTextArea";
import type { QnAQuestionCreateRequest } from "@/src/features/post/types";
import { colors } from "@/src/shared/theme";
import { PencilSimpleIcon, TrashIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type QnACardProps = {
  qna: QnAQuestionCreateRequest;
  onUpdate: (
    originalQuestionText: string,
    qna: QnAQuestionCreateRequest,
  ) => void;
  onDelete: (questionText: string) => void;
};

export const QnACard = ({ qna, onUpdate, onDelete }: QnACardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftQuestion, setDraftQuestion] = useState(qna.questionText);

  useEffect(() => {
    setDraftQuestion(qna.questionText);
  }, [qna.questionText]);

  const handleSave = () => {
    const trimmedQuestion = draftQuestion.trim();
    if (!trimmedQuestion) return;

    onUpdate(qna.questionText, {
      ...qna,
      questionText: trimmedQuestion,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftQuestion(qna.questionText);
    setIsEditing(false);
  };

  return (
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
      <View className="flex-row items-start gap-sm">
        <View className="flex-1 gap-xs">
          <Text className="text-xs font-normal text-textMuted uppercase tracking-label">
            Verification Question
          </Text>

          {isEditing ? (
            <PostFormTextArea
              value={draftQuestion}
              onChange={setDraftQuestion}
              minHeight={88}
              placeholder="Ask something only the real owner could answer."
            />
          ) : (
            <Text className="text-base font-normal text-textPrimary leading-6">
              {qna.questionText}
            </Text>
          )}
        </View>

        {!isEditing && (
          <View className="flex-row items-center gap-xs">
            <Pressable
              onPress={() => setIsEditing(true)}
              className="rounded-full border p-xs"
              style={{ borderColor: colors.divider }}
            >
              <PencilSimpleIcon size={16} color={colors.text.primary} />
            </Pressable>

            <Pressable
              onPress={() => onDelete(qna.questionText)}
              className="rounded-full border p-xs"
              style={{ borderColor: colors.error[200] }}
            >
              <TrashIcon size={16} color={colors.error[500]} />
            </Pressable>
          </View>
        )}
      </View>

      {isEditing && (
        <View className="flex-row justify-end gap-sm">
          <Pressable
            onPress={handleCancel}
            className="rounded-sm px-md py-sm"
            style={{ backgroundColor: colors.muted }}
          >
            <Text className="text-sm font-normal text-textPrimary">Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            className="rounded-sm px-md py-sm"
            style={{ backgroundColor: colors.secondary }}
          >
            <Text className="text-sm font-normal text-white">Save</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
