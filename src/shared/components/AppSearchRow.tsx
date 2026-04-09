import { colors } from "@/src/shared/theme";
import { View } from "moti";
import type { IconProps } from "phosphor-react-native";
import { ArrowUpRightIcon, ClockIcon } from "phosphor-react-native";
import React from "react";
import { Pressable, Text } from "react-native";

type AppSearchRowProps = {
  readonly IconComponent?: React.ElementType<IconProps>;
  readonly text: string;
  readonly onPress: () => void;
};

export const AppSearchRow = ({
  IconComponent = ClockIcon,
  text,
  onPress,
}: AppSearchRowProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-sm bg-surface py-xs active:bg-slate-50"
    >
      <View className="flex-row gap-sm items-center ">
        <View
          className="items-center justify-center rounded-sm p-sm"
          style={{ backgroundColor: colors.info[50] }}
        >
          <IconComponent size={24} color={colors.info[500]} weight="regular" />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-thin text-textPrimary">{text}</Text>
        </View>

        <View className="p-sm">
          <ArrowUpRightIcon size={24} color={colors.info[500]} weight="thin" />
        </View>
      </View>
    </Pressable>
  );
};
