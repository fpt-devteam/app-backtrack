import { PostList } from "@/src/features/post/components";
import { AppLogo } from "@/src/shared/components";
import { MAP_ROUTE, POST_ROUTE } from "@/src/shared/constants";
import { router } from "expo-router";
import {
  IconProps,
  MagnifyingGlassIcon,
  MapTrifoldIcon,
} from "phosphor-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderAction = {
  key: string;
  Icon: React.ComponentType<IconProps>;
  onPress: () => void;
};

const PostHomeScreenHeader = () => {
  const actions: HeaderAction[] = [
    {
      key: "map",
      Icon: MapTrifoldIcon,
      onPress: () => {
        router.push(MAP_ROUTE.index);
      },
    },
    {
      key: "search",
      Icon: MagnifyingGlassIcon,
      onPress: () => {
        router.push(POST_ROUTE.search);
      },
    },
  ];

  return (
    <View className="h-[48] px-4 py-2 flex-row justify-start">
      <View className="flex-1 justify-center">
        <AppLogo width={180} height={40} />
      </View>

      <View className="flex-row gap-6 items-center">
        {actions.map(({ key, Icon, onPress }) => (
          <Pressable key={key} onPress={onPress} hitSlop={10}>
            <Icon size={24} color="black" weight="bold" />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export const PostScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <PostHomeScreenHeader />
      <View className="flex-1 p-4 px-2" style={{ marginBottom: 48 }}>
        <PostList />
      </View>
    </SafeAreaView>
  );
};
