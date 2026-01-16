import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { RelativePathString, router } from "expo-router";
import { MagnifyingGlass, Question } from "phosphor-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export const MatchingNoResultScreen = () => {
  const handleGoToHomepage = () => router.replace(POST_ROUTE.index as RelativePathString);

  return (
    <View className="flex-1 items-center justify-center px-6">
      {/* Icon */}
      <View className="items-center">
        <View className="relative">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-emerald-100/70">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-emerald-600">
              <MagnifyingGlass size={24} color={colors.white} />
            </View>
          </View>

          {/* little ? badge */}
          <View className="absolute -top-1 -right-1 h-7 w-7 items-center justify-center rounded-full bg-white border border-black/10">
            <Question size={16} color={colors.slate[500]} />
          </View>
        </View>
      </View>

      {/* Text */}
      <View className="mt-6 items-center">
        <Text className="text-[22px] font-semibold text-black">
          No Matches Found Yet
        </Text>

        <Text className="mt-2 text-center text-[13px] leading-5 text-black/55 max-w-[320px]">
          Backtrack AI will keep scanning the network for new items. In the
          meantime, you can browse all recent posts.
        </Text>
      </View>

      {/* Actions */}
      <View className="mt-7 w-full max-w-[360px]">
        <TouchableOpacity
          onPress={handleGoToHomepage}
          className="mt-3 h-12 w-full items-center justify-center rounded-full bg-white border border-black/10 active:opacity-90"
        >
          <Text className="text-[14px] font-semibold text-black/80">
            Back to homepage
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
