import { AppUserAvatarIcon } from "@/src/shared/components/app-utils/AppUserAvatarIcon";
import { TabBarButton } from "@/src/shared/components/app-utils/bottom-tab-bar/TabBarButton";
import { colors, metrics } from "@/src/shared/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StackActions } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import type { IconProps } from "phosphor-react-native";
import {
  BellIcon,
  ChatCircleIcon,
  HouseIcon,
  QrCodeIcon
} from "phosphor-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

type TabIcon = { Icon: React.ElementType<IconProps>; label: string };

const TAB_ICONS: Record<string, TabIcon> = {
  posts: { Icon: HouseIcon, label: "Home" },
  qr: { Icon: QrCodeIcon, label: "QRs" },
  chat: { Icon: ChatCircleIcon, label: "Chat" },
  notification: { Icon: BellIcon, label: "Inbox" },
  profile: { Icon: AppUserAvatarIcon, label: "Profile" },
};

export const TabBarContent = ({ state, navigation }: BottomTabBarProps) => {
  return (
    <View
      style={styles.wrapper}
    >
      <BlurView
        intensity={55}
        tint="systemUltraThinMaterialLight"
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.milk} />
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabConfig = TAB_ICONS[route.name];
          if (!tabConfig) return null;

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
              const nestedIndex =
                typeof nestedState?.index === "number" ? nestedState.index : 0;
              const nestedKey =
                typeof nestedState?.key === "string" ? nestedState.key : undefined;

              if (nestedIndex > 0 && nestedKey) {
                navigation.dispatch({
                  ...StackActions.popToTop(),
                  target: nestedKey,
                });
              }
            }
          };

          return (
            <TabBarButton
              key={route.key}
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
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    height: metrics.tabBar.height,
    ...(Platform.OS === "ios"
      ? metrics.shadows.tabBar.ios
      : metrics.shadows.tabBar.android),
  },
  milk: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: 1,
    borderTopColor: colors["tab-bar"].border,
  },
  tabsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default TabBarContent;
