import { Text, View } from "react-native";
import { PostType } from "../types";

const PostStatusBadge = ({ status }: { status: PostType }) => {
  if (status === PostType.Lost) {
    return (
      <View className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-orange-100">
        <View className="w-2 h-2 rounded-full bg-orange-500" />
        <Text className="text-xs font-bold text-orange-800">Lost</Text>
      </View>
    );
  } else if (status === PostType.Found) {
    return (
      <View className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-green-100">
        <View className="w-2 h-2 rounded-full bg-green-600" />
        <Text className="text-xs font-bold text-green-800">Found</Text>
      </View>
    );
  } else {
    return (
      <View className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-200">
        <View className="w-2 h-2 rounded-full bg-slate-500" />
        <Text className="text-xs font-bold text-slate-700">Resolved</Text>
      </View>
    );
  }
};

export default PostStatusBadge;
