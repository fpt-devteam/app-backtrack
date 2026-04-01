import { colors } from "@/src/shared/theme";
import type { IconProps } from "phosphor-react-native";
import { ArrowUpRightIcon, ClockIcon } from "phosphor-react-native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type AppSearchSuggestRowProps = {
  readonly IconComponent?: React.ElementType<IconProps>;
  readonly text: string;
  readonly onPress: () => void;
};

export const AppSearchSuggestRow = ({
  IconComponent = ClockIcon,
  text,
  onPress,
}: AppSearchSuggestRowProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-2 border-b gap-4"
      style={{ borderColor: colors.slate[100] }}
    >
      <IconComponent size={24} color={colors.primary} />

      <Text className="text-sm flex-1" numberOfLines={1}>
        {text}
      </Text>

      <ArrowUpRightIcon size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};
