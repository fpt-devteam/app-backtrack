import * as Haptics from "expo-haptics";
import { TouchableOpacity } from "react-native";

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
    <TouchableOpacity
      className="p-2"
      onPress={handlePress}
      disabled={disabled}
      hitSlop={10}
    >
      {icon}
    </TouchableOpacity>
  );
};
