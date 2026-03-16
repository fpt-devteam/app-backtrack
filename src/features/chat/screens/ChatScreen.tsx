import {
  ConversationList,
  MessageSearchBar,
} from "@/src/features/chat/components";
import { AppHeader, HeaderTitle } from "@/src/shared/components";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChat = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SafeAreaView className="flex-1 bg-background gap-4">
      <View>
        <AppHeader left={<HeaderTitle title="Conversation" />} />
      </View>

      {/* Search Bar */}
      <View className="px-4">
        <MessageSearchBar
          value={searchQuery}
          onChangeText={handleSearchChat}
          placeholder="Search messages..."
        />
      </View>

      {/* Conversation List */}
      <View className="flex-1">
        <ConversationList mode="vertical" />
      </View>
    </SafeAreaView>
  );
};
