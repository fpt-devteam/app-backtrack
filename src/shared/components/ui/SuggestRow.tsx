import { colors } from "@/src/shared/theme";
import type { IconProps } from "phosphor-react-native";
import { Clock, X } from "phosphor-react-native";
import React from "react";
import type { GestureResponderEvent } from "react-native";
import { Text, TouchableOpacity } from "react-native";

type SuggestRowProps = {
  readonly IconComponent?: React.ElementType<IconProps>;
  readonly text: string;
  readonly onPress: () => void;
  readonly onRemove?: () => void;
};

function SuggestRow({
  IconComponent = Clock,
  text,
  onPress,
  onRemove,
}: SuggestRowProps) {
  const handleRemove = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center p-2">
      <IconComponent size={18} color={colors.slate[500]} />
      <Text
        style={{ fontSize: 15, marginLeft: 10, flex: 1 }}
        numberOfLines={1}
      >
        {text}
      </Text>

      {onRemove ? (
        <TouchableOpacity onPress={handleRemove} hitSlop={10}>
          <X size={18} color={colors.slate[400]} />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

export default SuggestRow;
