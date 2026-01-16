import { BottomSheet } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import colors from "@/src/shared/theme/colors";
import { router } from "expo-router";
import { BinocularsIcon, PackageIcon } from "phosphor-react-native";
import { Pressable, Text, View } from "react-native";

type AppCreateActionsSheetProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const AppCreateActionsSheet = ({ isVisible, onClose }: AppCreateActionsSheetProps) => {
  const handlePress = (postType: "Lost" | "Found") => {
    onClose();
    router.push({
      pathname: POST_ROUTE.create,
      params: { postType }
    });
  };

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <View className="px-6 pb-6">
        {/* Title */}
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Add a New Post
        </Text>

        {/* Cards Container */}
        <View className="flex-row gap-3">
          {/* Lost Item Card */}
          <Pressable
            onPress={() => handlePress("Lost")}
            className="flex-1 bg-gray-100 rounded-2xl p-6 items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="mb-3">
              <BinocularsIcon size={56} color={colors.black} weight="regular" />
            </View>
            <Text className="text-base font-medium text-gray-900 mb-1 text-center">
              Add Lost Item
            </Text>
          </Pressable>

          {/* Found Item Card */}
          <Pressable
            onPress={() => handlePress("Found")}
            className="flex-1 bg-gray-100 rounded-2xl p-6 items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="mb-3">
              <PackageIcon size={56} color={colors.black} weight="regular" />
            </View>
            <Text className="text-base font-medium text-gray-900 mb-1 text-center">
              Add Found Item
            </Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  )
};


