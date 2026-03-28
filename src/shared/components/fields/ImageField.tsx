import { ensureMediaPermission } from "@/src/shared/services";
import { colors } from "@/src/shared/theme/colors";
import {
  launchImageLibraryAsync,
  type ImagePickerAsset,
  type ImagePickerOptions,
} from "expo-image-picker";
import { CameraIcon, PlusIcon, XIcon } from "phosphor-react-native";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
const MAX_IMAGES = 5;

type ImageFieldProps = {
  value: ImagePickerAsset[];
  onChange: (value: ImagePickerAsset[]) => void;
  disabled?: boolean;
};

export const ImageField = ({
  value,
  onChange,
  disabled = false,
}: ImageFieldProps) => {
  const handlePickImages = async () => {
    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) return;

    const options = {
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    } as ImagePickerOptions;

    const result = await launchImageLibraryAsync(options);
    if (!result.canceled) {
      const imageAssets = result.assets.map(
        (asset) =>
          ({
            ...asset,
            type: "image",
          }) as ImagePickerAsset,
      );

      const newImages = [...value, ...imageAssets].slice(0, MAX_IMAGES);
      onChange(newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  if (value.length === 0) {
    return (
      <View>
        <Text className="text-slate-700 font-bold text-sm mb-2">
          Photos of the Item
        </Text>
        <Text className="text-slate-500 text-xs mb-3">
          Add up to {MAX_IMAGES} clear photos. The more, the better!
        </Text>

        <Pressable
          onPress={handlePickImages}
          disabled={disabled}
          className="border-2 border-dashed border-blue-300 rounded-xl p-8 items-center justify-center bg-blue-50/30"
        >
          <View className="w-16 h-16 bg-blue-100 rounded-2xl items-center justify-center mb-3">
            <CameraIcon size={32} color={colors.primary} />
          </View>

          <Text className="text-slate-900 font-semibold text-base mb-1">
            Add Photos
          </Text>
          <Text className="text-slate-500 text-sm text-center mb-4">
            Select images or take a new photo.
          </Text>

          <View className="bg-primary px-6 py-2.5 rounded-lg">
            <Text className="text-white font-medium text-sm">Upload</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-slate-700 font-medium text-sm mb-2">
        Photos of the Item ({value.length}/{MAX_IMAGES})
      </Text>
      <Text className="text-slate-500 text-xs mb-3">
        Add up to {MAX_IMAGES} clear photos. The more, the better!
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerStyle={{
          gap: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
        }}
      >
        {/* Upload More Button - First Item */}
        {value.length < MAX_IMAGES && (
          <Pressable
            onPress={handlePickImages}
            disabled={disabled}
            className="w-32 h-32 border-2 border-dashed border-blue-300 rounded-xl items-center justify-center bg-blue-50/30"
          >
            <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mb-2">
              <PlusIcon size={24} color={colors.primary} />
            </View>
            <Text className="text-primary font-medium text-xs">Add More</Text>
          </Pressable>
        )}

        {/* Image Cards */}
        {value.map((image, index) => (
          <View key={image.uri} className="relative">
            <View className="w-32 h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                source={{ uri: image.uri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Remove Button */}
            <Pressable
              onPress={() => handleRemoveImage(index)}
              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full items-center justify-center shadow-lg z-10"
            >
              <XIcon size={16} color="white" />
            </Pressable>

            {/* Image Number Badge */}
            <View className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded">
              <Text className="text-white text-xs font-medium">
                {index + 1}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
