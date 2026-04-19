import PostCreateOptionsBottomSheet from "@/src/features/post/components/PostCreateOptionsBottomSheet";
import { AppUserAvatarIcon } from "@/src/shared/components/AppUserAvatarIcon";
import { TabBarButton } from "@/src/shared/components/app-utils/TabBarButton";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StackActions } from "@react-navigation/native";
import { router } from "expo-router";
import type { IconProps } from "phosphor-react-native";
import {
  BellIcon,
  HandshakeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type TabIcon = { Icon: React.ElementType<IconProps>; label: string };

const TAB_ICONS: Record<string, TabIcon> = {
  post: { Icon: MagnifyingGlassIcon, label: "Explore" },
  handover: { Icon: HandshakeIcon, label: "Handover" },
  chat: { Icon: BellIcon, label: "Inbox" },
  profile: { Icon: AppUserAvatarIcon, label: "You" },
};

export const TabBarContent = ({ state, navigation }: BottomTabBarProps) => {
  const [isCreateOptionsVisible, setIsCreateOptionsVisible] = useState(false);
  const leadingRoutes = state.routes.slice(0, 2); // -> post, handover
  const trailingRoutes = state.routes.slice(2); // -> inbox, profile

  // Auto-hide tab bar on nested screens (any screen deeper than the tab's index)
  const focusedRoute = state.routes[state.index];
  const isNested = (focusedRoute?.state?.index ?? 0) > 0;

  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(isNested ? metrics.tabBar.height : 0, {
      duration: metrics.motion.duration.normal,
    });
  }, [isNested, translateY]);

  const tabBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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

  const handleCloseCreateOptions = () => {
    router.dismissAll();
  };

  return (
    <>
      <Animated.View
        className="absolute left-0 right-0 bottom-0 bg-surface border-t flex-1 flex-row"
        style={[
          { borderColor: colors.muted, height: metrics.tabBar.height },
          tabBarAnimatedStyle,
        ]}
      >
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
      </Animated.View>

      <PostCreateOptionsBottomSheet
        isVisible={isCreateOptionsVisible}
        onClose={handleCloseCreateOptions}
      />
    </>
  );
};

export default TabBarContent;
