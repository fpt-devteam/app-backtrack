import * as Haptics from "expo-haptics";
import { TouchableOpacity } from "react-native";

type Props = {
  onPress: () => void;
  icon: React.ReactNode;
};

export const TouchableIconButton = ({ onPress, icon }: Props) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity className="p-2" onPress={handlePress}>
      {icon}
    </TouchableOpacity>
  );
};