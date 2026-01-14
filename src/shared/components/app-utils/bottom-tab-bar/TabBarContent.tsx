import { metrics } from "@/src/shared/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StackActions } from "@react-navigation/native";
import type { IconProps } from "phosphor-react-native";
import { BellIcon, ChatCircleIcon, HouseIcon, MapTrifoldIcon, QrCodeIcon } from "phosphor-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreatePostButton } from "./CreatePostButton";
import { TabBarButton } from "./TabBarButton";

type TabIcon = {
  Icon: React.ElementType<IconProps>;
  label: string;
};

const TAB_ICONS: Record<string, TabIcon> = {
  posts: {
    Icon: HouseIcon,
    label: "Home",
  },
  qr: {
    Icon: QrCodeIcon,
    label: "QRs",
  },
  map: {
    Icon: MapTrifoldIcon,
    label: "Map",
  },
  chat: {
    Icon: ChatCircleIcon,
    label: "Chat",
  },
  notification: {
    Icon: BellIcon,
    label: "Inbox",
  },
};

type Props = BottomTabBarProps & {
  onCreatePress: () => void;
};

export const TabBarContent = ({ state, navigation, onCreatePress }: Props) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom * 0.5;

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-tab-bar-background"
      style={[
        styles.container,
        {
          paddingBottom: bottomPadding,
          height: metrics.tabBar.height + bottomPadding,
        },
      ]}
    >

      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabConfig = TAB_ICONS[route.name];

          if (!tabConfig || route.name === "(profile)") return null;

          const handlePress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              return;
            }

            if (isFocused && !event.defaultPrevented) {
              const nestedState = route.state;
              const nestedIndex = typeof nestedState?.index === "number" ? nestedState.index : 0;
              const nestedKey = typeof nestedState?.key === "string" ? nestedState.key : undefined;

              if (nestedIndex > 0 && nestedKey) {
                console.log("Popping to top for nested navigator:", route.name);
                navigation.dispatch({
                  ...StackActions.popToTop(),
                  target: nestedKey,
                });
              }
            }
          };

          if (route.name === "chat") {
            return (
              <React.Fragment key={route.key}>
                <CreatePostButton
                  onPress={onCreatePress}
                  isFocused={false}
                />
                <TabBarButton
                  route={route}
                  isFocused={isFocused}
                  Icon={tabConfig.Icon}
                  label={tabConfig.label}
                  onPress={handlePress}
                />
              </React.Fragment>
            );
          }

          return (
            <TabBarButton
              key={route.key}
              route={route}
              isFocused={isFocused}
              Icon={tabConfig.Icon}
              label={tabConfig.label}
              onPress={handlePress}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...(Platform.OS === 'ios' ? metrics.shadows.tabBar.ios : metrics.shadows.tabBar.android),
  },
  tabsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default TabBarContent;
