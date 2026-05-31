import { useQnAQuestions } from "@/src/features/post/hooks";
import { AppLoader } from "@/src/shared/components";
import { MotiView } from "moti";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

type QnASectionProps = {
  postId: string;
};

const QnASection = ({ postId }: QnASectionProps) => {
  const { data, isLoading } = useQnAQuestions({ postId });

  const qnAs = useMemo(() => data || [], [data]);

  if (isLoading) return <AppLoader />;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 240, delay: 180 }}
      className="gap-4"
    >
      <Text className="text-lg font-normal text-textPrimary">
        Verification Questions
      </Text>

      <View className="gap-sm">
        {qnAs.map((qna, index) => {
          const number = index + 1;
          const id = `qna-${number}-${qna.questionText}`;
          return (
            <View
              key={id}
              className="bg-canvas border border-muted rounded-md p-md2 flex-row items-start shadow-sm"
            >
              <Text className="text-sm font-semibold text-textSecondary mr-2 mt-[2px]">
                {number}.
              </Text>
              <Text className="flex-1 text-sm font-medium text-textPrimary leading-5">
                {qna.questionText}
                <Text className="text-red-500 font-bold"> *</Text>
              </Text>
            </View>
          );
        })}
      </View>
    </MotiView>
  );
};

export default QnASection;
