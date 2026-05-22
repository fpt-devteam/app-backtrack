import { PostFormTextArea } from "@/src/features/post/components/PostFormTextArea";
import type { QnA } from "@/src/features/post/types";
import React from "react";
import { Text, View } from "react-native";

type QnAItemProps = {
  qna: QnA;
};

const PLACEHOLDER =
  "Provide detailed information to help verify your claim faster...";

export const QnAItem = ({ qna }: QnAItemProps) => {
  return (
    <View className="gap-sm">
      <Text className="text-sm font-normal text-textPrimary leading-5">
        {qna.questionText}
        <Text className="text-red-500"> *</Text>
      </Text>

      <PostFormTextArea
        value=""
        onChange={() => {}}
        minHeight={48}
        placeholder={PLACEHOLDER}
      />
    </View>
  );
};
