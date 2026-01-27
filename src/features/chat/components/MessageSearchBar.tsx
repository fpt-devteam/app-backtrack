import { colors } from "@/src/shared/theme/colors";
import { cn } from "@/src/shared/utils/cn";
import { MagnifyingGlassIcon } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { TextInput, View } from "react-native";

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
};

export const MessageSearchBar = ({
  value,
  onChangeText,
  placeholder = "Search messages...",
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleUnFocus = () => {
    setIsFocused(false);
  };

  return (
    <View
      className={cn(
        "flex-row items-center bg-white rounded-full p-4 border-2 border-slate-300",
        isFocused && "border-primary",
      )}
    >
      <MagnifyingGlassIcon size={20} color={colors.slate[400]} weight="bold" />
      <TextInput
        ref={inputRef}
        value={value}
        onFocus={handleFocus}
        onBlur={handleUnFocus}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.slate[400]}
        className="flex-1 ml-2 text-base text-slate-900"
      />
    </View>
  );
};
