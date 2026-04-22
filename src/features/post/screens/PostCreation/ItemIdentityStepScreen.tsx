import { usePostCreationStore } from "@/src/features/post/hooks";
import { toast } from "@/src/shared/components/ui/toast";
import { ensureMediaPermission } from "@/src/shared/services";
import { colors } from "@/src/shared/theme/colors";
import { Nullable } from "@/src/shared/types";
import {
  launchImageLibraryAsync,
  launchCameraAsync,
  requestCameraPermissionsAsync,
  type ImagePickerAsset,
  type ImagePickerOptions,
} from "expo-image-picker";
import { ImageIcon, CameraIcon, XIcon } from "phosphor-react-native";
import { MenuBottomSheet } from "@/src/shared/components/ui/MenuBottomSheet";
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

const PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 1,
  allowsMultipleSelection: true,
};

const CAMERA_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 1,
};

const ItemIdentityStepScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const secondarySize = 0.4 * screenWidth;

  const images = usePostCreationStore((state) => state.draftImages);
  const addMulti = usePostCreationStore((state) => state.addImages);
  const removeImage = usePostCreationStore((state) => state.removeImage);
  const maxImages = usePostCreationStore((state) => state.maxImages);

  const [isPickerSheetVisible, setIsPickerSheetVisible] = React.useState(false);

  const openGallery = async () => {
    setIsPickerSheetVisible(false);
    const granted = await ensureMediaPermission();
    if (!granted) {
      toast.error("Media library permission is required to pick photos.");
      return;
    }

    const result = await launchImageLibraryAsync(PICKER_OPTIONS);
    if (result.canceled || result.assets.length === 0) return;
    addMulti(result.assets);
  };

  const takePhoto = async () => {
    setIsPickerSheetVisible(false);
    const { status } = await requestCameraPermissionsAsync();
    if (status !== "granted") {
      toast.error("Camera permission is required to take photos.");
      return;
    }
    const result = await launchCameraAsync(CAMERA_OPTIONS);
    if (result.canceled || result.assets.length === 0) return;
    addMulti(result.assets);
  };

  const emptySlots = Math.min(maxImages - images.length, 4);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["bottom"]}>
      <View className="flex-1 px-xl pb-md">
        {/* Header */}
        <View className="py-md">
          <Text className="text-textPrimary font-normal text-2xl tracking-tight">
            Add photos
          </Text>
          <Text className="text-textSecondary text-sm font-thin mt-1">
            Up to {maxImages} photos. Clear photos increase the matching rate.
          </Text>
        </View>

        {/* Hero slot */}
        <View className="">
          <HeroSlot
            image={images[0]}
            onPress={() => setIsPickerSheetVisible(true)}
            onRemove={() => removeImage(0)}
          />
        </View>

        {/* Secondary slots grid */}
        <View className="flex-row flex-wrap justify-between gap-y-2 mt-2">
          {images.slice(1).map((image, i) => {
            const storeIndex = i + 1;
            return (
              <View key={storeIndex}>
                <SecondarySlot
                  image={image}
                  size={secondarySize}
                  onPress={() => setIsPickerSheetVisible(true)}
                  onRemove={() => removeImage(storeIndex)}
                />
              </View>
            );
          })}

          {Array.from({ length: emptySlots })
            .slice(0)
            .map((_, i) => {
              const storeIndex = i + 1;
              return (
                <View key={storeIndex}>
                  <SecondarySlot
                    image={null}
                    size={secondarySize}
                    onPress={() => setIsPickerSheetVisible(true)}
                    onRemove={() => removeImage(storeIndex)}
                  />
                </View>
              );
            })}
        </View>
      </View>
      <MenuBottomSheet
        isVisible={isPickerSheetVisible}
        onClose={() => setIsPickerSheetVisible(false)}
        options={[
          {
            id: "gallery",
            label: "Open Gallery",
            description: "Pick from your photo library",
            icon: ImageIcon,
            onPress: openGallery,
          },
          {
            id: "camera",
            label: "Take Photo",
            description: "Use your camera",
            icon: CameraIcon,
            onPress: takePhoto,
          },
        ]}
      />
    </SafeAreaView>
  );
};

type HeroSlotProps = {
  image: Nullable<ImagePickerAsset>;
  onPress: () => void;
  onRemove: () => void;
};

const HeroSlot = ({ image, onPress, onRemove }: HeroSlotProps) => {
  if (!image) {
    return (
      <Pressable
        onPress={onPress}
        className="w-full aspect-[4/3] bg-surface items-center justify-center border border-dashed border-mutedForeground"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <ImageIcon size={64} color={colors.mutedForeground} weight="thin" />
      </Pressable>
    );
  }

  return (
    <View className="w-full aspect-[4/3] overflow-hidden">
      <Image
        source={{ uri: image.uri }}
        className="w-full h-full"
        resizeMode="cover"
      />

      <TouchableOpacity
        className="absolute top-3 right-3 bg-black/60 rounded-full p-1"
        onPress={onRemove}
        hitSlop={8}
      >
        <XIcon size={16} color={colors.white} weight="thin" />
      </TouchableOpacity>
    </View>
  );
};

type SecondarySlotProps = {
  image: Nullable<ImagePickerAsset>;
  size: number;
  onPress: () => void;
  onRemove: () => void;
};

const SecondarySlot = ({
  image,
  size,
  onPress,
  onRemove,
}: SecondarySlotProps) => {
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
      <Image
        source={{ uri: image.uri }}
        className="w-full h-full"
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

export default ItemIdentityStepScreen;
