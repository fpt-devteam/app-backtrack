import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import { AppImage } from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import { Nullable } from "@/src/shared/types";
import { ImageIcon, XIcon } from "phosphor-react-native";

import { type ImagePickerAsset } from "expo-image-picker";

type AppImageSlotProps = {
  image: Nullable<ImagePickerAsset>;
  size: number;
  onPress: () => void;
  onRemove: () => void;
};

export const AppImageSlot = ({
  image,
  size,
  onPress,
  onRemove,
}: AppImageSlotProps) => {
  if (!image) {
    return (
      <View
        className="border border-dashed border-mutedForeground overflow-hidden aspect-[4/3]"
        style={{ width: size }}
      >
        <Pressable
          onPress={onPress}
          className="w-full h-full items-center justify-center"
        >
          <ImageIcon size={32} color={colors.mutedForeground} weight="thin" />
        </Pressable>
      </View>
    );
  }

  return (
    <View className="overflow-hidden aspect-[4/3]" style={{ width: size }}>
      <AppImage
        source={{ uri: image.uri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />

      <TouchableOpacity
        className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
        onPress={onRemove}
        hitSlop={8}
      >
        <XIcon size={14} color={colors.white} weight="thin" />
      </TouchableOpacity>
    </View>
  );
};
