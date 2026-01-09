import { colors } from "@/src/shared/theme";
import { ArrowLeft, Check } from "phosphor-react-native";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LocationScreenHeaderProps = {
  readonly onBack: () => void;
  readonly onConfirm: () => void;
};

export default function LocationScreenHeader({
  onBack,
  onConfirm,
}: LocationScreenHeaderProps) {
  return (
    <SafeAreaView
      style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      pointerEvents="box-none"
    >
      <View className="flex-row items-center p-4" pointerEvents="box-none">
        <Pressable
          onPress={onBack}
          hitSlop={10}
          className="mr-2 h-12 w-12 items-center justify-center rounded-2xl bg-white"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <ArrowLeft size={20} color={colors.slate[700]} />
        </Pressable>

        <View className="flex-1" />

        <Pressable
          onPress={onConfirm}
          hitSlop={10}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-600"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Check size={20} color="#fff" weight="bold" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
