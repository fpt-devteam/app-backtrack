import { colors } from "@/src/shared/theme";
import { MotiView } from "moti";
import {
  CheckCircleIcon,
  HourglassIcon,
  Icon,
  InfoIcon,
  LightbulbIcon,
  WarningCircleIcon,
} from "phosphor-react-native";
import { Text, View } from "react-native";

type AppTipCardType = "info" | "warning" | "success" | "waiting" | "tip";

const tipCardStyles: Record<
  AppTipCardType,
  {
    icon: Icon;
    borderColor: string;
    backgroundColor: string;
    colorIcon: string;
  }
> = {
  info: {
    icon: InfoIcon,
    borderColor: colors.info[500],
    backgroundColor: colors.info[100],
    colorIcon: colors.info[600],
  },
  warning: {
    icon: WarningCircleIcon,
    borderColor: colors.error[500],
    backgroundColor: colors.error[100],
    colorIcon: colors.error[600],
  },
  success: {
    icon: CheckCircleIcon,
    colorIcon: colors.babu[600],
    borderColor: colors.babu[500],
    backgroundColor: colors.babu[100],
  },
  waiting: {
    icon: HourglassIcon,
    borderColor: colors.hof[300],
    backgroundColor: colors.hof[50],
    colorIcon: colors.hof[500],
  },
  tip: {
    icon: LightbulbIcon,
    borderColor: colors.arches[300],
    backgroundColor: colors.arches[50],
    colorIcon: colors.arches[600],
  },
};

type AppTipCardProps = {
  icon?: Icon;
  title: string;
  description: string;
  type: AppTipCardType;
};

export const AppTipCard = ({
  icon,
  title,
  description,
  type,
}: AppTipCardProps) => {
  const {
    colorIcon,
    borderColor,
    backgroundColor,
    icon: DefaultIcon,
  } = tipCardStyles[type];
  const IconComponent = icon || DefaultIcon;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 260, delay: 180 }}
    >
      <View
        className="flex-row items-start rounded-md border p-md2"
        style={{ borderColor, backgroundColor }}
      >
        <IconComponent
          size={16}
          color={colorIcon}
          style={{ marginTop: 1, marginRight: 8 }}
          weight="fill"
        />

        <View className="flex-1">
          <Text className="text-sm font-normal text-textPrimary">{title}</Text>
          <Text className="text-xs font-thin text-textMuted">
            {description}
          </Text>
        </View>
      </View>
    </MotiView>
  );
};
