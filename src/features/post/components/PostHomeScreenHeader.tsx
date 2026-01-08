import { View } from "react-native";

import { AppBrand, AppUserAvatarIcon } from "@/src/shared/components";

const PostHomeScreenHeader = () => {
  return (
    <View className="h-[48] px-4 py-2 flex-row bg-white border-b border-gray-200">
      <View className="flex-1">
        <AppBrand />
      </View>

      {/* Search and Avatar */}
      <View className="flex-row gap-3 items-center">
        {/* Search Icon */}
        {/* <View className="h-full justify-center">
          <Pressable onPress={() => {
            console.log("Search pressed");
            router.push(POST_ROUTE.searchLocation);
          }}>
            <Ionicons name="search-outline" size={24} color="black" />
          </Pressable>
        </View> */}

        {/* User Avatar */}
        <View className="h-full justify-center">
          <AppUserAvatarIcon />
        </View>
      </View>
    </View>
  );
};

export default PostHomeScreenHeader;
