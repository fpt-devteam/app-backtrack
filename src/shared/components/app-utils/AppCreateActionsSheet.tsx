import { POST_ROUTE } from "@/src/shared/constants";
import { router } from "expo-router";
import { PackageIcon } from "phosphor-react-native";
import { Pressable, Text, View } from "react-native";
import { BottomSheet } from "../ui";

type AppCreateActionsSheetProps = {
  isVisible: boolean;
  onClose: () => void;
};

const AppCreateActionsSheet = ({ isVisible, onClose }: AppCreateActionsSheetProps) => {
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
        <Text className="text-2xl font-bold text-primary mb-4">
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
              <PackageIcon size={56} color="#000" weight="duotone" />
            </View>
            <Text className="text-base font-bold text-gray-900 mb-1 text-center">
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
              <PackageIcon size={56} color="#000" weight="duotone" />
            </View>
            <Text className="text-base font-bold text-gray-900 mb-1 text-center">
              Add Found Item
            </Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  )
};

export default AppCreateActionsSheet;
