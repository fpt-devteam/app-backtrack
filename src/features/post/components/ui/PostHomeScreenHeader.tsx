import { AppUserAvatarIcon } from "@/src/shared/components";
import { AppLogo } from "@/src/shared/components/app-utils";
import { POST_ROUTE } from "@/src/shared/constants";
import type { ExternalPathString, RelativePathString } from "expo-router";
import { router } from "expo-router";
import { MagnifyingGlassIcon, PlusCircleIcon } from "phosphor-react-native";
import { Pressable, View } from "react-native";

export const PostHomeScreenHeader = () => {
  return (
    <View className="h-[48] px-4 py-2 flex-row justify-start">
      <View className="flex-1 justify-center">
        <AppLogo width={180} height={40} />
      </View>

      {/* Search and Avatar */}
      <View className="flex-row gap-3 items-center">
        <View className="flex-row gap-2 justify-center">
          <Pressable
            onPress={() => {
              router.push(
                "/(bottom-sheet)/post-menu" as
                | ExternalPathString
                | RelativePathString,
              );
            }}
          >
            <PlusCircleIcon size={24} color="black" />
          </Pressable>

          <Pressable
            onPress={() => {
              router.push(
                POST_ROUTE.search as ExternalPathString | RelativePathString,
              );
            }}
          >
            <MagnifyingGlassIcon size={24} color="black" />
          </Pressable>
        </View>
        <View className="justify-center">
          <AppUserAvatarIcon />
        </View>
      </View>
    </View>
  );
};
