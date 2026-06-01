import { ANSWER_TYPE, type AppQnA } from "@/src/features/post/types";
import { AppAccordion, AppImage } from "@/src/shared/components";
import { colors, metrics } from "@/src/shared/theme";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

type QnAAccordionProps = {
  qna: AppQnA;
};

const DEFAULT_ANSWER_MESSAGE = "Awaiting response from the owner...";

export const QnAAccordion = ({ qna }: QnAAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { width } = useWindowDimensions();
  const imageWidth = 0.3 * width;

  const answerText = useMemo(() => {
    const trimmedAnswer = qna.answerText?.trim();
    return trimmedAnswer || DEFAULT_ANSWER_MESSAGE;
  }, [qna.answerText]);

  const hasImageAnswer = (qna.imageUrls?.length ?? 0) > 0;
  const hasTextAnswer = !!qna.answerText?.trim();
  const isImageAnswer = qna.type === ANSWER_TYPE.IMAGE;
  const hasAnswer = isImageAnswer ? hasImageAnswer : hasTextAnswer;

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
            {isImageAnswer && hasImageAnswer ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: metrics.spacing.xs }}
              >
                <View className="flex-row">
                  {qna.imageUrls?.map((imageUrl, index) => {
                    const isLastImage = index === qna.imageUrls!.length - 1;

                    return (
                      <View
                        key={`${qna.id ?? qna.questionId}-${imageUrl}-${index}`}
                        className="overflow-hidden aspect-[4/3] rounded-md"
                        style={{
                          width: imageWidth,
                          marginRight: isLastImage ? 0 : metrics.spacing.sm,
                        }}
                      >
                        <AppImage
                          url={imageUrl}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            ) : (
              <Text
                className={`text-sm font-thin ${
                  hasAnswer ? "text-textSecondary" : "text-textMuted"
                }`}
              >
                {answerText}
              </Text>
            )}
          </View>
        }
      />
    </View>
  );
};
