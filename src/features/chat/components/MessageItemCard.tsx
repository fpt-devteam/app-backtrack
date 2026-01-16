import { formatTime } from "@/src/shared/utils";
import { Text, View } from "react-native";
import { MessageItem } from "@/src/features/chat/types";

export const MessageItemCard = ({ item }: { item: MessageItem }) => (
  <View className={`mb-3 flex-row ${item.isMine ? 'justify-end' : 'justify-start'}`}>
    <View className={`max-w-[75%] rounded-lg px-4 py-2 ${item.isMine ? 'bg-primary' : 'bg-slate-100'}`}>
      <Text className={`text-base ${item.isMine ? 'text-white' : 'text-slate-900'}`}> {item.content} </Text>
      <Text className={`text-xs mt-1 ${item.isMine ? 'text-blue-100' : 'text-slate-500'}`}>
        {formatTime(new Date(item.createdAt), { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  </View>
);

