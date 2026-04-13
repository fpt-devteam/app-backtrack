import type { SimilarPostMatchingLevel } from "@/src/features/post/types";
import { colors } from "@/src/shared/theme";
import { Text, View } from "react-native";

type LevelTheme = { color: string; bgColor: string; label: string };

const LEVEL_THEME: Record<SimilarPostMatchingLevel, LevelTheme> = {
  Low: { color: colors.red[500], bgColor: "#fef2f2", label: "Low Match" },
  Medium: { color: colors.amber[500], bgColor: "#fffbeb", label: "Medium Match" },
  High: { color: colors.emerald[600], bgColor: "#ecfdf5", label: "High Match" },
  VeryHigh: { color: colors.emerald[700], bgColor: "#d1fae5", label: "Very High Match" },
};

const PostMatchingScoreBadge = ({ level }: { level: SimilarPostMatchingLevel }) => {
  const { color, bgColor, label } = LEVEL_THEME[level] ?? LEVEL_THEME.Low;

  return (
    <View
      className="flex-row items-center justify-center rounded-full px-2.5 py-1 border"
      style={{ backgroundColor: bgColor, borderColor: color }}
    >
      <Text className="text-xs font-bold tracking-wide" style={{ color }}>
        {label}
      </Text>
    </View>
  );
};

export default PostMatchingScoreBadge;
