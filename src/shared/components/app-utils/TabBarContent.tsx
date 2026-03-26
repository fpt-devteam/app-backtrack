import { AppUserAvatarIcon } from "@/src/shared/components/app-utils/AppUserAvatarIcon";
import { TabBarButton } from "@/src/shared/components/app-utils/TabBarButton";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StackActions } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import type { IconProps } from "phosphor-react-native";
import {
  ChatCircleIcon,
  HouseIcon,
  PlusIcon,
  QrCodeIcon,
} from "phosphor-react-native";
import React from "react";
import { Pressable, View } from "react-native";

type TabIcon = { Icon: React.ElementType<IconProps>; label: string };

const TAB_ICONS: Record<string, TabIcon> = {
  posts: { Icon: HouseIcon, label: "Home" },
  qr: { Icon: QrCodeIcon, label: "QRs" },
  chat: { Icon: ChatCircleIcon, label: "Chat" },
  profile: { Icon: AppUserAvatarIcon, label: "You" },
};

export const TabBarContent = ({ state, navigation }: BottomTabBarProps) => {
  const visibleRoutes = state.routes.filter(
    (route) => route.name !== "notification",
  );

  const leadingRoutes = visibleRoutes.slice(0, 2); // -> posts, qr
  const trailingRoutes = visibleRoutes.slice(2); // -> chat, profile

  const renderTabButton = (route: (typeof state.routes)[number]) => {
    const index = state.routes.findIndex((item) => item.key === route.key);
    if (index < 0) return null;

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
  };

  const handleAddPress = () => {
    router.push(POST_ROUTE.create);
  };

  return (
    <View
      className="absolute left-0 right-0 bottom-0"
      style={{ height: metrics.tabBar.height }}
    >
      <BlurView
        intensity={55}
        tint="systemUltraThinMaterialLight"
        className="absolute inset-0"
      />

      <View className="flex-1 flex-row items-center justify-around">
        {leadingRoutes.map((route) => renderTabButton(route))}

        {/* Add Button */}
        <View className="w-[72px] items-center justify-center">
          <Pressable
            onPress={handleAddPress}
            className="w-14 h-14 rounded-full bg-primary items-center justify-center -translate-y-[16px]"
          >
            <PlusIcon size={24} color={colors.white} weight="bold" />
          </Pressable>
        </View>

        {trailingRoutes.map((route) => renderTabButton(route))}
      </View>
    </View>
  );
};

export default TabBarContent;
