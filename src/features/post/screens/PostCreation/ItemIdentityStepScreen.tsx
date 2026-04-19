import { APP_IMAGES } from "@/src/shared/constants";
import { useUploadImage } from "@/src/shared/hooks";
import { Nullable } from "@/src/shared/types";
import { ImagePickerAsset } from "expo-image-picker";
import { View } from "moti";
import { ImageIcon, XIcon } from "phosphor-react-native";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_IMAGES = 5;

const BUTTON_ICONS: ImageSourcePropType[] = [
  APP_IMAGES.CAMERA,
  APP_IMAGES.GALLERY,
];

const ItemIdentityStepScreen = () => {
  const { uploadImages, isUploadingImages } = useUploadImage();

  const [images, setImages] = useState<ImagePickerAsset[]>([]);

  const handleChangeImages = async (newImages: ImagePickerAsset[]) => {
    setImages(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    handleChangeImages(newImages);
  };

  const isDisabledAction = isUploadingImages || images.length >= MAX_IMAGES;

  return (
    <SafeAreaView className="flex-1 bg-surface px-xl pb-xl">
      {/* Header Section */}
      <View className="py-lg bg-surface ">
        <Text className="text-textPrimary font-normal text-2xl pr-xl tracking-tight">
          Add some photos of your item
        </Text>
        <Text className="text-textSecondary text-base font-thin mt-2">
          You can add up to {MAX_IMAGES} photos. High-quality images help our AI
          identify your item more accurately.
        </Text>
      </View>

      {/* Image Card Section*/}
      <View className="flex-1 flex-row flex-wrap justify-between px-lg mt-6 border">
        {images.map((image, index) => (
          <ImageCard
            key={index}
            image={image}
            onRemove={() => handleRemoveImage(index)}
            onPress={() => {}}
            isFirstImage={index === 0}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const ImageCard = ({
  image,
  onRemove,
  isFirstImage,
  onPress,
}: {
  image: Nullable<ImagePickerAsset>;
  onRemove: () => void;
  onPress: () => void;
  isFirstImage: boolean;
}) => {
  const imageWidth = isFirstImage ? "100%" : "48%";
  const imageBorder = !image
    ? "border border-dashed border-mutedForeground"
    : "";

  if (!image)
    return (
      <Pressable
        className={`flex-1 items-center justify-center ${imageBorder} ${imageWidth}`}
        onPress={onPress}
      >
        <ImageIcon size={32} />
      </Pressable>
    );

  return (
    <View className="relative">
      <Image
        source={{ uri: image.uri }}
        className={`${imageBorder}  ${imageWidth} aspect-square rounded-lg`}
        resizeMode="cover"
      />

      <TouchableOpacity
        className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
        onPress={onRemove}
      >
        <XIcon size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ItemIdentityStepScreen;
