import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  onPress?: () => void;
  accessibilityState?: { selected?: boolean };
};

const PostCreateButton = ({ onPress, accessibilityState }: Props) => {
  return (
    <View className="flex-1 items-center">
      <Pressable
        onPress={onPress}
        hitSlop={12}
        className="items-center justify-center"
        style={({ pressed }) => ({
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          marginTop: -18,
        })}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#007AFF",
            alignItems: "center",
            justifyContent: "center",

            // shadow iOS
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </View>
      </Pressable>
    </View>
  );
}

export default PostCreateButton;
