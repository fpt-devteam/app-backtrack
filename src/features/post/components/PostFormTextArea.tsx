import { colors } from "@/src/shared/theme";
import React from "react";
import { TextInput, View } from "react-native";

type PostFormTextAreaProps = {
  value: string;
  onChange: (value: string) => void;
};

export const PostFormTextArea = ({
  value,
  onChange,
}: PostFormTextAreaProps) => {
  return (
    <View
      className="w-full bg-surface rounded-md border"
      style={{ minHeight: 128 }}
    >
      <TextInput
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        className="flex-1 p-md2 text-textPrimary font-thin"
        value={value}
        onChangeText={onChange}
        placeholder="Think of anything unique: a specific dent, a phone charm, or a custom engraving."
        placeholderTextColor={colors.text.muted}
        cursorColor={colors.primary}
      />
    </View>
  );
};
