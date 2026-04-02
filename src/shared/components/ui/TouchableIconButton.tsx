import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

type Props = {
  onPress: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
};

export const TouchableIconButton = ({ onPress, icon, disabled }: Props) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={8}
      className="min-h-touch min-w-touch items-center justify-center"
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.9 : 1,
      })}
    >
      {icon}
    </Pressable>
  );
};
