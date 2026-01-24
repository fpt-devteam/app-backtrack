import { AppLogo } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import type { ExternalPathString, RelativePathString } from "expo-router";
import { router } from "expo-router";
import {
  MagnifyingGlassIcon,
  MapTrifoldIcon,
  PlusCircleIcon,
} from "phosphor-react-native";
import React from "react";
import { Pressable, View } from "react-native";

type HeaderAction = {
  key: string;
  Icon: React.ElementType<{ size: number; color: string; weight?: any }>;
  onPress: () => void;
};

export const PostHomeScreenHeader = () => {
  const actions: HeaderAction[] = [
    {
      key: "create",
      Icon: PlusCircleIcon,
      onPress: () => {
        router.push(
          "/(bottom-sheet)/post-menu" as ExternalPathString | RelativePathString
        );
      },
    },
    {
      key: "search",
      Icon: MagnifyingGlassIcon,
      onPress: () => {
        router.push(POST_ROUTE.search as ExternalPathString | RelativePathString);
      },
    },
    {
      key: "map",
      Icon: MapTrifoldIcon,
      onPress: () => {
        router.push("/map" as ExternalPathString | RelativePathString);
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
