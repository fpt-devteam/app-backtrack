import {
  ConversationList,
  MessageSearchBar,
} from "@/src/features/chat/components";
import {
  AppHeader,
  HeaderTitle,
  TouchableIconButton,
} from "@/src/shared/components";
import { colors } from "@/src/shared/theme/colors";
import { NotePencilIcon } from "phosphor-react-native";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ConverationScreenHeader = () => {
  const handleCreateNewConversation = async () => {
    console.log("create new converstaion");
  };

  return (
    <AppHeader
      left={<HeaderTitle title="Conversation" />}
      right={
        <TouchableIconButton
          onPress={handleCreateNewConversation}
          icon={
            <NotePencilIcon size={24} weight="bold" color={colors.primary} />
          }
        />
      }
    />
  );
};

export const ChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChat = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <ConverationScreenHeader />

      {/*  Body */}
      <View className="flex-1 gap-4">
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
          <ConversationList />
        </View>
      </View>
    </SafeAreaView>
  );
};
