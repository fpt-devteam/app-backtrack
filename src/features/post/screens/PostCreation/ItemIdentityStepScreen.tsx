import { usePostCreationStore } from "@/src/features/post/hooks";
import { MenuBottomSheet, type MenuOption } from "@/src/shared/components/ui/MenuBottomSheet";
import { toast } from "@/src/shared/components/ui/toast";
import { ensureMediaPermission } from "@/src/shared/services";
import { colors } from "@/src/shared/theme/colors";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  type ImagePickerAsset,
  type ImagePickerOptions,
} from "expo-image-picker";
import { CameraIcon, ImageIcon, XIcon } from "phosphor-react-native";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_IMAGES = 5;

const PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 1,
  allowsMultipleSelection: true,
};

const ItemIdentityStepScreen = () => {
  const images = usePostCreationStore((state) => state.images);
  const setImages = usePostCreationStore((state) => state.setImages);
  const removeImageAt = usePostCreationStore((state) => state.removeImageAt);
  const setPrimaryImage = usePostCreationStore((state) => state.setPrimaryImage);

  const [isPickerSheetVisible, setIsPickerSheetVisible] = useState(false);

  const handleTakePhoto = async () => {
    setIsPickerSheetVisible(false);
    const permission = await requestCameraPermissionsAsync();
    if (!permission.granted) {
      toast.error("Camera permission is required to take photos.");
      return;
    }
    const result = await launchCameraAsync({ ...PICKER_OPTIONS, allowsMultipleSelection: false });
    if (!result.canceled && result.assets.length > 0) {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const newImages: ImagePickerAsset[] = [...images, ...result.assets.slice(0, remaining)];
      setImages(newImages);
    }
  };

  const handlePickImages = async () => {
    setIsPickerSheetVisible(false);
    const granted = await ensureMediaPermission();
    if (!granted) {
      toast.error("Media library permission is required to pick photos.");
      return;
    }
    const result = await launchImageLibraryAsync(PICKER_OPTIONS);
    if (!result.canceled && result.assets.length > 0) {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const newImages: ImagePickerAsset[] = [...images, ...result.assets.slice(0, remaining)];
      setImages(newImages);
    }
  };

  const pickerMenuOptions: MenuOption[] = [
    {
      id: "camera",
      label: "Take photo",
      description: "Capture using your camera",
      icon: CameraIcon,
      onPress: handleTakePhoto,
    },
    {
      id: "gallery",
      label: "Choose from library",
      description: "Select from your photo library",
      icon: ImageIcon,
      onPress: handlePickImages,
    },
  ];

  const slots = Array.from({ length: MAX_IMAGES }, (_, i) => images[i] ?? null);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-xl pb-xl"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="py-lg">
          <Text className="text-textPrimary font-normal text-2xl pr-xl tracking-tight">
            Add photos of your item
          </Text>
          <Text className="text-textSecondary text-base font-thin mt-2">
            Choose up to {MAX_IMAGES} clear photos. Your first photo becomes the
            main image, so start with the clearest full view.
          </Text>
        </View>

        {/* Hero slot */}
        <View className="mt-4">
          <HeroSlot
            image={slots[0]}
            onPress={() => setIsPickerSheetVisible(true)}
            onRemove={() => removeImageAt(0)}
          />
        </View>

        {/* Secondary slots grid */}
        <View className="flex-row flex-wrap gap-2 mt-2">
          {slots.slice(1).map((image, i) => {
            const storeIndex = i + 1;
            return (
              <SecondarySlot
                key={storeIndex}
                image={image}
                onPress={() => {
                  if (image) {
                    setPrimaryImage(storeIndex);
                  } else {
                    setIsPickerSheetVisible(true);
                  }
                }}
                onRemove={() => removeImageAt(storeIndex)}
              />
            );
          })}
        </View>

        {/* Quality tips */}
        <View className="mt-6 bg-muted rounded-xl p-4 gap-1">
          <Text className="text-textSecondary text-sm font-medium mb-1">Photo tips</Text>
          <Text className="text-textSecondary text-sm">• Start with a full-item photo</Text>
          <Text className="text-textSecondary text-sm">
            {"• Add close-ups of damage, stickers, or unique marks"}
          </Text>
          <Text className="text-textSecondary text-sm">• Use bright, clear photos</Text>
        </View>
      </ScrollView>

      <MenuBottomSheet
        isVisible={isPickerSheetVisible}
        onClose={() => setIsPickerSheetVisible(false)}
        options={pickerMenuOptions}
      />
    </SafeAreaView>
  );
};

// ------------------------------------------------------------------
// Hero (slot 0) — full-width, taller tile
// ------------------------------------------------------------------

type HeroSlotProps = {
  image: ImagePickerAsset | null;
  onPress: () => void;
  onRemove: () => void;
};

const HeroSlot = ({ image, onPress, onRemove }: HeroSlotProps) => {
  if (!image) {
    return (
      <Pressable
        onPress={onPress}
        className="w-full aspect-square bg-muted rounded-xl items-center justify-center border border-divider"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        accessibilityLabel="Add photo"
        accessibilityRole="button"
      >
        <ImageIcon size={40} color={colors.text.muted} />
        <Text className="text-textMuted text-sm mt-2">Tap to add main photo</Text>
      </Pressable>
    );
  }

  return (
    <View className="w-full aspect-square rounded-xl overflow-hidden">
      <Image
        source={{ uri: image.uri }}
        className="w-full h-full"
        resizeMode="cover"
      />
      {/* Main photo badge */}
      <View className="absolute bottom-3 left-3 bg-black/60 rounded-full px-3 py-1">
        <Text className="text-white text-xs font-medium">Main photo</Text>
      </View>
      {/* Remove button */}
      <TouchableOpacity
        className="absolute top-3 right-3 bg-black/60 rounded-full p-1"
        onPress={onRemove}
        hitSlop={8}
        accessibilityLabel="Remove photo"
        accessibilityRole="button"
      >
        <XIcon size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// ------------------------------------------------------------------
// Secondary slot (slots 1–4) — half-width tiles
// ------------------------------------------------------------------

type SecondarySlotProps = {
  image: ImagePickerAsset | null;
  onPress: () => void;
  onRemove: () => void;
};

const SecondarySlot = ({ image, onPress, onRemove }: SecondarySlotProps) => {
  if (!image) {
    return (
      <Pressable
        onPress={onPress}
        className="bg-muted rounded-xl items-center justify-center border border-divider"
        style={({ pressed }) => ({ flex: 1, minWidth: "45%", aspectRatio: 1, opacity: pressed ? 0.7 : 1 })}
        accessibilityLabel="Add photo"
        accessibilityRole="button"
      >
        <ImageIcon size={28} color={colors.text.muted} />
      </Pressable>
    );
  }

  return (
    <View
      className="rounded-xl overflow-hidden"
      style={{ flex: 1, minWidth: "45%", aspectRatio: 1 }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
        accessibilityLabel="Set as main photo"
        accessibilityRole="button"
      >
        <Image
          source={{ uri: image.uri }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </Pressable>
      <TouchableOpacity
        className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
        onPress={onRemove}
        hitSlop={8}
        accessibilityLabel="Remove photo"
        accessibilityRole="button"
      >
        <XIcon size={14} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ItemIdentityStepScreen;
