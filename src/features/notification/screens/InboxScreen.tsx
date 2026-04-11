import { ChatScreen } from "@/src/features/chat/screens";
import NotificationScreen from "@/src/features/notification/screens/NotificationScreen";
import { colors } from "@/src/shared/theme";
import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
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
  <View className="flex-1 bg-surface">
    <ChatScreen />
  </View>
);

const NotificationScene = () => (
  <View className="flex-1 bg-surface">
    <NotificationScreen />
  </View>
);

const renderScene = SceneMap({
  chat: ChatScene,
  notification: NotificationScene,
});

const CustomTabBar = (props: RNTabBarProps<InboxRoute>) => {
  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.black }}
      indicatorContainerStyle={{
        borderBottomWidth: 0.5,
        borderBottomColor: colors.hof[500],
      }}
      style={{
        backgroundColor: "transparent",
      }}
      activeColor={colors.black}
      inactiveColor={colors.hof[400]}
      options={Object.fromEntries(
        props.navigationState.routes.map((route) => [
          route.key,
          {
            labelText: route.title,
            labelStyle: { fontWeight: "500" },
            fontSize: 14,
          },
        ]),
      )}
    />
  );
};

const InboxScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState<InboxRoute[]>([
    { key: "chat", title: "Messages" },
    { key: "notification", title: "Notifications" },
  ]);

  return (
    <View className="flex-1 bg-surface">
      <TabView<InboxRoute>
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ backgroundColor: "transparent" }}
        renderTabBar={CustomTabBar}
        swipeEnabled={true}
      />
    </View>
  );
};

export default InboxScreen;
