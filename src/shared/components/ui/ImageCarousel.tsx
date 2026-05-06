import { View } from "moti";
import { PackageIcon } from "phosphor-react-native";
import type { ReactNode } from "react";
import { FlatList } from "react-native-gesture-handler";
import { AppImage } from "@/src/shared/components/AppImage";
import { colors } from "@/src/shared/theme";

type ImageCarouselProps = {
  imageUrls: string[];
  height: number;
  width: number;
  isBlurred?: boolean;
  emptyState?: ReactNode;
};

export const ImageCarousel = ({
  imageUrls,
  height,
  width,
  isBlurred = false,
  emptyState,
}: ImageCarouselProps) => {
  if (imageUrls.length === 0) {
    return (
      <View
        style={{ height, width }}
        className="bg-canvas items-center justify-center"
      >
        {emptyState ?? (
          <PackageIcon size={64} color={colors.hof[300]} weight="thin" />
        )}
      </View>
    );
  }

  return (
    <View style={{ height, width }}>
      <FlatList
        data={imageUrls}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <AppImage
            source={{ uri: item }}
            style={{ width, height }}
            resizeMode="cover"
            isBlurred={isBlurred}
          />
        )}
      />
    </View>
  );
};
