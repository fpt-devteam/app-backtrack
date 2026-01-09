import { metrics } from "@/src/shared/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { IconProps } from "phosphor-react-native";
import { BellIcon, ChatCircleIcon, HouseIcon, QrCodeIcon } from "phosphor-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreatePostButton } from "./CreatePostButton";
import { TabBarButton } from "./TabBarButton";

// ============================================================================
// TAB CONFIGURATION - Map your route names to icons
// ============================================================================

type TabIcon = {
  Icon: React.ElementType<IconProps>;
  label: string;
};

// Route name → icon mapping (customize for your app)
const TAB_ICONS: Record<string, TabIcon> = {
  posts: {
    Icon: HouseIcon,
    label: "Home",
  },
  "(qr)": {
    Icon: QrCodeIcon,
    label: "QRs",
  },
  "create-post": {
    Icon: HouseIcon, // Placeholder, not used (rendered via CreatePostButton)
    label: "",
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

// ============================================================================
// COMPONENT
// ============================================================================

type Props = BottomTabBarProps & {
  onCreatePress: () => void;
};

export const TabBarContent = ({ state, navigation, onCreatePress }: Props) => {
  const insets = useSafeAreaInsets();

  // Reduce safe area padding - adjust this value to your preference
  // Options:
  // - insets.bottom * 0.5 (half padding - closer)
  // - insets.bottom * 0.3 (very close)
  // - 8 (fixed small padding)
  // - 0 (flush to bottom - not recommended)
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
      {/* Subtle top border */}
      {/* <View className="absolute top-0 left-0 right-0 border-t border-tab-bar-border" /> */}

      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabConfig = TAB_ICONS[route.name];

          // Skip hidden tabs
          if (!tabConfig || route.name === "(profile)") return null;

          // Create post button (center)
          if (route.name === "create-post") {
            return (
              <CreatePostButton
                key={route.key}
                onPress={onCreatePress}
                isFocused={isFocused}
              />
            );
          }

          // Regular tab button
          return (
            <TabBarButton
              key={route.key}
              route={route}
              isFocused={isFocused}
              Icon={tabConfig.Icon}
              label={tabConfig.label}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        })}
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    // Colors via className, only shadow/elevation here
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
