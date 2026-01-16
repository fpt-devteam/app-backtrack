import { DotsThreeIcon } from "phosphor-react-native";
import { Pressable } from "react-native";
import colors from "@/src/shared/theme/colors";

export const DotThreeButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      hitSlop={10}
    >
      <DotsThreeIcon size={36} color={colors.slate[900]} weight="bold" />
    </Pressable>
  );
};