import { Text, View } from "react-native";

const getInitials = (name?: string) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase()).join('') || '?'
}
export const ConversationAvatar = ({ name }: { name: string }) => {
  return (
    <View className="h-16 w-16 rounded-full bg-slate-200 items-center justify-center">
      <Text className="text-lg font-bold text-slate-700">
        {getInitials(name)}
      </Text>
    </View>
  );
};