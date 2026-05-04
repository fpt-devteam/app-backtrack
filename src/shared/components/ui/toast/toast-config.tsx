import { colors } from "@/src/shared/theme/colors";
import { BlurView } from "expo-blur";
import {
  CheckCircleIcon,
  IconProps,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
} from "phosphor-react-native";
import React from "react";
import { Text, View } from "react-native";
import { BaseToastProps, ToastConfig } from "react-native-toast-message";

type ToastKind = "info" | "warning" | "error" | "success";

const TOKENS: Record<
  ToastKind,
  {
    color: string;
    Icon: React.FC<IconProps>;
  }
> = {
  info: { color: colors.status.info, Icon: InfoIcon },
  warning: { color: colors.status.warning, Icon: WarningIcon },
  error: { color: colors.status.error, Icon: WarningCircleIcon },
  success: { color: colors.status.success, Icon: CheckCircleIcon },
};

type IOSGlassToastProps = {
  kind: ToastKind;
  text1?: string;
  text2?: string;
};

const IOSGlassToast = ({ kind, text1, text2 }: IOSGlassToastProps) => {
  const config = TOKENS[kind];
  const IconComponent = config.Icon;

  return (
    <BlurView
      intensity={100}
      tint="prominent"
      className="rounded-lg overflow-hidden"
    >
      <View className="flex-row w-[90%] items-center p-md gap-md">
        <IconComponent size={28} color={config.color} weight="regular" />

        <View className="flex-1">
          {!!text1 && (
            <Text
              className="text-md font-normal text-textPrimary"
              numberOfLines={2}
            >
              {text1}
            </Text>
          )}
          {!!text2 && (
            <Text
              className="text-sm font-thin text-textSecondary"
              numberOfLines={2}
            >
              {text2}
            </Text>
          )}
        </View>
      </View>
    </BlurView>
  );
};

export const toastConfig: ToastConfig = {
  info: (p: BaseToastProps) => (
    <IOSGlassToast kind="info" text1={p.text1} text2={p.text2} />
  ),
  warning: (p: BaseToastProps) => (
    <IOSGlassToast kind="warning" text1={p.text1} text2={p.text2} />
  ),
  error: (p: BaseToastProps) => (
    <IOSGlassToast kind="error" text1={p.text1} text2={p.text2} />
  ),
  success: (p: BaseToastProps) => (
    <IOSGlassToast kind="success" text1={p.text1} text2={p.text2} />
  ),
};
