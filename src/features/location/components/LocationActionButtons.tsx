import { colors } from "@/src/shared/theme";
import { Crosshair } from "phosphor-react-native";
import { ActivityIndicator, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RadiusControl from "./RadiusControl";

type LocationActionButtonsProps = {
  readonly radius: number;
  readonly loadingLocation: boolean;
  readonly onGetCurrentPosition: () => void;
  readonly onRadiusChange: (radius: number) => void;
};

export default function LocationActionButtons({
  radius,
  loadingLocation,
  onGetCurrentPosition,
  onRadiusChange,
}: LocationActionButtonsProps) {
  return (
    <SafeAreaView
      style={{ position: "absolute", bottom: 20, right: 20 }}
      pointerEvents="box-none"
    >
      <View className="gap-3">
        {/* My Location */}
        <Pressable
          onPress={onGetCurrentPosition}
          disabled={loadingLocation}
          className="h-14 w-14 bg-white rounded-2xl items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {loadingLocation ? (
            <ActivityIndicator size="small" color={colors.blue[600]} />
          ) : (
            <Crosshair size={24} color={colors.slate[700]} weight="bold" />
          )}
        </Pressable>

        {/* Radius Control */}
        <RadiusControl radius={radius} onChange={onRadiusChange} />
      </View>
    </SafeAreaView>
  );
}
