import { WarningCircleIcon } from "phosphor-react-native";
import React from "react";
import { Text, View } from "react-native";
import { colors, typography } from "../theme";

type AppInlineErrorProps = {
  message: string;
};

export const AppInlineError = ({ message }: AppInlineErrorProps) => {
  return (
    <View className="flex-row items-center mt-1.5 gap-2">
      <WarningCircleIcon size={16} weight="fill" color={colors.status.error} />
      <Text
        style={{
          fontSize: typography.fontSize.xs,
          fontWeight: "400",
          color: colors.status.error,
        }}
      >
        {message}
      </Text>
    </View>
  );
};
