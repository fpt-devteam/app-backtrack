import { colors } from "@/src/shared/theme";
import { Text, View } from "react-native";

const getScoreTheme = (score: number) => {
  if (score >= 0.7) {
    return {
      color: colors.emerald[600],
      bgColor: "#ecfdf5",
    };
  }
  if (score >= 0.4) {
    return {
      color: colors.amber[500],
      bgColor: "#fffbeb",
    };
  }
  return {
    color: colors.red[500],
    bgColor: "#fef2f2",
  };
};

const PostMatchingScoreBadge = ({ score }: { score: number }) => {
  const safeScore = Math.min(Math.max(score, 0), 1);
  const scorePercentage = Math.round(safeScore * 100);
  const { color, bgColor } = getScoreTheme(safeScore);

  return (
    <View
      className="flex-row items-center justify-center rounded-full px-2.5 py-1 border"
      style={{
        backgroundColor: bgColor,
        borderColor: color,
      }}
    >
      <Text className="ml-1 text-xs font-bold tracking-wide" style={{ color }}>
        {scorePercentage}% Match
      </Text>
    </View>
  );
};

export default PostMatchingScoreBadge;
