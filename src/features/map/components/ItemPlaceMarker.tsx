import type { Post } from "@/src/features/post/types";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Marker, type LatLng } from "react-native-maps";

type ItemPlaceMarkerProps = {
  item: Post;
  coordinate: LatLng;
  disabled: boolean;
  onPress?: () => void;
};

export const ItemPlaceMarker = ({
  item,
  coordinate,
  disabled,
  onPress,
}: ItemPlaceMarkerProps) => {
  const imgUrl = useMemo(() => item.images[0], [item.images]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined,
    );
    onPress?.();
  };

  return (
    <Marker
      coordinate={coordinate}
      focusable={!disabled}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "white",
            padding: 3,

            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.10)",

            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 5 },
          }}
        >
          <Image
            source={{ uri: imgUrl }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    </Marker>
  );
};
