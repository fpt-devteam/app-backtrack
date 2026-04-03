import { Text, View } from "react-native";

export const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label?: string;
  value: string;
}) => (
  <View className="flex-row gap-3 items-start">
    <View className="w-9 h-9 items-center justify-center rounded-2xl bg-canvas border border-divider">
      {icon}
    </View>
    <View className="flex-1 min-w-0">
      {label && (
        <Text className="text-sm text-textSecondary font-display">{label}</Text>
      )}
      <Text className="text-md text-textPrimary mt-1">
        {value}
      </Text>
    </View>
  </View>
);