import type { QnA } from "@/src/features/post/types";
import { AppAccordion } from "@/src/shared/components";
import { colors, metrics } from "@/src/shared/theme";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";

type QnAAccordionProps = {
  qna: QnA;
};

const DEFAULT_ANSWER_MESSAGE = "Awaiting response from the owner...";

export const QnAAccordion = ({ qna }: QnAAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const answerText = useMemo(() => {
    const trimmedAnswer = qna.answerText?.trim();
    return trimmedAnswer || DEFAULT_ANSWER_MESSAGE;
  }, [qna.answerText]);

  const hasAnswer = !!qna.answerText?.trim();

  return (
    <View
      className="overflow-hidden rounded-md border"
      style={{
        borderColor: colors.divider,
        backgroundColor: colors.surface,
      }}
    >
      <AppAccordion
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((prev) => !prev)}
        collapsedContent={
          <View className="p-md2">
            <Text className="text-sm font-normal text-textPrimary">
              {qna.questionText}
            </Text>
          </View>
        }
        expandedContent={
          <View
            className="px-md2 pb-md2"
            style={{ paddingTop: metrics.spacing.xs }}
          >
            <Text
              className={`text-sm font-thin ${
                hasAnswer ? "text-textSecondary" : "text-textMuted"
              }`}
            >
              {answerText}
            </Text>
          </View>
        }
      />
    </View>
  );
};
