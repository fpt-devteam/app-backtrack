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
import { Platform, StyleSheet, Text, View } from "react-native";
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

const IOSGlassToast = ({
  kind,
  text1,
  text2,
}: {
  kind: ToastKind;
  text1?: string;
  text2?: string;
}) => {
  const config = TOKENS[kind];
  const IconComponent = config.Icon;

  return (
    <BlurView
      intensity={80}
      tint="light"
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <IconComponent size={26} color={config.color} weight="regular" />
      </View>

      <View style={styles.content}>
        {!!text1 && (
          <Text style={styles.title} numberOfLines={1}>
            {text1}
          </Text>
        )}
        {!!text2 && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {text2}
          </Text>
        )}
      </View>
    </BlurView>
  );
};

export const toastConfig: ToastConfig = {
  info: (p: BaseToastProps) => <IOSGlassToast kind="info" text1={p.text1} text2={p.text2} />,
  warning: (p: BaseToastProps) => <IOSGlassToast kind="warning" text1={p.text1} text2={p.text2} />,
  error: (p: BaseToastProps) => <IOSGlassToast kind="error" text1={p.text1} text2={p.text2} />,
  success: (p: BaseToastProps) => <IOSGlassToast kind="success" text1={p.text1} text2={p.text2} />,
};

const styles = StyleSheet.create({
  container: {
    width: "92%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    borderWidth: 0,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,

    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
  },
  iconContainer: {
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.main,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.text.sub,
    opacity: 0.6,
    marginTop: 2,
    lineHeight: 18,
  },
});