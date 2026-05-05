import { useActivateC2CReturnReport } from "@/src/features/handover/hooks";
import { DeliverC2CReturnReportRequest } from "@/src/features/handover/types/handover.dto";
import {
  AppBackButton,
  AppButton,
  AppImage,
  AppTipCard,
  MenuBottomSheet,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { ensureMediaPermission } from "@/src/shared/services";
import {
  CAMERA_OPTIONS,
  PICKER_OPTIONS,
  usePhotoStore,
} from "@/src/shared/store";
import { colors } from "@/src/shared/theme/colors";
import { typography } from "@/src/shared/theme/typography";
import { Nullable } from "@/src/shared/types";
import * as Haptics from "expo-haptics";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  type ImagePickerAsset,
} from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { CameraIcon, ImageIcon, XIcon } from "phosphor-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EvidenceUploadScreen = () => {
  const { handoverId } = useLocalSearchParams<{ handoverId: string }>();

  const { activate } = useActivateC2CReturnReport();
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const { width: screenWidth } = useWindowDimensions();
  const secondarySize = 0.4 * screenWidth;

  const isPickerSheetVisible = usePhotoStore(
    (state) => state.isPickerSheetVisible,
  );

  const closePickerSheet = usePhotoStore((state) => state.closePickerSheet);
  const openPickerSheet = usePhotoStore((state) => state.openPickerSheet);

  const maxImages = usePhotoStore((state) => state.maxImages);
  const draftImages = usePhotoStore((state) => state.draftImages);
  const removeImage = usePhotoStore((state) => state.removeImage);
  const emptySlots = Math.min(maxImages - draftImages.length, 4);
  const addMulti = usePhotoStore((state) => state.addImages);
  const uploadImages = usePhotoStore((state) => state.uploadImages);
  const getUploadedImageUrls = usePhotoStore(
    (state) => state.getUploadedImageUrls,
  );
  const reset = usePhotoStore((state) => state.reset);

  const isSaveDisabled = isSaveLoading || draftImages.length === 0;

  const openGallery = async () => {
    closePickerSheet();
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
    closePickerSheet();
    const { status } = await requestCameraPermissionsAsync();
    if (status !== "granted") {
      toast.error("Camera permission is required to take photos.");
      return;
    }
    const result = await launchCameraAsync(CAMERA_OPTIONS);
    if (result.canceled || result.assets.length === 0) return;
    addMulti(result.assets);
  };

  useEffect(() => {
    reset();
    return () => {
      reset();
    };
  }, []);

  const handleActivate = useCallback(async () => {
    try {
      setIsSaveLoading(true);

      await uploadImages();

      if (getUploadedImageUrls().length === 0) {
        toast.error("Please add at least one photo as evidence.");
        return;
      }

      const req: DeliverC2CReturnReportRequest = {
        reportId: handoverId,
        evidenceImageUrls: getUploadedImageUrls(),
      };

      await activate(req);

      router.back();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success("Success", "Item marked as delivered securely.");
    } catch (error) {
      console.error("Handover error:", error);
      toast.error("Error", "Could not complete handover. Please try again.");
    } finally {
      setIsSaveLoading(false);
    }
  }, [activate]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerTitle: "Upload Evidence",
          headerTitleAlign: "center",
          headerLeft: () => <AppBackButton />,
          headerBackVisible: false,
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      <View className="flex-1 px-xl pt-md gap-md">
        {/* Tip Card */}
        <AppTipCard
          title="Pro Tip"
          description="Stick your QR on items for a higher chance of recovery."
          type="tip"
        />

        {/* Hero slot */}
        <HeroSlot
          image={draftImages[0]}
          onPress={openPickerSheet}
          onRemove={() => removeImage(0)}
        />

        {/* Secondary slots grid */}
        <View className="flex-row flex-wrap justify-between gap-y-2 ">
          {draftImages.slice(1).map((image, i) => {
            const storeIndex = i + 1;
            return (
              <View key={storeIndex}>
                <SecondarySlot
                  image={image}
                  size={secondarySize}
                  onPress={openPickerSheet}
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
                    onPress={openPickerSheet}
                    onRemove={() => removeImage(storeIndex)}
                  />
                </View>
              );
            })}
        </View>
      </View>

      <View className="bg-surface border-t border-divider px-lg pt-md2">
        <AppButton
          title="Mark Delivered"
          onPress={handleActivate}
          loading={isSaveLoading}
          disabled={isSaveDisabled}
        />
      </View>

      <MenuBottomSheet
        isVisible={isPickerSheetVisible}
        onClose={closePickerSheet}
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
      <AppImage
        source={{ uri: image.uri }}
        style={{ width: "100%", height: "100%" }}
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

export default EvidenceUploadScreen;
