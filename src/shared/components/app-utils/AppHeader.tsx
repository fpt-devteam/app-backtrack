import { router } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import { Pressable, Text, View } from "react-native";
import colors from "../../theme/colors";

type AppHeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

const AppHeader = ({
  title,
  showBackButton = true,
  onBackPress
}: AppHeaderProps) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      className="bg-white border-b border-gray-200"
    >
      <View className="flex-row items-center justify-center px-4 py-3 relative">
        {/* Back Button */}
        {showBackButton && (
          <Pressable
            onPress={handleBackPress}
            className="absolute left-4"
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              top: 12
            })}
          >
            <ArrowLeftIcon size={24} color={colors.black} weight="bold" />
          </Pressable>
        )}

        {/* Centered Title */}
        <Text className="text-xl font-bold text-black">
          {title}
        </Text>
      </View>
    </View>
  );
};

export default AppHeader;
