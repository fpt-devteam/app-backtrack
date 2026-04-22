import { colors } from "@/src/shared/theme";
import { MagnifyingGlass, Question } from "phosphor-react-native";
import { Text, View } from "react-native";

export const MatchingNoResultScreen = () => {
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
          <View className="absolute -top-1 -right-1 h-7 w-7 items-center justify-center rounded-full bg-surface border border-black/10">
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
    </View>
  );
};
