import { POST_ROUTE } from "@/src/shared/constants";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { BottomSheet } from "../ui";

const LOST_ITEM_ICON = require("@/assets/icons/lost_item.png");
const FOUND_ITEM_ICON = require("@/assets/icons/search_item.png");

type AppCreateActionsSheetProps = {
  isVisible: boolean;
  onClose: () => void;
};

const AppCreateActionsSheet = ({ isVisible, onClose }: AppCreateActionsSheetProps) => {
  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <View className="bg-white pt-6 pl-6 pb-0 gap-4">
        {/* Lost */}
        <Pressable onPress={() => {
          onClose();
          router.push({
            pathname: POST_ROUTE.create,
            params: { postType: "Lost" }
          });
        }} className="rounded-3xl flex-row items-center">
          <Image source={LOST_ITEM_ICON} className="h-12 w-12 mr-4" resizeMode="contain" />
          <Text className="text-lg  text-gray-900">Add Lost Post</Text>
        </Pressable>

        {/* Found */}
        <Pressable onPress={() => {
          onClose();
          router.push({
            pathname: POST_ROUTE.create,
            params: { postType: "Found" }
          });
        }} className="rounded-3xl flex-row items-center">
          <Image source={FOUND_ITEM_ICON} className="h-12 w-12 mr-4" resizeMode="contain" />
          <Text className="text-lg  text-gray-900">Add Found Post</Text>
        </Pressable>
      </View>
    </BottomSheet>
  )
};

export default AppCreateActionsSheet;
