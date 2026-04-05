import { Text, View } from "react-native";

export const PostInfoRow = ({
  icon,
  title,
  subTitle,
}: {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
}) => {
  return (
    <View className="flex-row gap-md">
      {icon}
      <View className="flex-1 gap-xs">
        <Text className="text-normal font-normal text-textPrimary">
          {title}
        </Text>

        <Text className="text-sm font-normal text-textMuted">{subTitle}</Text>
      </View>
    </View>
  );
};