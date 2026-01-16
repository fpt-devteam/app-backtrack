import { TabBarButton } from "@/src/shared/components/app-utils/bottom-tab-bar/TabBarButton";
import { metrics } from "@/src/shared/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StackActions } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import type { IconProps } from "phosphor-react-native";
import {
  BellIcon,
  ChatCircleIcon,
  HouseIcon,
  MapTrifoldIcon,
  QrCodeIcon,
} from "phosphor-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIcon = {
  Icon: React.ElementType<IconProps>;
  label: string;
};

const TAB_ICONS: Record<string, TabIcon> = {
  posts: { Icon: HouseIcon, label: "Home" },
  qr: { Icon: QrCodeIcon, label: "QRs" },
  map: { Icon: MapTrifoldIcon, label: "Map" },
  chat: { Icon: ChatCircleIcon, label: "Chat" },
  notification: { Icon: BellIcon, label: "Inbox" },
};

export const TabBarContent = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.round(insets.bottom * 0.5);

  return (
    <BlurView
      intensity={80}
      tint="light"
      style={[
        styles.container,
        {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: bottomPadding,
          height: metrics.tabBar.height + bottomPadding,
        },
      ]}
    >
      {/* Make blur visible like iOS glass */}
      <View pointerEvents="none" style={styles.glassOverlay} />

      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabConfig = TAB_ICONS[route.name];

          if (!tabConfig || route.name === "profile") return null;

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
              const nestedState = route.state as any;
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
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...(Platform.OS === "ios"
      ? metrics.shadows.tabBar.ios
      : metrics.shadows.tabBar.android),
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  tabsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});


