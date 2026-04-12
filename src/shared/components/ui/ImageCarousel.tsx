import { View } from "moti";
import { PackageIcon } from "phosphor-react-native";
import { Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { colors } from "../../theme";

type ImageCarouselProps = {
  imageUrls: string[];
  height: number;
  width: number;
};

export const ImageCarousel = ({
  imageUrls,
  height,
  width,
}: ImageCarouselProps) => {
  if (imageUrls.length === 0) {
    return (
      <View
        style={{ height, width }}
        className="bg-canvas items-center justify-center"
      >
        <PackageIcon size={64} color={colors.hof[300]} weight="thin" />
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
          <Image
            source={{ uri: item }}
            style={{ width, height }}
            resizeMode="cover"
          />
        )}
      />
    </View>
  );
};
