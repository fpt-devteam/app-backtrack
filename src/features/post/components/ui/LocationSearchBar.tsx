import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import { MapPinIcon } from "phosphor-react-native";
import { Pressable, Text, View } from "react-native";

type LocationSearchBarProps = {
  onPress?: () => void;
  showSpacer?: boolean;
  placeholder?: string;
};

const LocationSearchBar = ({
  onPress,
  showSpacer = true,
  placeholder = "Search by location..."
}: LocationSearchBarProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(POST_ROUTE.searchLocation);
    }
  };

  return (
    <View className="flex-row items-center mt-3">
      {/* Spacer to align with search bar above */}
      {showSpacer && <View className="mr-2 w-12" />}

      <Pressable
        onPress={handlePress}
        className="flex-1 flex-row items-center border-2 rounded-2xl px-3 h-12"
        style={{ borderColor: colors.slate[200] }}
      >
        <MapPinIcon size={20} color={colors.slate[500]} />
        <Text
          className="flex-1 ml-2 text-base"
          style={{ color: colors.slate[400] }}
          numberOfLines={1}
        >
          {placeholder}
        </Text>
      </Pressable>
    </View>
  );
};

export default LocationSearchBar;
