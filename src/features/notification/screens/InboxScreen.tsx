import { ChatScreen } from "@/src/features/chat/screens";
import NotificationScreen from "@/src/features/notification/screens/NotificationScreen";
import { colors, typography } from "@/src/shared/theme";
import { Stack } from "expo-router";
import React, { useMemo, useState } from "react";
import { TextStyle, View, useWindowDimensions } from "react-native";
import type {
  TabBarProps as RNTabBarProps,
  Route,
} from "react-native-tab-view";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useUnreadNotificationCount } from "../hooks";

type InboxRoute = {
  key: Route["key"];
  title: string;
};

const ChatScene = () => (
  <View className="flex-1 bg-surface">
    <ChatScreen />
  </View>
);

const NotificationScene = () => {
  const { count } = useUnreadNotificationCount();

  return (
    <View className="flex-1 bg-surface">
      <NotificationScreen />
    </View>
  );
};

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
    />
  );
};

const InboxScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const { count } = useUnreadNotificationCount();

  const displayCount = useMemo(() => {
    if (count === 0) return "";
    if (count > 99) return "99+";
    return count.toString();
  }, [count]);

  const [routes] = useState<InboxRoute[]>([
    { key: "chat", title: "Messages" },
    {
      key: "notification",
      title: `Notifications ${displayCount !== "" ? `(${displayCount})` : ""}`,
    },
  ]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Inbox",
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

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
    </>
  );
};

export default InboxScreen;
