import { WarningCircleIcon } from "phosphor-react-native";
import React from "react";
import { Text, View } from "react-native";
import { colors } from "../theme";

type AppInlineErrorProps = {
  message: string;
};

export const AppInlineError = ({ message }: AppInlineErrorProps) => {
  return (
    <View className="flex-1 flex-row items-center gap-sm">
      <WarningCircleIcon size={16} weight="fill" color={colors.status.error} />
      <Text className="flex-1 text-xs font-xs text-textError" numberOfLines={1}>
        {message}
      </Text>
    </View>
  );
};
