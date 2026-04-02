import { ChatScreen } from "@/src/features/chat/screens";
import NotificationScreen from "@/src/features/notification/screens/NotificationScreen";
import { AppHeader } from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import React, { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type {
  TabBarProps as RNTabBarProps,
  Route,
} from "react-native-tab-view";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

type InboxRoute = {
  key: Route["key"];
  title: string;
};

const ChatScene = () => (
  <View className="flex-1 bg-surface py-2">
    <ChatScreen />
  </View>
);

const NotificationScene = () => (
  <View className="flex-1 bg-surface py-2">
    <NotificationScreen />
  </View>
);

const renderScene = SceneMap({
  chat: ChatScene,
  notification: NotificationScene,
});

const CustomTabBar = (props: RNTabBarProps<InboxRoute>) => {
  const layout = useWindowDimensions();

  const TAB_COUNT = props.navigationState.routes.length;
  const TAB_WIDTH = layout.width / TAB_COUNT;
  const INDICATOR_WIDTH = 24;
  const INDICATOR_MARGIN = (TAB_WIDTH - INDICATOR_WIDTH) / 2;

  return (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.black,
        width: INDICATOR_WIDTH,
        marginLeft: INDICATOR_MARGIN,
      }}
      indicatorContainerStyle={{
        borderBottomWidth: 0.5,
        borderBottomColor: colors.slate[500],
      }}
      style={{
        backgroundColor: "transparent",
      }}
      activeColor={colors.black}
      inactiveColor={colors.slate[400]}
      options={Object.fromEntries(
        props.navigationState.routes.map((route) => [
          route.key,
          {
            labelText: route.title,
            labelStyle: { fontWeight: "700" },
          },
        ]),
      )}
    />
  );
};

const InboxScreenHeader = () => (
  <AppHeader
    center={<Text className="text-lg font-bold text-textPrimary">Inbox</Text>}
  />
);

const InboxScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState<InboxRoute[]>([
    { key: "chat", title: "Chat" },
    { key: "notification", title: "Notification" },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <InboxScreenHeader />

      <TabView<InboxRoute>
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ backgroundColor: "transparent" }}
        renderTabBar={CustomTabBar}
        swipeEnabled={true}
      />
    </SafeAreaView>
  );
};

export default InboxScreen;
