import { usePostCreationStore } from "@/src/features/post/hooks";
import { toast } from "@/src/shared/components/ui/toast";
import { ensureMediaPermission } from "@/src/shared/services";
import { colors } from "@/src/shared/theme/colors";
import {
  launchImageLibraryAsync,
  type ImagePickerAsset,
  type ImagePickerOptions,
} from "expo-image-picker";
import { ImageIcon, XIcon } from "phosphor-react-native";
import React from "react";
import {
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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
  const { width: screenWidth } = useWindowDimensions();
  // px-xl = 32 on each side, gap between the two tiles = 8
  const secondarySize = Math.floor((screenWidth - 32 * 2 - 8) / 2);

  const images = usePostCreationStore((state) => state.images);
  const setImages = usePostCreationStore((state) => state.setImages);
  const removeImageAt = usePostCreationStore((state) => state.removeImageAt);
  const setPrimaryImage = usePostCreationStore((state) => state.setPrimaryImage);

  const openGallery = async () => {
    const granted = await ensureMediaPermission();
    if (!granted) {
      toast.error("Media library permission is required to pick photos.");
      return;
    }
    const result = await launchImageLibraryAsync(PICKER_OPTIONS);
    if (!result.canceled && result.assets.length > 0) {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const next: ImagePickerAsset[] = [...images, ...result.assets.slice(0, remaining)];
      setImages(next);
    }
  };

  const slots = Array.from({ length: MAX_IMAGES }, (_, i) => images[i] ?? null);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["bottom"]}>
      <View className="flex-1 px-xl pb-md">
        {/* Header */}
        <View className="py-md">
          <Text className="text-textPrimary font-normal text-2xl tracking-tight">
            Add photos
          </Text>
          <Text className="text-textSecondary text-sm font-thin mt-1">
            Up to {MAX_IMAGES} photos. First photo is the main image.
          </Text>
        </View>

        {/* Hero slot */}
        <HeroSlot
          image={slots[0]}
          onPress={openGallery}
          onRemove={() => removeImageAt(0)}
        />

        {/* Secondary slots grid */}
        <View className="flex-row flex-wrap justify-between gap-y-2 mt-2">
          {slots.slice(1).map((image, i) => {
            const storeIndex = i + 1;
            return (
              <SecondarySlot
                key={storeIndex}
                image={image}
                size={secondarySize}
                onPress={() => {
                  if (image) {
                    setPrimaryImage(storeIndex);
                  } else {
                    openGallery();
                  }
                }}
                onRemove={() => removeImageAt(storeIndex)}
              />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

// ------------------------------------------------------------------
// Hero slot (slot 0)
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
        className="w-full aspect-[4/3] bg-surface rounded-xl items-center justify-center border border-dashed border-mutedForeground"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        accessibilityLabel="Add main photo"
        accessibilityRole="button"
      >
        <ImageIcon size={36} color={colors.text.muted} />
        <Text className="text-textMuted text-sm mt-2">Tap to add main photo</Text>
      </Pressable>
    );
  }

  return (
    <View className="w-full aspect-[4/3] rounded-xl overflow-hidden">
      <Image source={{ uri: image.uri }} className="w-full h-full" resizeMode="cover" />
      <View className="absolute bottom-3 left-3 bg-black/60 rounded-full px-3 py-1">
        <Text className="text-white text-xs font-medium">Main photo</Text>
      </View>
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
// Secondary slots (slots 1–4)
// ------------------------------------------------------------------

type SecondarySlotProps = {
  image: ImagePickerAsset | null;
  size: number;
  onPress: () => void;
  onRemove: () => void;
};

const SecondarySlot = ({ image, size, onPress, onRemove }: SecondarySlotProps) => {
  if (!image) {
    return (
      <Pressable
        onPress={onPress}
        className="bg-surface rounded-xl items-center justify-center border border-dashed border-mutedForeground"
        style={({ pressed }) => ({ width: size, height: size, opacity: pressed ? 0.7 : 1 })}
        accessibilityLabel="Add photo"
        accessibilityRole="button"
      >
        <ImageIcon size={26} color={colors.text.muted} />
      </Pressable>
    );
  }

  return (
    <View
      className="rounded-xl overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
        accessibilityLabel="Set as main photo"
        accessibilityRole="button"
      >
        <Image source={{ uri: image.uri }} className="w-full h-full" resizeMode="cover" />
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
