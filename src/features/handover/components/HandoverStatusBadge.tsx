import { HANDOVER_STATUS, HandoverStatus } from "@/src/features/handover/types";
import { colors } from "@/src/shared/theme";
import React from "react";
import { Text, View } from "react-native";

type HandoverStatusBadgeProps = {
  status: HandoverStatus;
};

type StatusTheme = {
  label: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  dotColor: string;
};

const STATUS_THEME: Record<HandoverStatus, StatusTheme> = {
  [HANDOVER_STATUS.Ongoing]: {
    label: "Ongoing",
    textColor: colors.babu[500],
    backgroundColor: colors.babu[100],
    borderColor: colors.babu[200],
    dotColor: colors.babu[500],
  },
  [HANDOVER_STATUS.Delivered]: {
    label: "Delivered",
    textColor: colors.babu[600],
    backgroundColor: colors.babu[100],
    borderColor: colors.babu[200],
    dotColor: colors.babu[600],
  },
  [HANDOVER_STATUS.Confirmed]: {
    label: "Confirmed",
    textColor: colors.babu[500],
    backgroundColor: colors.babu[100],
    borderColor: colors.babu[200],
    dotColor: colors.babu[500],
  },
  [HANDOVER_STATUS.Rejected]: {
    label: "Rejected",
    textColor: colors.error[500],
    backgroundColor: colors.error[100],
    borderColor: colors.error[200],
    dotColor: colors.error[500],
  },
  [HANDOVER_STATUS.Closed]: {
    label: "Closed",
    textColor: colors.hof[500],
    backgroundColor: colors.hof[100],
    borderColor: colors.hof[200],
    dotColor: colors.hof[500],
  },
};

export const HandoverStatusBadge = ({ status }: HandoverStatusBadgeProps) => {
  const theme = STATUS_THEME[status];

  return (
    <View
      className="self-start mt-xs mb-xs px-sm py-0.5 rounded-full flex-row items-center gap-1"
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: theme.borderColor,
        borderWidth: 1,
      }}
    >
      <View
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: theme.dotColor }}
      />
      <Text className="text-xs font-normal" style={{ color: theme.textColor }}>
        {theme.label}
      </Text>
    </View>
  );
};
