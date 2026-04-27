import { useAppUser } from "@/src/features/auth/providers";
import { AppUserAvatarIcon } from "@/src/shared/components/AppUserAvatarIcon";
import { TabBarButton } from "@/src/shared/components/app-utils/TabBarButton";
import { AUTH_ROUTE, POST_ROUTE } from "@/src/shared/constants";
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
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { toast } from "../ui/toast";

type TabIcon = { Icon: React.ElementType<IconProps>; label: string };

const TAB_ICONS: Record<string, TabIcon> = {
  post: { Icon: MagnifyingGlassIcon, label: "Explore" },
  handover: { Icon: HandshakeIcon, label: "Handover" },
  chat: { Icon: BellIcon, label: "Inbox" },
  profile: { Icon: AppUserAvatarIcon, label: "You" },
};

export const TabBarContent = ({ state, navigation }: BottomTabBarProps) => {
  const { user } = useAppUser();

  const leadingRoutes = state.routes.slice(0, 2); // -> post, handover
  const trailingRoutes = state.routes.slice(2); // -> inbox, profile

  // Auto-hide tab bar on nested screens.
  // Two cases require hiding:
  //   1. Normal in-tab push: the tab stack has depth > 0.
  //   2. Cross-tab navigate: Expo Router lands the destination screen at index 0
  //      as the only entry in the stack (no 'index' screen below it), so we also
  //      hide when the current screen name is not the root 'index' screen.
  const focusedRoute = state.routes[state.index];
  const focusedNestedState = focusedRoute?.state;
  const focusedNestedIndex = focusedNestedState?.index ?? 0;
  const currentNestedRoute = focusedNestedState?.routes?.[focusedNestedIndex];
  const isNested =
    focusedNestedIndex > 0 ||
    (currentNestedRoute?.name !== undefined &&
      currentNestedRoute.name !== "index");

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
    if (!user) {
      router.push(AUTH_ROUTE.onboarding);
      return;
    }

    if (!user.phone) {
      toast.error("You need to verify your phone number.");
      return;
    }

    router.push(POST_ROUTE.create);
  };

  return (
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
  );
};

export default TabBarContent;
